const User = require('../models/User');
const Module = require('../models/Module');
const Schedule = require('../models/Schedule');
const Enrollment = require('../models/Enrollment');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { BlobServiceClient } = require('@azure/storage-blob');

// Azure Storage Configuration
const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'uploads';

let containerClient = null;
if (AZURE_CONNECTION_STRING) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
  containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
}

// @desc    Post announcement in a module
// @route   POST /api/professor/announcements
// @access  Private (Professor only)
const postAnnouncement = async (req, res) => {
  try {
    const { moduleCode, title, message } = req.body;
    const profId = req.user._id; // From auth middleware

    if (!moduleCode || !title || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const module = await Module.findOne({ module_code: moduleCode });
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    module.announcements.push({
      title,
      message,
      posted_by: profId,
      posted_at: new Date(),
    });

    const saved = await module.save();
    console.log('Announcement saved for module:', moduleCode, 'Total announcements:', saved.announcements.length);
    res.json({ message: 'Announcement posted successfully', module: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get announcements for professor's modules
// @route   GET /api/professor/announcements
// @access  Private (Professor only)
const getAnnouncements = async (req, res) => {
  try {
    const profId = req.user._id;
    
    const modules = await Module.find({ prof_id: profId })
      .select('module_code module_name announcements');

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload document/material to a module
// @route   POST /api/professor/materials
// @access  Private (Professor only)
const uploadMaterial = async (req, res) => {
  try {
    let { moduleCode, category, title } = req.body;

    if (!moduleCode || !category || !title) {
      if (req.file) fs.unlinkSync(req.file.path); // Clean up if validation fails
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const module = await Module.findOne({ module_code: moduleCode });
    if (!module) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Module not found' });
    }

    let fileUrl = '';
    let extractedText = '';

    if (req.file) {
      // 1. Extract text locally if PDF
      if (req.file.mimetype === 'application/pdf') {
        try {
          const dataBuffer = fs.readFileSync(req.file.path);
          const data = await pdf(dataBuffer);
          extractedText = data.text;
        } catch (parseError) {
          console.error('Error parsing PDF:', parseError);
        }
      }

      // 2. Upload to Azure if configured
      if (containerClient) {
        try {
          const blobName = `${moduleCode}_${Date.now()}_${req.file.originalname}`;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
          
          await blockBlobClient.uploadFile(req.file.path, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype }
          });
          
          fileUrl = blockBlobClient.url;
          console.log(`Uploaded to Azure: ${fileUrl}`);
          
          // Delete local file after cloud upload
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error('Azure Upload Error:', uploadError);
          // Fallback to local URL if Azure fails but file exists
          const host = req.get('host');
          const protocol = req.protocol;
          fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }
      } else {
        // No Azure config, stay local
        const host = req.get('host');
        const protocol = req.protocol;
        fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
    } else {
      return res.status(400).json({ message: 'File is required' });
    }

    module.materials.push({
      category,
      title,
      file_url: fileUrl,
      original_name: req.file?.originalname || 'external_link',
      mime_type: req.file?.mimetype || 'text/html',
      file_size: req.file?.size || null,
      text_content: extractedText,
      uploaded_at: new Date(),
    });

    await module.save();
    res.json({ message: 'Material uploaded successfully', module });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove document/material from a module
// @route   DELETE /api/professor/materials/:moduleCode/:materialId
// @access  Private (Professor only)
const removeMaterial = async (req, res) => {
  try {
    const { moduleCode, materialId } = req.params;

    const module = await Module.findOne({ module_code: moduleCode });
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const material = module.materials.id(materialId);
    if (material && material.file_url.includes('blob.core.windows.net') && containerClient) {
      try {
        // Extract blob name from URL
        const blobName = material.file_url.split('/').pop();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
        console.log(`Deleted blob from Azure: ${blobName}`);
      } catch (deleteError) {
        console.error('Error deleting blob from Azure:', deleteError);
      }
    }

    module.materials = module.materials.filter(
      (m) => m._id.toString() !== materialId
    );

    await module.save();
    res.json({ message: 'Material removed successfully', module });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get professor's teaching schedule
// @route   GET /api/professor/schedule
// @access  Private (Professor only)
const getTeachingSchedule = async (req, res) => {
  try {
    const profId = req.user._id;

    // Get professor's modules
    const modules = await Module.find({ prof_id: profId }).select('module_code');
    const moduleCodes = modules.map((m) => m.module_code);

    // Get schedule for those modules
    const schedule = await Schedule.find({
      module_code: { $in: moduleCodes },
      type: 'class',
    }).sort({ specific_date: 1 });

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get professor's classes (modules they teach)
// @route   GET /api/professor/classes
// @access  Private (Professor only)
const getClasses = async (req, res) => {
  try {
    const profId = req.user._id;

    const modules = await Module.find({ prof_id: profId })
      .select('module_code module_name credits materials');

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students in a professor's class
// @route   GET /api/professor/students/:moduleCode
// @access  Private (Professor only)
const getClassStudents = async (req, res) => {
  try {
    const { moduleCode } = req.params;

    // Get all enrollments for this module
    const enrollments = await Enrollment.find({
      module_code: moduleCode,
      status: 'enrolled',
    }).lean();

    // Get student details
    const studentIds = enrollments.map((e) => e.student_id);
    const students = await User.find({
      user_id: { $in: studentIds },
    }).select('user_id full_name email');

    // Combine enrollment and student data
    const result = enrollments.map((enrollment) => {
      const student = students.find((s) => s.user_id === enrollment.student_id);
      return {
        ...enrollment,
        full_name: student?.full_name || 'Unknown',
        email: student?.email || 'N/A',
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students across professor's classes
// @route   GET /api/professor/students
// @access  Private (Professor only)
const getAllClassStudents = async (req, res) => {
  try {
    const profId = req.user._id;

    // Get professor's modules
    const modules = await Module.find({ prof_id: profId }).select('module_code');
    const moduleCodes = modules.map((m) => m.module_code);

    // Get all enrollments
    const enrollments = await Enrollment.find({
      module_code: { $in: moduleCodes },
      status: 'enrolled',
    }).lean();

    // Get unique student IDs
    const studentIds = [...new Set(enrollments.map((e) => e.student_id))];
    const students = await User.find({
      user_id: { $in: studentIds },
    }).select('user_id full_name email');

    // Combine with enrollment and module info
    const result = enrollments.map((enrollment) => {
      const student = students.find((s) => s.user_id === enrollment.student_id);
      return {
        student_id: enrollment.student_id,
        full_name: student?.full_name || 'Unknown',
        email: student?.email || 'N/A',
        module_code: enrollment.module_code,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get professor's profile
// @route   GET /api/professor/profile
// @access  Private (Professor only)
const getProfile = async (req, res) => {
  try {
    const profId = req.user._id;

    const user = await User.findById(profId).select(
      'full_name email phone address avatar_url office_hours teaching_modules'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update professor's profile
// @route   PUT /api/professor/profile
// @access  Private (Professor only)
const updateProfile = async (req, res) => {
  try {
    const profId = req.user._id;
    const { full_name, phone, address, avatar_url, office_hours } = req.body;

    const user = await User.findByIdAndUpdate(
      profId,
      {
        full_name,
        phone,
        address,
        avatar_url,
        office_hours,
      },
      { new: true }
    ).select('full_name email phone address avatar_url office_hours');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postAnnouncement,
  getAnnouncements,
  uploadMaterial,
  removeMaterial,
  getTeachingSchedule,
  getClasses,
  getClassStudents,
  getAllClassStudents,
  getProfile,
  updateProfile,
};

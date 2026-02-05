const User = require('../models/User');
const Module = require('../models/Module');
const Schedule = require('../models/Schedule');
const Enrollment = require('../models/Enrollment');

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
    // Handle both JSON and FormData requests
    let { moduleCode, category, title } = req.body;

    if (!moduleCode || !category || !title) {
      return res.status(400).json({ 
        message: 'Missing required fields: moduleCode, category, title',
        received: { moduleCode, category, title, hasFile: !!req.file }
      });
    }

    const module = await Module.findOne({ module_code: moduleCode });
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Create file URL (in production, upload to cloud storage and get URL)
    let fileUrl = '';
    if (req.file) {
      // Build absolute URL to uploaded file so frontend can open it directly
      const host = req.get('host');
      const protocol = req.protocol;
      fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
    } else {
      return res.status(400).json({ message: 'File is required' });
    }

    module.materials.push({
      category,
      title,
      file_url: fileUrl,
      original_name: req.file?.originalname || null,
      mime_type: req.file?.mimetype || null,
      file_size: req.file?.size || null,
      uploaded_at: new Date(),
    });

    await module.save();
    res.json({ message: 'Material uploaded successfully', module });
  } catch (error) {
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

const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { userId, password } = req.body; // Frontend still sends 'userId'

  console.log('\n----- Login Request Received -----');
  console.log(`Input Data: { userId: '${userId}', password: '${password ? '******' : '(none)'}' }`);

  try {
    // Search using the DB field 'user_id'
    const user = await User.findOne({ user_id: userId });

    if (user) {
        console.log(`> User found in DB: ${user.full_name} (${user.role})`);
    } else {
        console.log(`> User NOT found in DB for ID: ${userId}`);
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      
      console.log('> Password verification: SUCCESS');
      console.log(`> Generated Token: ${token}`);
      console.log('----- Login Successful -----\n');
      
      res.json({
        _id: user._id,
        name: user.full_name, // Map DB 'full_name' to Frontend 'name'
        email: user.email,
        role: user.role,
        userId: user.user_id, // Map DB 'user_id' to Frontend 'userId'
        initials: user.initials,
        token: token,
      });
    } else {
      console.log('> Password verification: FAILED');
      console.log('----- Login Failed -----\n');
      res.status(401).json({ message: 'Invalid User ID or password' });
    }
  } catch (error) {
    console.error('----- Login Error -----');
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get announcements for student's enrolled modules
// @route   GET /api/auth/announcements
// @access  Private (Student)
const getStudentAnnouncements = async (req, res) => {
  try {
    const studentId = req.user.user_id;

    // 1. Find all active enrollments for the student
    const enrollments = await Enrollment.find({ student_id: studentId, status: 'enrolled' });
    const moduleCodes = enrollments.map(e => e.module_code);

    if (moduleCodes.length === 0) {
      return res.json([]);
    }

    // 2. Fetch modules and their announcements
    const modules = await Module.find({ module_code: { $in: moduleCodes } })
      .select('module_code module_name announcements prof_id');

    // 3. Get professor details for these modules
    const profIds = modules.map(m => m.prof_id).filter(id => id);
    const professors = await User.find({ _id: { $in: profIds } }).select('full_name');

    // 4. Flatten and sort announcements
    let allAnnouncements = [];
    modules.forEach(mod => {
      const prof = professors.find(p => p._id.toString() === mod.prof_id?.toString());
      
      mod.announcements.forEach(ann => {
        allAnnouncements.push({
          _id: ann._id,
          module_code: mod.module_code,
          module_name: mod.module_name,
          professor_name: prof?.full_name || 'Professor',
          title: ann.title,
          message: ann.message,
          posted_at: ann.posted_at
        });
      });
    });

    // Sort by date descending
    allAnnouncements.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));

    res.json(allAnnouncements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Basic info editable by everyone (if role permissions in frontend allow)
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      
      // Professors can update office hours
      if (user.role === 'professor') {
        user.office_hours = req.body.office_hours || user.office_hours;
      }

      // Admins might want to update name/email via this endpoint too (optional)
      if (user.role === 'school_admin' || user.role === 'sys_admin') {
        user.full_name = req.body.full_name || user.full_name;
        user.email = req.body.email || user.email;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        user_id: updatedUser.user_id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        office_hours: updatedUser.office_hours,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser, getUserProfile, getStudentAnnouncements, updateUserProfile };

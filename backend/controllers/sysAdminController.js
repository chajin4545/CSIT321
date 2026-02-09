const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const Feedback = require('../models/Feedback');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// @desc    Get System Admin Dashboard Stats
// @route   GET /api/sys-admin/dashboard
// @access  Private/SysAdmin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Users
    const totalUsers = await User.countDocuments();
    
    // 2. Active Users (Users active in ChatSessions in the last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeSessions = await ChatSession.find({ last_active: { $gte: oneDayAgo } }).distinct('user_id');
    const dailyActiveUsers = activeSessions.length;

    // 3. Total Conversations (Sessions active in the last 24h)
    const totalConversations = await ChatSession.countDocuments({ last_active: { $gte: oneDayAgo } });

    // 4. Average Response Time
    // Aggregate all messages where sender='bot' and response_time > 0
    const avgResponseData = await ChatSession.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.sender": "bot", "messages.response_time": { $gt: 0 } } },
      { $group: { _id: null, avgTime: { $avg: "$messages.response_time" } } }
    ]);
    
    const avgResponseTimeMs = avgResponseData.length > 0 ? avgResponseData[0].avgTime : 0;
    const avgResponseTimeSec = (avgResponseTimeMs / 1000).toFixed(2) + 's';

    res.json({
      totalUsers,
      dailyActiveUsers,
      totalConversations,
      avgResponseTime: avgResponseTimeSec
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all School Admins
// @route   GET /api/sys-admin/accounts
// @access  Private/SysAdmin
const getSchoolAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'school_admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new School Admin
// @route   POST /api/sys-admin/accounts
// @access  Private/SysAdmin
const createSchoolAdmin = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate random password or use default
    // In a real app, send this via email.
    const tempPassword = 'password123'; 
    
    // Generate ID
    const user_id = 'ADM-' + Math.floor(1000 + Math.random() * 9000);

    const user = await User.create({
      user_id,
      full_name: name,
      email,
      password: crypto.createHash('sha256').update(tempPassword).digest('hex'), // Simple hash for demo, assume matching User model logic if using bcrypt
      role: 'school_admin',
      phone,
      address,
      status: 'active'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        user_id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle User Status (Activate/Deactivate)
// @route   PUT /api/sys-admin/accounts/:id/toggle
// @access  Private/SysAdmin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id });

    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      const updatedUser = await user.save();
      res.json({ id: updatedUser.user_id, status: updatedUser.status });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get All Feedback
// @route   GET /api/sys-admin/feedback
// @access  Private/SysAdmin
const getAllFeedback = async (req, res) => {
  try {
    // 1. Fetch all feedback
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    // 2. Extract unique User IDs
    const userIds = [...new Set(feedback.map(f => f.user_id).filter(id => id))];

    // 3. Fetch User Details for those IDs
    const users = await User.find({ user_id: { $in: userIds } }).select('user_id full_name role');
    
    // 4. Create a map for quick lookup
    const userMap = {};
    users.forEach(u => {
        userMap[u.user_id] = u;
    });

    // 5. Transform for frontend
    const formatted = feedback.map(fb => {
        const u = userMap[fb.user_id];
        return {
            _id: fb._id,
            date: fb.createdAt.toISOString().split('T')[0],
            uid: fb.user_id || 'Guest',
            role: u ? u.role : 'Guest', // If user not found (deleted?), assume Guest or Unknown
            rating: fb.rating,
            cid: fb.target_id,
            comment: fb.comment
        };
    });

    // Calculate stats
    const total = feedback.length;
    const avg = total > 0 ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : 0;
    const negative = total > 0 ? ((feedback.filter(f => f.rating <= 2).length / total) * 100).toFixed(0) + '%' : '0%';

    res.json({
        stats: {
            average: avg,
            total: total,
            negative: negative
        },
        feedbacks: formatted
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats,
  getSchoolAdmins,
  createSchoolAdmin,
  toggleUserStatus,
  getAllFeedback
};

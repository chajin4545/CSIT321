const express = require('express');
const router = express.Router();
const { authUser, getUserProfile, getStudentAnnouncements, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/announcements', protect, getStudentAnnouncements);

module.exports = router;

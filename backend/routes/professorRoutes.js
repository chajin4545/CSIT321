const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/professorController');

// Multer configuration for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Protect all routes
router.use(protect);

// Announcements
router.post('/announcements', postAnnouncement);
router.get('/announcements', getAnnouncements);

// Materials (with file upload)
router.post('/materials', upload.single('file'), uploadMaterial);
router.delete('/materials/:moduleCode/:materialId', removeMaterial);

// Schedule
router.get('/schedule', getTeachingSchedule);

// Classes
router.get('/classes', getClasses);

// Students
router.get('/students', getAllClassStudents);
router.get('/students/:moduleCode', getClassStudents);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;

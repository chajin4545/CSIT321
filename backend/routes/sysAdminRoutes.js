const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getDashboardStats, 
  getSchoolAdmins, 
  createSchoolAdmin, 
  toggleUserStatus,
  getAllFeedback
} = require('../controllers/sysAdminController');

// All routes are protected and restricted to sys_admin
// NOTE: For development simplicity, we might relax the 'authorize' check if current user isn't strictly 'sys_admin' in DB yet.
// But we should stick to the requirement.
router.use(protect);
router.use(authorize('sys_admin'));

router.get('/dashboard', getDashboardStats);
router.get('/accounts', getSchoolAdmins);
router.post('/accounts', createSchoolAdmin);
router.put('/accounts/:id/toggle', toggleUserStatus);
router.get('/feedback', getAllFeedback);

module.exports = router;

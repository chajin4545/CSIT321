const express = require('express');
const router = express.Router();
const {
  getClassSchedules,
  createClassSchedule,
  updateClassSchedule,
  getExamSchedules,
  createExamSchedule,
  updateExamSchedule,
  getModules,
  createModule,
  updateModule,
  getStudents,
  createStudent,
  toggleStudentStatus,
  getEvents,
  createEvent,
  updateEvent,
} = require('../controllers/schoolAdminController');

// Class Schedules
router.get('/schedules/class', getClassSchedules);
router.post('/schedules/class', createClassSchedule);
router.put('/schedules/class/:id', updateClassSchedule);

// Exam Schedules
router.get('/schedules/exam', getExamSchedules);
router.post('/schedules/exam', createExamSchedule);
router.put('/schedules/exam/:id', updateExamSchedule);

// Modules
router.get('/modules', getModules);
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);

// Students
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id/status', toggleStudentStatus);

// Events
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);

module.exports = router;

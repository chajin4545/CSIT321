const Schedule = require('../models/Schedule');
const Event = require('../models/Event');
const Module = require('../models/Module');
const User = require('../models/User');

// ========== SCHEDULES (Class Schedules) ==========

// Get all class schedules
const getClassSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ type: 'class' }).sort({ specific_date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a class schedule
const createClassSchedule = async (req, res) => {
  const { module_code, venue, start_time, end_time, specific_date, group_id } = req.body;

  try {
    const schedule = new Schedule({
      type: 'class',
      module_code,
      venue,
      start_time,
      end_time,
      specific_date,
      group_id,
    });
    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a class schedule
const updateClassSchedule = async (req, res) => {
  const { id } = req.params;
  const { module_code, venue, start_time, end_time, specific_date, group_id } = req.body;

  try {
    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { module_code, venue, start_time, end_time, specific_date, group_id },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ========== EXAMS ==========

// Get all exam schedules
const getExamSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ type: 'exam' }).sort({ specific_date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an exam schedule
const createExamSchedule = async (req, res) => {
  const { module_code, venue, start_time, end_time, specific_date } = req.body;

  try {
    const schedule = new Schedule({
      type: 'exam',
      module_code,
      venue,
      start_time,
      end_time,
      specific_date,
    });
    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an exam schedule
const updateExamSchedule = async (req, res) => {
  const { id } = req.params;
  const { module_code, venue, start_time, end_time, specific_date } = req.body;

  try {
    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { module_code, venue, start_time, end_time, specific_date },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ========== MODULES ==========

// Get all modules
const getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ module_code: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a module
const createModule = async (req, res) => {
  const { module_code, module_name, credits, prof_id } = req.body;

  try {
    const module = new Module({
      module_code,
      module_name,
      credits,
      prof_id,
    });
    const savedModule = await module.save();
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a module (name, description, credits)
const updateModule = async (req, res) => {
  const { id } = req.params;
  const { module_name, credits, prof_id } = req.body;

  try {
    const module = await Module.findByIdAndUpdate(
      id,
      { module_name, credits, prof_id },
      { new: true }
    );
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ========== USERS/STUDENTS ==========

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ user_id: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new student account
const createStudent = async (req, res) => {
  const { user_id, full_name, email, password, phone, address } = req.body;

  try {
    const student = new User({
      user_id,
      full_name,
      email,
      password,
      role: 'student',
      status: 'active',
      phone,
      address,
    });
    const savedStudent = await student.save();
    res.status(201).json({ 
      _id: savedStudent._id,
      user_id: savedStudent.user_id,
      full_name: savedStudent.full_name,
      email: savedStudent.email,
      status: savedStudent.status,
      role: savedStudent.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle student account status (active/inactive)
const toggleStudentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const student = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ========== EVENTS ==========

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ start_date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an event
const createEvent = async (req, res) => {
  const { title, description, venue, start_date, end_date, organizer, category, image_url } = req.body;

  try {
    const event = new Event({
      title,
      description,
      venue,
      start_date,
      end_date,
      organizer,
      category,
      image_url,
    });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, venue, start_date, end_date, organizer, category, image_url } = req.body;

  try {
    const event = await Event.findByIdAndUpdate(
      id,
      { title, description, venue, start_date, end_date, organizer, category, image_url },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
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
};

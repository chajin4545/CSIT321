const mongoose = require('mongoose');

// Unified collection for Class Schedules and Exam Schedules
const scheduleSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['class', 'exam'],
      required: true,
    },
    module_code: {
      type: String,
      ref: 'Module',
      required: true,
    },
    venue: { type: String }, // e.g., "LT1.1" or "Exam Hall A"
    
    // Time details
    day_of_week: { type: String }, // e.g., "Monday" (Relevant for recurring classes)
    start_time: { type: String }, // "14:00"
    end_time: { type: String }, // "16:00"
    
    // For one-off events like Exams
    specific_date: { type: Date }, 
    
    group_id: { type: String }, // e.g., "Tutorial Group A" (Optional)
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;

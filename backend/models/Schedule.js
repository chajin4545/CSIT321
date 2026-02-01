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
    day_of_week: { type: String }, // e.g., "Monday" (Helper/derived field)
    start_time: { type: String, required: true }, // "14:00"
    end_time: { type: String, required: true }, // "16:00"
    
    // Calendar-based Date (Required for ALL events in irregular scheduling)
    specific_date: { type: Date, required: true }, 
    
    group_id: { type: String }, // e.g., "Tutorial Group A" (Optional)
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;

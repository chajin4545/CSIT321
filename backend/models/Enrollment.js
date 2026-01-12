const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
  {
    student_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    module_code: {
      type: String,
      ref: 'Module',
      required: true,
    },
    semester: {
      type: String,
      required: true, // e.g., "2024-S1"
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'dropped'],
      default: 'enrolled',
    },
    grades: {
      midterm: { type: Number },
      final: { type: Number },
      coursework: { type: Number }, // Total from assignments
      overall: { type: String }, // e.g., "A", "B+", "Pass"
    },
    attendance_rate: { type: Number }, // Percentage (optional)
  },
  {
    timestamps: true,
  }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;

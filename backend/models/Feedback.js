const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      ref: 'User',
    }, // Anonymous if null
    target_type: {
      type: String,
      enum: ['app', 'course', 'chatbot'],
    },
    target_id: { type: String }, // session_id (if chatbot) or module_code (if course)
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: { type: String },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

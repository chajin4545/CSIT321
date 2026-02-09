const mongoose = require('mongoose');

const chatSessionSchema = mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      unique: true,
    }, // UUID
    user_id: {
      type: String,
      ref: 'User',
    }, // The student asking (optional for guests)
    is_guest: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['admin_support', 'course_tutor', 'guest_support'],
      required: true,
    },
    
    // Context fields
    related_module_code: {
      type: String,
      ref: 'Module',
    }, // Required if type is 'course_tutor'
    title: { type: String }, // e.g., "Question about Fees" or "CS305 Recursion Help"
    status: {
      type: String,
      enum: ['active', 'closed', 'archived'],
      default: 'active',
    },
    last_active: {
      type: Date,
      default: Date.now,
    },

    // Embedded Messages (Document size limit is 16MB)
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'bot', 'admin'],
          required: true,
        },
        sender_name: { type: String }, // Optional, for display
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        is_read: {
          type: Boolean,
          default: false,
        },
        response_time: {
          type: Number, // Time in ms taken to generate this response (for bot messages)
          default: 0
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;

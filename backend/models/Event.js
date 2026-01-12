const mongoose = require('mongoose');

// General school events (Open house, Hackathons, etc.)
const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: { type: String },
    venue: { type: String },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: { type: Date },
    organizer: { type: String }, // e.g., "Student Council"
    category: {
      type: String,
      enum: ['academic', 'social', 'sports', 'workshop'],
    },
    image_url: { type: String }, // For the event banner
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

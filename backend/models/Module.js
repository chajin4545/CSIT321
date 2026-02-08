const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema(
  {
    module_code: {
      type: String,
      required: true,
      unique: true,
    }, // e.g., "CS305" - Primary Key
    module_name: {
      type: String,
      required: true,
    }, // e.g., "Algorithms"
    credits: { type: Number },
    
    // References
    prof_id: {
      type: String,
      ref: 'User',
    }, // The lead professor
    
    // Embedded: Assignments
    assignments: [
      {
        title: { type: String }, // e.g., "Lab 1: Sorting"
        description: { type: String },
        due_date: { type: Date },
        max_score: { type: Number },
        weightage: { type: Number }, // Percentage of total grade
      },
    ],

    // Embedded: Announcements (Read-heavy, frequent access)
    announcements: [
      {
        title: { type: String },
        message: { type: String },
        posted_by: {
          type: String,
          ref: 'User',
        }, // prof_id or Name
        posted_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Link to materials
    materials: [
      {
        category: { type: String }, // "Lecture Notes", "Labs"
        title: { type: String },
        file_url: { type: String },
        original_name: { type: String },
        mime_type: { type: String },
        text_content: { type: String }, // Extracted text for RAG/Search
        uploaded_at: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;

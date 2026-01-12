const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    }, // e.g. "9234567"
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }, // Hashed
    role: {
      type: String,
      required: true,
      enum: ['student', 'professor', 'school_admin', 'sys_admin'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    
    // Profile Details
    phone: { type: String },
    address: { type: String },
    avatar_url: { type: String }, // URL to profile image
    
    // Student Specific
    // NOTE: Detailed enrollment data (grades) moved to 'Enrollment' collection.
    // We keep a lightweight array here for quick access if needed, or rely on queries.
    current_gpa: { type: Number },

    // Professor Specific
    teaching_modules: [{ type: String, ref: 'Module' }], // Array of Module Codes
    office_hours: { type: String }, // e.g., "Mon 2-4PM"
  },
  {
    timestamps: true,
  }
);

// Match user-entered password to hashed password in database
// Note: In your seed file, passwords are plain text 'password123'. 
// For this to work efficiently with the seed data for now, we will do a direct comparison.
// IN PRODUCTION: You MUST use bcrypt to hash passwords.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // TODO: Replace with bcrypt.compare(enteredPassword, this.password) after migration
  return enteredPassword === this.password; 
};

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
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
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'professor', 'school_admin', 'sys_admin'],
      default: 'student',
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    initials: { type: String },
    phone: { type: String },
    address: { type: String },
    status: { type: String, default: 'active' }
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

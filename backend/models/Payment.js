const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    payment_id: {
      type: String,
      unique: true,
    }, // e.g., "INV-2024-001"
    student_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    title: { type: String }, // e.g., "Tuition Fee - Semester 1 2024"
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'SGD',
    },
    due_date: { type: Date },
    paid_at: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
    },
    payment_method: { type: String }, // "Credit Card", "Bank Transfer"
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

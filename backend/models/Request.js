const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookTitle: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'checked_out'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  token: { type: String },
  pickupDeadline: { type: Date },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
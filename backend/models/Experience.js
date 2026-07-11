const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, default: '', trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null if current
  current: { type: Boolean, default: false },
  description: [{ type: String, required: true }], // bullet points
  technologies: [{ type: String, trim: true }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Languages', 'Frontend', 'Backend', 'Database', 'Deployment', 'CI/CD', 'Others'],
    default: 'Languages'
  },
  level: { type: Number, min: 0, max: 100, default: 80 }, // Percentage proficiency
  icon: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);

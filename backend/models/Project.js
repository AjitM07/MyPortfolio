const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  category: { type: String, default: 'Web Development', trim: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

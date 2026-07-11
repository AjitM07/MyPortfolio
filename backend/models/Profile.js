const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true }, // e.g. "Full Stack Developer & Designer"
  bio: { type: String, required: true },
  aboutImage: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  resumeUrl: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    email: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);

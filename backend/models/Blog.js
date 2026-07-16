const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { 
    type: String, 
    required: function() { return !this.isLinkedIn; } 
  }, // Markdown content, optional for LinkedIn posts
  isLinkedIn: { type: Boolean, default: false },
  linkedInUrl: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);

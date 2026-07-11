const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true }, // Markdown content
  tags: [{ type: String, trim: true }],
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);

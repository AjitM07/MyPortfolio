const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');

// Simple slugify helper
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Return published blogs for public, or filter by query (e.g. status)
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      // By default, public should only see published blogs
      // We'll let the frontend specify or default to published
      filter.status = 'published';
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/blogs/admin
// @desc    Get all blogs (including drafts) for Admin
// @access  Private
router.get('/admin', protect, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get a single blog by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    let image = { url: '', publicId: '' };
    if (req.file) {
      image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const blog = await Blog.create({
      title,
      content,
      tags: parsedTags,
      image,
      slug,
      status: status || 'draft'
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (content) blog.content = content;
    if (status) blog.status = status;

    if (tags) {
      blog.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    if (title && title !== blog.title) {
      blog.title = title;
      // Re-generate slug if title changes
      let baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      blog.slug = slug;
    }

    if (req.file) {
      // Delete old image
      if (blog.image && blog.image.publicId) {
        try {
          await cloudinary.uploader.destroy(blog.image.publicId);
        } catch (cErr) {
          console.error('Failed to delete old blog image:', cErr.message);
        }
      }
      blog.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete image from Cloudinary
    if (blog.image && blog.image.publicId) {
      try {
        await cloudinary.uploader.destroy(blog.image.publicId);
      } catch (cErr) {
        console.error('Failed to delete blog image on Cloudinary:', cErr.message);
      }
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

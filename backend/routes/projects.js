const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');

// @route   GET /api/projects
// @desc    Get all projects (ordered)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, technologies, githubLink, liveLink, category, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    let parsedTechnologies = [];
    if (technologies) {
      parsedTechnologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((tech) => tech.trim()).filter(Boolean);
    }

    let image = { url: '', publicId: '' };
    if (req.file) {
      image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const project = await Project.create({
      title,
      subtitle: subtitle || '',
      description,
      technologies: parsedTechnologies,
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      image,
      category: category || 'Web Development',
      order: order ? Number(order) : 0
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, technologies, githubLink, liveLink, category, order } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title) project.title = title;
    if (subtitle !== undefined) project.subtitle = subtitle;
    if (description) project.description = description;
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (liveLink !== undefined) project.liveLink = liveLink;
    if (category) project.category = category;
    if (order !== undefined) project.order = Number(order);

    if (technologies) {
      project.technologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((tech) => tech.trim()).filter(Boolean);
    }

    if (req.file) {
      // Delete old image
      if (project.image && project.image.publicId) {
        try {
          await cloudinary.uploader.destroy(project.image.publicId);
        } catch (cErr) {
          console.error('Failed to delete old project image:', cErr.message);
        }
      }
      project.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image from Cloudinary
    if (project.image && project.image.publicId) {
      try {
        await cloudinary.uploader.destroy(project.image.publicId);
      } catch (cErr) {
        console.error('Failed to delete project image on Cloudinary:', cErr.message);
      }
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

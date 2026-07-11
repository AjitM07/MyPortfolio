const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/skills
// @desc    Create a skill
// @access  Private
router.post('/', protect, upload.single('icon'), async (req, res) => {
  try {
    const { name, category, level } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    let icon = { url: '', publicId: '' };
    if (req.file) {
      icon = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const skill = await Skill.create({
      name,
      category,
      level: level ? Number(level) : 80,
      icon
    });

    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', protect, upload.single('icon'), async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (level !== undefined) skill.level = Number(level);

    if (req.file) {
      // Delete old icon
      if (skill.icon && skill.icon.publicId) {
        try {
          await cloudinary.uploader.destroy(skill.icon.publicId);
        } catch (cErr) {
          console.error('Failed to delete old skill icon:', cErr.message);
        }
      }
      skill.icon = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Delete image from Cloudinary
    if (skill.icon && skill.icon.publicId) {
      try {
        await cloudinary.uploader.destroy(skill.icon.publicId);
      } catch (cErr) {
        console.error('Failed to delete skill icon on Cloudinary:', cErr.message);
      }
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

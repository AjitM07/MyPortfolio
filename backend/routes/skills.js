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

// Configure local disk storage pointing to frontend/public/skills
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const localDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.resolve(__dirname, '../../frontend/public/skills');
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    // Keep the original name
    cb(null, file.originalname);
  }
});

const uploadLocal = multer({
  storage: localDiskStorage,
});

// @route   POST /api/skills/upload-local
// @desc    Upload skill icon to local frontend/public/skills AND Cloudinary
// @access  Private
router.post('/upload-local', protect, uploadLocal.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const localPath = req.file.path;
    const filename  = req.file.filename;

    // Also upload to Cloudinary so it's available as a fallback CDN URL
    let cloudinaryUrl = '';
    let cloudinaryPublicId = '';
    try {
      const cloudResult = await cloudinary.uploader.upload(localPath, {
        folder: 'portfolio/skills',
        public_id: path.parse(filename).name, // e.g. "numpy" from "numpy.png"
        overwrite: true,
        resource_type: 'image'
      });
      cloudinaryUrl      = cloudResult.secure_url;
      cloudinaryPublicId = cloudResult.public_id;
    } catch (cErr) {
      console.error('Cloudinary upload failed (local copy still saved):', cErr.message);
    }

    // Update the matching Skill document (case-insensitive name match)
    if (cloudinaryUrl) {
      try {
        // Normalize: strip extension and use base filename as the skill name key
        const baseName = path.parse(filename).name.toLowerCase();
        // Find skill whose lowercase name matches
        const skills = await Skill.find();
        const matched = skills.find(s => {
          const n = s.name.toLowerCase().trim()
            .replace(/\+\+/g, 'pp')
            .replace(/#/g, 'sharp')
            .replace(/\.js$/g, 'js')
            .replace(/\.ts$/g, 'ts')
            .replace(/[^a-z0-9]/g, '');
          return n === baseName;
        });
        if (matched) {
          matched.icon = { url: cloudinaryUrl, publicId: cloudinaryPublicId };
          await matched.save();
        }
      } catch (dbErr) {
        console.error('Failed to update skill icon in DB:', dbErr.message);
      }
    }

    res.json({
      message: 'Image uploaded to local skills folder and Cloudinary!',
      filename,
      path: `/skills/${filename}`,
      cloudinaryUrl
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;


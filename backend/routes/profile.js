const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');

// @route   GET /api/profile
// @desc    Get profile details
// @access  Public
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Return a default initial profile
      profile = await Profile.create({
        name: 'Ajit Mangsulikar',
        title: 'Full Stack Developer',
        bio: 'Welcome to my portfolio! Upgrade in progress.',
        socialLinks: {
          github: 'https://github.com/AjitM07',
          linkedin: '',
          twitter: '',
          email: ''
        }
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/profile
// @desc    Update profile details & upload assets
// @access  Private
router.put('/', protect, upload.fields([
  { name: 'aboutImage', maxCount: 1 },
  { name: 'resumeUrl', maxCount: 1 }
]), async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    const { name, title, bio, github, linkedin, twitter, email } = req.body;

    if (name) profile.name = name;
    if (title) profile.title = title;
    if (bio) profile.bio = bio;

    // Handle social links
    profile.socialLinks = {
      github: github !== undefined ? github : profile.socialLinks.github,
      linkedin: linkedin !== undefined ? linkedin : profile.socialLinks.linkedin,
      twitter: twitter !== undefined ? twitter : profile.socialLinks.twitter,
      email: email !== undefined ? email : profile.socialLinks.email
    };

    // Handle uploaded files
    if (req.files) {
      if (req.files.aboutImage && req.files.aboutImage[0]) {
        // Delete old image if exists
        if (profile.aboutImage && profile.aboutImage.publicId) {
          try {
            await cloudinary.uploader.destroy(profile.aboutImage.publicId);
          } catch (cErr) {
            console.error('Failed to delete old aboutImage:', cErr.message);
          }
        }
        profile.aboutImage = {
          url: req.files.aboutImage[0].path,
          publicId: req.files.aboutImage[0].filename
        };
      }

      if (req.files.resumeUrl && req.files.resumeUrl[0]) {
        // Delete old resume if exists
        if (profile.resumeUrl && profile.resumeUrl.publicId) {
          try {
            await cloudinary.uploader.destroy(profile.resumeUrl.publicId, { resource_type: 'raw' });
          } catch (cErr) {
            console.error('Failed to delete old resume:', cErr.message);
          }
        }
        profile.resumeUrl = {
          url: req.files.resumeUrl[0].path,
          publicId: req.files.resumeUrl[0].filename
        };
      }
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

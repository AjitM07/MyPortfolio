const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');

// @route   GET /api/certifications
// @desc    Get all certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, issueDate: -1 });
    res.json(certifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/certifications
// @desc    Create a certification
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { name, issuingOrganization, issueDate, credentialUrl, order } = req.body;

    if (!name || !issuingOrganization || !issueDate) {
      return res.status(400).json({ message: 'Name, organization, and issue date are required' });
    }

    let file = { url: '', publicId: '' };
    if (req.file) {
      file = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const certification = await Certification.create({
      name,
      issuingOrganization,
      issueDate: new Date(issueDate),
      credentialUrl: credentialUrl || '',
      file,
      order: order ? Number(order) : 0
    });

    res.status(201).json(certification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/certifications/:id
// @desc    Update a certification
// @access  Private
router.put('/:id', protect, upload.single('file'), async (req, res) => {
  try {
    const { name, issuingOrganization, issueDate, credentialUrl, order } = req.body;
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    if (name) certification.name = name;
    if (issuingOrganization) certification.issuingOrganization = issuingOrganization;
    if (issueDate) certification.issueDate = new Date(issueDate);
    if (credentialUrl !== undefined) certification.credentialUrl = credentialUrl;
    if (order !== undefined) certification.order = Number(order);

    if (req.file) {
      // Delete old file
      if (certification.file && certification.file.publicId) {
        const isPdf = certification.file.url.endsWith('.pdf') || certification.file.url.includes('/raw/');
        try {
          await cloudinary.uploader.destroy(
            certification.file.publicId,
            isPdf ? { resource_type: 'raw' } : undefined
          );
        } catch (cErr) {
          console.error('Failed to delete old certification file:', cErr.message);
        }
      }
      certification.file = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await certification.save();
    res.json(certification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/certifications/:id
// @desc    Delete a certification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    // Delete file from Cloudinary
    if (certification.file && certification.file.publicId) {
      const isPdf = certification.file.url.endsWith('.pdf') || certification.file.url.includes('/raw/');
      try {
        await cloudinary.uploader.destroy(
          certification.file.publicId,
          isPdf ? { resource_type: 'raw' } : undefined
        );
      } catch (cErr) {
        console.error('Failed to delete certification file on Cloudinary:', cErr.message);
      }
    }

    await certification.deleteOne();
    res.json({ message: 'Certification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

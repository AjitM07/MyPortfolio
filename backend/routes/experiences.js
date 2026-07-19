const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');

// @route   GET /api/experiences
// @desc    Get all experiences (timeline order)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/experiences
// @desc    Create an experience
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { company, role, location, startDate, endDate, current, description, technologies, order } = req.body;

    if (!company || !role || !startDate || !description) {
      return res.status(400).json({ message: 'Company, role, start date, and description are required' });
    }

    let parsedDescription = [];
    if (description) {
      parsedDescription = Array.isArray(description)
        ? description
        : description.split('\n').map((d) => d.trim()).filter(Boolean);
    }

    let parsedTechnologies = [];
    if (technologies) {
      parsedTechnologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((tech) => tech.trim()).filter(Boolean);
    }

    const experience = await Experience.create({
      company,
      role,
      location: location || '',
      startDate: new Date(startDate),
      endDate: current ? null : (endDate ? new Date(endDate) : null),
      current: current === 'true' || current === true,
      description: parsedDescription,
      technologies: parsedTechnologies,
      order: order ? Number(order) : 0
    });

    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/experiences/:id
// @desc    Update an experience
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { company, role, location, startDate, endDate, current, description, technologies, order } = req.body;
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    if (company) experience.company = company;
    if (role) experience.role = role;
    if (location !== undefined) experience.location = location;
    if (startDate) experience.startDate = new Date(startDate);

    if (current !== undefined) {
      const isCurrent = current === 'true' || current === true;
      experience.current = isCurrent;
      if (isCurrent) {
        experience.endDate = null;
      } else if (endDate) {
        experience.endDate = new Date(endDate);
      }
    } else if (endDate !== undefined) {
      experience.endDate = endDate ? new Date(endDate) : null;
    }

    if (description) {
      experience.description = Array.isArray(description)
        ? description
        : description.split('\n').map((d) => d.trim()).filter(Boolean);
    }

    if (technologies) {
      experience.technologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((tech) => tech.trim()).filter(Boolean);
    }

    if (order !== undefined) experience.order = Number(order);

    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/experiences/:id
// @desc    Delete an experience
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    await experience.deleteOne();
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

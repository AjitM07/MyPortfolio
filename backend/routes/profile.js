const express = require('express');
const router = express.Router();
const https = require('https');
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
          linkedin: 'https://www.linkedin.com/in/ajit-mangsulikar',
          twitter: '',
          instagram: 'https://www.instagram.com/ajit__m07/',
          email: 'mailto:ajitmangsulikar123@gmail.com'
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

    const { name, title, bio, github, linkedin, twitter, instagram, email } = req.body;

    if (name) profile.name = name;
    if (title) profile.title = title;
    if (bio) profile.bio = bio;

    // Handle social links
    profile.socialLinks = {
      github: github !== undefined ? github : profile.socialLinks.github,
      linkedin: linkedin !== undefined ? linkedin : profile.socialLinks.linkedin,
      twitter: twitter !== undefined ? twitter : profile.socialLinks.twitter,
      instagram: instagram !== undefined ? instagram : profile.socialLinks.instagram,
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
            const isRaw = profile.resumeUrl.url && profile.resumeUrl.url.includes('/raw/');
            await cloudinary.uploader.destroy(profile.resumeUrl.publicId, { resource_type: isRaw ? 'raw' : 'image' });
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

const http = require('http');

// Helper: GET a URL, follow redirects (handles http↔https switches), pipe to res
function proxyFile(url, res, redirectsLeft = 10) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (e) {
    console.error('[download-resume] Invalid URL:', url);
    return res.status(502).json({ message: 'Invalid storage URL.' });
  }

  const mod = parsedUrl.protocol === 'https:' ? https : http;
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    headers: {
      // Some CDNs block requests without a User-Agent
      'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
    },
  };

  console.log(`[download-resume] Fetching (${redirectsLeft} redirects left): ${url}`);

  mod.get(options, (upstream) => {
    console.log(`[download-resume] Status ${upstream.statusCode} from ${url}`);
    console.log(`[download-resume] Location: ${upstream.headers.location || 'none'}`);

    // Follow redirects
    if (upstream.statusCode >= 300 && upstream.statusCode < 400 && upstream.headers.location) {
      if (redirectsLeft === 0) {
        upstream.resume();
        return res.status(502).json({ message: 'Too many redirects from storage.' });
      }
      upstream.resume();
      // Resolve relative redirect URLs against the current URL
      const next = new URL(upstream.headers.location, url).href;
      return proxyFile(next, res, redirectsLeft - 1);
    }

    if (upstream.statusCode !== 200) {
      console.error(`[download-resume] Unexpected status ${upstream.statusCode}`);
      upstream.resume();
      return res.status(502).json({
        message: `Failed to fetch resume (status ${upstream.statusCode}).`,
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Ajit_Resume.pdf"');
    res.setHeader('Cache-Control', 'no-cache');
    upstream.pipe(res);
  }).on('error', (err) => {
    console.error('[download-resume] Network error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Network error while streaming resume.' });
    }
  });
}

// @route   GET /api/profile/download-resume
// @desc    Proxy-download the resume PDF with correct Content-Disposition header
// @access  Public
router.get('/download-resume', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile || !profile.resumeUrl || !profile.resumeUrl.url) {
      return res.status(404).json({ message: 'No resume has been uploaded yet.' });
    }

    console.log('[download-resume] DB URL:', profile.resumeUrl.url);
    proxyFile(profile.resumeUrl.url, res);

  } catch (err) {
    console.error('[download-resume] DB error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

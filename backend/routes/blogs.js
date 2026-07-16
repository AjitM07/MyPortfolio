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

// Helper to parse LinkedIn URL and get the embed URL
const getLinkedInEmbedUrl = (input) => {
  if (!input) return '';
  
  // If it is iframe HTML, extract src
  if (input.includes('<iframe')) {
    const match = input.match(/src="([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  let url = input.trim();
  
  // Handle various LinkedIn URL formats to extract the URN
  const urnMatch = url.match(/urn:li:(activity|share|ugcPost):\d+/);
  if (urnMatch) {
    return `https://www.linkedin.com/embed/feed/update/${urnMatch[0]}`;
  }
  
  // E.g. posts/activity-7212345678901234567
  const activityMatch = url.match(/activity-(\d+)/);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  }
  
  // E.g. posts/share-7212345678901234567
  const shareMatch = url.match(/share-(\d+)/);
  if (shareMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${shareMatch[1]}`;
  }
  
  // E.g. ugcPost-7212345678901234567
  const ugcMatch = url.match(/ugcPost-(\d+)/);
  if (ugcMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcMatch[1]}`;
  }

  // E.g. /posts/some-title-1234567890123456789
  const genericPostsMatch = url.match(/\/posts\/[a-zA-Z0-9_-]+-(\d+)/) || url.match(/\/posts\/(\d+)/);
  if (genericPostsMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${genericPostsMatch[1]}`;
  }
  
  // If already embed URL, return as is
  if (url.includes('linkedin.com/embed/')) {
    return url;
  }
  
  return url;
};

const extractLinkedInDate = (url) => {
  if (!url) return null;
  const match = url.match(/\b\d{19}\b/);
  if (match) {
    try {
      const id = BigInt(match[0]);
      const timestampMs = id >> 22n;
      return new Date(Number(timestampMs));
    } catch (e) {
      console.error('Error extracting date from LinkedIn URN:', e.message);
    }
  }
  return null;
};

const fetchLinkedInCaption = async (url) => {
  try {
    if (!url) return '';
    const res = await fetch(url);
    if (!res.ok) return '';
    const html = await res.text();
    
    // First try: extract from the actual embed post commentary element to preserve formatting
    const commentaryMatch = html.match(/<p\b[^>]*data-test-id="main-feed-activity-embed-card__commentary"[^>]*>([\s\S]*?)<\/p>/i) ||
                            html.match(/<p\b[^>]*class="[^"]*attributed-text-segment-list__content[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
    
    if (commentaryMatch) {
      let processed = commentaryMatch[1].replace(/<br\s*\/?>/gi, '\n');
      processed = processed.replace(/<[^>]+>/g, '');
      processed = processed
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ');
      return processed.trim();
    }

    // Fallback: extract from meta tags if embed structure not found
    const match = html.match(/<meta name="description" content="([^"]+)"/) ||
                  html.match(/<meta property="og:description" content="([^"]+)"/) ||
                  html.match(/<meta name="twitter:description" content="([^"]+)"/);
                  
    if (match) {
      let content = match[1];
      content = content
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ');
      return content.trim();
    }
  } catch (err) {
    console.error('Error scraping LinkedIn caption:', err.message);
  }
  return '';
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

    const blogs = await Blog.find(filter);
    blogs.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });
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
    const blogs = await Blog.find();
    blogs.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });
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
    
    // Fallback: fetch caption at runtime if content is empty
    if (blog.isLinkedIn && (!blog.content || !blog.content.trim()) && blog.linkedInUrl) {
      const caption = await fetchLinkedInCaption(blog.linkedInUrl);
      if (caption) {
        blog.content = caption;
        await blog.save(); // Cache it in DB
      }
    }
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private
router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, tags, status, isLinkedIn, linkedInUrl, publishedAt } = req.body;
    const isLinkedInBool = isLinkedIn === 'true' || isLinkedIn === true;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!isLinkedInBool && !content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if (isLinkedInBool && !linkedInUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required for LinkedIn posts' });
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
    let image2 = { url: '', publicId: '' };
    let image3 = { url: '', publicId: '' };

    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        image = {
          url: req.files['image'][0].path,
          publicId: req.files['image'][0].filename
        };
      }
      if (req.files['image2'] && req.files['image2'][0]) {
        image2 = {
          url: req.files['image2'][0].path,
          publicId: req.files['image2'][0].filename
        };
      }
      if (req.files['image3'] && req.files['image3'][0]) {
        image3 = {
          url: req.files['image3'][0].path,
          publicId: req.files['image3'][0].filename
        };
      }
    }

    let normalizedLinkedInUrl = '';
    let finalPublishedAt = publishedAt || undefined;
    if (isLinkedInBool && linkedInUrl) {
      normalizedLinkedInUrl = getLinkedInEmbedUrl(linkedInUrl);
      const extractedDate = extractLinkedInDate(normalizedLinkedInUrl);
      if (extractedDate) {
        finalPublishedAt = extractedDate;
      }
    }

    let finalContent = content || '';
    if (isLinkedInBool && (!finalContent || !finalContent.trim()) && normalizedLinkedInUrl) {
      finalContent = await fetchLinkedInCaption(normalizedLinkedInUrl);
    }

    const blog = await Blog.create({
      title,
      content: finalContent,
      tags: parsedTags,
      image,
      image2,
      image3,
      slug,
      status: status || 'draft',
      isLinkedIn: isLinkedInBool,
      linkedInUrl: normalizedLinkedInUrl,
      publishedAt: finalPublishedAt
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, tags, status, isLinkedIn, linkedInUrl, publishedAt } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const isLinkedInBool = isLinkedIn !== undefined ? (isLinkedIn === 'true' || isLinkedIn === true) : blog.isLinkedIn;

    if (isLinkedInBool && !linkedInUrl && !blog.linkedInUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required for LinkedIn posts' });
    }

    if (content !== undefined) blog.content = content;
    if (status) blog.status = status;
    if (publishedAt !== undefined) blog.publishedAt = publishedAt || undefined;
    blog.isLinkedIn = isLinkedInBool;

    if (isLinkedInBool && linkedInUrl !== undefined) {
      blog.linkedInUrl = getLinkedInEmbedUrl(linkedInUrl);
      const extractedDate = extractLinkedInDate(blog.linkedInUrl);
      if (extractedDate) {
        blog.publishedAt = extractedDate;
      }
    } else if (!isLinkedInBool) {
      blog.linkedInUrl = '';
    }

    // Auto-fetch LinkedIn caption if content is empty during update
    if (isLinkedInBool && (!blog.content || !blog.content.trim()) && blog.linkedInUrl) {
      const caption = await fetchLinkedInCaption(blog.linkedInUrl);
      if (caption) {
        blog.content = caption;
      }
    }

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

    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        // Delete old image
        if (blog.image && blog.image.publicId) {
          try {
            await cloudinary.uploader.destroy(blog.image.publicId);
          } catch (cErr) {
            console.error('Failed to delete old blog image:', cErr.message);
          }
        }
        blog.image = {
          url: req.files['image'][0].path,
          publicId: req.files['image'][0].filename
        };
      }

      if (req.files['image2'] && req.files['image2'][0]) {
        // Delete old image2
        if (blog.image2 && blog.image2.publicId) {
          try {
            await cloudinary.uploader.destroy(blog.image2.publicId);
          } catch (cErr) {
            console.error('Failed to delete old blog image2:', cErr.message);
          }
        }
        blog.image2 = {
          url: req.files['image2'][0].path,
          publicId: req.files['image2'][0].filename
        };
      }

      if (req.files['image3'] && req.files['image3'][0]) {
        // Delete old image3
        if (blog.image3 && blog.image3.publicId) {
          try {
            await cloudinary.uploader.destroy(blog.image3.publicId);
          } catch (cErr) {
            console.error('Failed to delete old blog image3:', cErr.message);
          }
        }
        blog.image3 = {
          url: req.files['image3'][0].path,
          publicId: req.files['image3'][0].filename
        };
      }
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

    // Delete images from Cloudinary
    const imagesToDelete = [blog.image, blog.image2, blog.image3];
    for (const img of imagesToDelete) {
      if (img && img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (cErr) {
          console.error('Failed to delete blog image on Cloudinary:', cErr.message);
        }
      }
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

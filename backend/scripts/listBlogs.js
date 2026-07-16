const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const list = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB...');

    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs:`);
    blogs.forEach((b) => {
      console.log(`- Slug: ${b.slug}, Title: ${b.title}, isLinkedIn: ${b.isLinkedIn}, Url: ${b.linkedInUrl}`);
    });

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error listing:', error);
    process.exit(1);
  }
};

list();

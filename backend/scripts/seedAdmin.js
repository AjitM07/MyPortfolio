const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!username || !password) {
    console.error('\n[Error] Please provide username and password.');
    console.error('Usage options:');
    console.error('  1. Add ADMIN_USERNAME and ADMIN_PASSWORD to backend/.env');
    console.error('  2. Run command: node seedAdmin.js <username> <password>\n');
    process.exit(1);
  }

  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error('[Error] MONGODB_URI is not defined in your env.');
      process.exit(1);
    }

    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear any existing admins to enforce "Only one user has access"
    const deleteCount = await Admin.deleteMany({});
    if (deleteCount.deletedCount > 0) {
      console.log(`Cleared ${deleteCount.deletedCount} existing admin accounts.`);
    }

    // Create the new singular Admin
    const admin = new Admin({ username, password });
    await admin.save();

    console.log(`\n[Success] Singular Admin user "${username}" created successfully!`);
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during admin seeding:', error.message);
    process.exit(1);
  }
};

seedAdmin();

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_achievements');
    
    console.log('✅ Connected to MongoDB');
    
    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Super Admin already exists');
      console.log('Email:', existingSuperAdmin.email);
      process.exit(0);
    }
    
    // Create super admin
    const superAdmin = await User.create({
      name: 'System Administrator',
      email: 'superadmin@example.com',
      password: 'SuperAdmin123!',
      role: 'superadmin',
      isApproved: true,
      isActive: true
    });
    
    console.log('✅ Super Admin created successfully!');
    console.log('Email: superadmin@example.com');
    console.log('Password: SuperAdmin123!');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();

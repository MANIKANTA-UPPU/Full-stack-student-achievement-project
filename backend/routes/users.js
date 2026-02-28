const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// Get all users
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { role, department } = req.query;
    let query = {};
    
    if (role) query.role = role;
    if (department) query.department = department;
    
    // Admin can only see students from their field
    if (req.user.role === 'admin' && role === 'student') {
      query.department = req.user.field;
    }
    
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, users: users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Approve admin user
router.put('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve user', error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/superadmin/pending-admins
// @desc    Get all pending admin approvals
// @access  Super Admin only
router.get('/pending-admins', auth, authorize('superadmin'), async (req, res) => {
  try {
    const pendingAdmins = await User.find({ 
      role: 'admin', 
      isApproved: false 
    }).select('-password');
    
    res.json({ success: true, admins: pendingAdmins });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending admins', error: error.message });
  }
});

// @route   PUT /api/superadmin/approve-admin/:id
// @desc    Approve admin account
// @access  Super Admin only
router.put('/approve-admin/:id', auth, authorize('superadmin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, message: 'Admin approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve admin', error: error.message });
  }
});

// @route   PUT /api/superadmin/reject-admin/:id
// @desc    Reject admin account
// @access  Super Admin only
router.delete('/reject-admin/:id', auth, authorize('superadmin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, message: 'Admin rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject admin', error: error.message });
  }
});

// @route   PUT /api/superadmin/toggle-user/:id
// @desc    Activate/Deactivate user account
// @access  Super Admin only
router.put('/toggle-user/:id', auth, authorize('superadmin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      success: true, 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, 
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
  }
});

// @route   GET /api/superadmin/all-users
// @desc    Get all users
// @access  Super Admin only
router.get('/all-users', auth, authorize('superadmin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// @route   GET /api/superadmin/stats
// @desc    Get system statistics
// @access  Super Admin only
router.get('/stats', auth, authorize('superadmin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin', isApproved: true });
    const pendingAdmins = await User.countDocuments({ role: 'admin', isApproved: false });
    const activeUsers = await User.countDocuments({ isActive: true });
    
    res.json({ 
      success: true, 
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        pendingAdmins,
        activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

module.exports = router;

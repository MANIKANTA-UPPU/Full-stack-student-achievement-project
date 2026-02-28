const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// Dashboard analytics
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    let studentQuery = { role: 'student' };
    let achievementQuery = {};
    
    // Admin can only see stats for their field
    if (req.user.role === 'admin') {
      studentQuery.department = req.user.field;
    }
    
    const totalStudents = await User.countDocuments(studentQuery);
    const totalActivities = await Activity.countDocuments();
    
    // Get student IDs for admin's field
    let studentIds = [];
    if (req.user.role === 'admin') {
      const students = await User.find(studentQuery).select('_id');
      studentIds = students.map(s => s._id);
      achievementQuery.student = { $in: studentIds };
    }
    
    const totalAchievements = await Achievement.countDocuments(achievementQuery);
    const pendingApprovals = await Achievement.countDocuments({ ...achievementQuery, status: 'pending' });

    const fieldStats = await Activity.aggregate([
      { $group: { _id: '$field', count: { $sum: 1 } } }
    ]);

    const categoryStats = await Achievement.aggregate([
      ...(req.user.role === 'admin' ? [{ $match: { student: { $in: studentIds } } }] : []),
      { $lookup: { from: 'activities', localField: 'activity', foreignField: '_id', as: 'activityData' } },
      { $unwind: '$activityData' },
      { $group: { _id: '$activityData.category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: { totalStudents, totalActivities, totalAchievements, pendingApprovals },
        fieldStats,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

module.exports = router;
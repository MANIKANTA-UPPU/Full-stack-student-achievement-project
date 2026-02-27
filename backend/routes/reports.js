const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// Dashboard analytics
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalActivities = await Activity.countDocuments();
    const totalAchievements = await Achievement.countDocuments();
    const pendingApprovals = await Achievement.countDocuments({ status: 'pending' });

    const fieldStats = await Activity.aggregate([
      { $group: { _id: '$field', count: { $sum: 1 } } }
    ]);

    const categoryStats = await Achievement.aggregate([
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
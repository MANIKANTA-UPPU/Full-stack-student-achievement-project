const Achievement = require('../models/Achievement');
const Activity = require('../models/Activity');

// @desc    Get achievements
// @route   GET /api/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, student } = req.query;
    
    let query = {};
    
    // If user is student, only show their achievements
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (student) {
      query.student = student;
    }
    
    if (status) query.status = status;

    const achievements = await Achievement.find(query)
      .populate('student', 'name email department year')
      .populate('activity', 'title category field')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter achievements by admin's field
    let filteredAchievements = achievements;
    if (req.user.role === 'admin') {
      filteredAchievements = achievements.filter(ach => 
        ach.student && ach.student.department === req.user.field
      );
    }

    const total = req.user.role === 'admin' ? filteredAchievements.length : await Achievement.countDocuments(query);

    res.json({
      success: true,
      achievements: filteredAchievements,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch achievements', error: error.message });
  }
};

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private
const createAchievement = async (req, res) => {
  try {
    const { awardTitle, description, position } = req.body;

    const achievement = await Achievement.create({
      student: req.user.role === 'student' ? req.user.id : req.body.student,
      awardTitle,
      description,
      position: position || 'Participation'
    });

    const populatedAchievement = await Achievement.findById(achievement._id)
      .populate('student', 'name email department year');

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      achievement: populatedAchievement
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create achievement', error: error.message });
  }
};

// @desc    Update achievement status
// @route   PUT /api/achievements/:id/status
// @access  Private (Admin only)
const updateAchievementStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const updateData = {
      status,
      remarks,
      approvedBy: req.user.id,
      approvedAt: status === 'approved' ? new Date() : null
    };

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('student', 'name email department year')
     .populate('activity', 'title category field');

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json({
      success: true,
      message: `Achievement ${status} successfully`,
      achievement: achievement
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update achievement', error: error.message });
  }
};

// @desc    Get achievement statistics
// @route   GET /api/achievements/stats
// @access  Private
const getAchievementStats = async (req, res) => {
  try {
    let matchStage = {};
    
    if (req.user.role === 'student') {
      matchStage.student = req.user._id;
    }

    const stats = await Achievement.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Achievement.aggregate([
      { $match: matchStage },
      { $lookup: { from: 'activities', localField: 'activity', foreignField: '_id', as: 'activityData' } },
      { $unwind: '$activityData' },
      {
        $group: {
          _id: '$activityData.category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, approved: 0, pending: 0, rejected: 0 },
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievementStatus,
  getAchievementStats
};
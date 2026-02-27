const Activity = require('../models/Activity');
const Teacher = require('../models/Teacher');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, field, search } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (field) query.field = field;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const activities = await Activity.find(query)
      .populate('assignedTeacher', 'name email field')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      data: activities,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('assignedTeacher', 'name email field')
      .populate('createdBy', 'name email');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activity', error: error.message });
  }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private (Admin only)
const createActivity = async (req, res) => {
  try {
    const { title, description, category, field, assignedTeacher, eventDate, venue, maxParticipants, tags } = req.body;

    // Verify teacher belongs to the selected field
    const teacher = await Teacher.findById(assignedTeacher);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (teacher.field !== field && field !== 'General') {
      return res.status(400).json({ 
        message: `Teacher's field (${teacher.field}) does not match activity field (${field})` 
      });
    }

    const activity = await Activity.create({
      title,
      description,
      category,
      field,
      assignedTeacher,
      createdBy: req.user.id,
      eventDate,
      venue,
      maxParticipants: maxParticipants || 0,
      tags: tags || []
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate('assignedTeacher', 'name email field')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: populatedActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create activity', error: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Admin only)
const updateActivity = async (req, res) => {
  try {
    const { assignedTeacher, field } = req.body;

    // If updating teacher, verify field match
    if (assignedTeacher && field) {
      const teacher = await Teacher.findById(assignedTeacher);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      if (teacher.field !== field && field !== 'General') {
        return res.status(400).json({ 
          message: `Teacher's field (${teacher.field}) does not match activity field (${field})` 
        });
      }
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTeacher', 'name email field')
     .populate('createdBy', 'name email');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update activity', error: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Admin only)
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete activity', error: error.message });
  }
};

// @desc    Get teachers by field
// @route   GET /api/activities/teachers/:field
// @access  Private (Admin only)
const getTeachersByField = async (req, res) => {
  try {
    const { field } = req.params;
    
    const query = field === 'General' ? {} : { field };
    const teachers = await Teacher.find({ ...query, isActive: true })
      .select('name email field designation')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers', error: error.message });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getTeachersByField
};
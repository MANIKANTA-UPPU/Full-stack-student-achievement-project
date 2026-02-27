const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getTeachersByField
} = require('../controllers/activityController');
const { auth, adminOnly } = require('../middleware/auth');
const { validateActivity } = require('../middleware/validation');

// @route   GET /api/activities
// @desc    Get all activities
// @access  Private
router.get('/', auth, getActivities);

// @route   GET /api/activities/teachers/:field
// @desc    Get teachers by field
// @access  Private (Admin only)
router.get('/teachers/:field', auth, adminOnly, getTeachersByField);

// @route   GET /api/activities/:id
// @desc    Get single activity
// @access  Private
router.get('/:id', auth, getActivity);

// @route   POST /api/activities
// @desc    Create activity
// @access  Private (Admin only)
router.post('/', auth, adminOnly, validateActivity, createActivity);

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private (Admin only)
router.put('/:id', auth, adminOnly, updateActivity);

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, deleteActivity);

module.exports = router;
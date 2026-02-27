const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const { auth, adminOnly } = require('../middleware/auth');

// Get all teachers
router.get('/', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ name: 1 });
    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers', error: error.message });
  }
});

// Create teacher
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create teacher', error: error.message });
  }
});

// Update teacher
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update teacher', error: error.message });
  }
});

module.exports = router;
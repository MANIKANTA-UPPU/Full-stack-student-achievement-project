const express = require('express');
const router = express.Router();
const {
  getAchievements,
  createAchievement,
  updateAchievementStatus,
  getAchievementStats
} = require('../controllers/achievementController');
const { auth, adminOnly } = require('../middleware/auth');
const { validateAchievement } = require('../middleware/validation');

router.get('/', auth, getAchievements);
router.get('/stats', auth, getAchievementStats);
router.post('/', auth, validateAchievement, createAchievement);
router.put('/:id/status', auth, adminOnly, updateAchievementStatus);

module.exports = router;
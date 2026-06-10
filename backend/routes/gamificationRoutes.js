// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const router = express.Router();
const {
  getUserGamificationStats,
  getLeaderboard,
  getAllBadges,
  recordDailyLogin,
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/gamification/stats/:userId - Get user's gamification stats
router.get('/stats/:userId', getUserGamificationStats);

// GET /api/gamification/leaderboard - Get leaderboard
router.get('/leaderboard', getLeaderboard);

// GET /api/gamification/badges - Get all available badges
router.get('/badges', getAllBadges);

// POST /api/gamification/daily-login - Record daily login (protected)
router.post('/daily-login', protect, recordDailyLogin);

module.exports = router;

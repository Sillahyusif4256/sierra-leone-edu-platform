// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const asyncHandler = require('express-async-handler');
const UserStats = require('../models/UserStats');
const User = require('../models/User');
const Resource = require('../models/Resource');
const { getUserStats, updateStreak } = require('../utils/badgeUtils');

// GET /api/gamification/stats/:userId - Get user's gamification stats
const getUserGamificationStats = asyncHandler(async (req, res) => {
  const stats = await getUserStats(req.params.userId);
  const user = await User.findById(req.params.userId);

  // Update streak on login
  await updateStreak(req.params.userId);

  res.json({ stats, user });
});

// GET /api/gamification/leaderboard - Get leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  const { period = 'all', type = 'points', limit = 10 } = req.query;

  let dateFilter = {};
  const now = new Date();

  if (period === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = { updatedAt: { $gte: weekAgo } };
  } else if (period === 'month') {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateFilter = { updatedAt: { $gte: monthAgo } };
  }

  let sortOption = {};
  if (type === 'points') {
    sortOption = { points: -1 };
  } else if (type === 'uploads') {
    sortOption = { uploadCount: -1 };
  } else if (type === 'reviews') {
    sortOption = { helpfulVotes: -1 };
  }

  const leaderboard = await UserStats.find(dateFilter)
    .sort(sortOption)
    .limit(parseInt(limit))
    .populate('userId', 'name email profilePicture role');

  // Add rank to each entry
  const rankedLeaderboard = leaderboard.map((entry, index) => ({
    rank: index + 1,
    userId: entry.userId._id,
    name: entry.userId.name,
    email: entry.userId.email,
    profilePicture: entry.userId.profilePicture,
    role: entry.userId.role,
    points: entry.points,
    level: entry.level,
    badges: entry.badges,
    uploadCount: entry.uploadCount,
    downloadCount: entry.downloadCount,
    helpfulVotes: entry.helpfulVotes,
    streak: entry.streak,
  }));

  res.json(rankedLeaderboard);
});

// GET /api/gamification/badges - Get all available badges
const getAllBadges = asyncHandler(async (req, res) => {
  const { BADGES } = require('../utils/badgeUtils');
  const badges = Object.values(BADGES);
  res.json(badges);
});

// POST /api/gamification/daily-login - Record daily login and award points
const recordDailyLogin = asyncHandler(async (req, res) => {
  const stats = await updateStreak(req.user._id);
  res.json({ stats });
});

module.exports = {
  getUserGamificationStats,
  getLeaderboard,
  getAllBadges,
  recordDailyLogin,
};

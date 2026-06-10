// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const UserStats = require('../models/UserStats');
const Resource = require('../models/Resource');
const User = require('../models/User');

// Badge definitions
const BADGES = {
  FIRST_UPLOAD: {
    id: 'first_upload',
    name: 'First Upload',
    icon: '🎓',
    description: 'Upload your first resource',
  },
  KNOWLEDGE_SHARER: {
    id: 'knowledge_sharer',
    name: 'Knowledge Sharer',
    icon: '📚',
    description: 'Upload 10 approved resources',
  },
  TOP_CONTRIBUTOR: {
    id: 'top_contributor',
    name: 'Top Contributor',
    icon: '🌟',
    description: 'Upload 50 approved resources',
  },
  POPULAR_RESOURCE: {
    id: 'popular_resource',
    name: 'Popular Resource',
    icon: '⬇️',
    description: 'Have a resource downloaded 100 times',
  },
  REVIEWER: {
    id: 'reviewer',
    name: 'Reviewer',
    icon: '✍️',
    description: 'Write 10 reviews',
  },
  ON_FIRE: {
    id: 'on_fire',
    name: 'On Fire',
    icon: '🔥',
    description: 'Maintain a 7-day login streak',
  },
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    icon: '👑',
    description: 'Reach 1000 points',
  },
  SIERRA_LEONE_PRIDE: {
    id: 'sierra_leone_pride',
    name: 'Sierra Leone Pride',
    icon: '🇸🇱',
    description: 'Upload resources in all subjects',
  },
};

// Get or create user stats
const getUserStats = async (userId) => {
  let stats = await UserStats.findOne({ userId });
  if (!stats) {
    stats = await UserStats.create({ userId });
  }
  return stats;
};

// Add points to user
const addPoints = async (userId, points) => {
  const stats = await getUserStats(userId);
  stats.points += points;
  await stats.save();
  return stats;
};

// Check and award badges
const checkAndAwardBadges = async (userId) => {
  const stats = await getUserStats(userId);
  const user = await User.findById(userId);
  const newBadges = [];

  // First Upload
  if (stats.uploadCount >= 1 && !hasBadge(stats, BADGES.FIRST_UPLOAD.id)) {
    newBadges.push(BADGES.FIRST_UPLOAD);
  }

  // Knowledge Sharer
  if (stats.uploadCount >= 10 && !hasBadge(stats, BADGES.KNOWLEDGE_SHARER.id)) {
    newBadges.push(BADGES.KNOWLEDGE_SHARER);
  }

  // Top Contributor
  if (stats.uploadCount >= 50 && !hasBadge(stats, BADGES.TOP_CONTRIBUTOR.id)) {
    newBadges.push(BADGES.TOP_CONTRIBUTOR);
  }

  // Popular Resource
  const userResources = await Resource.find({ author: userId });
  const hasPopularResource = userResources.some(r => r.downloads >= 100);
  if (hasPopularResource && !hasBadge(stats, BADGES.POPULAR_RESOURCE.id)) {
    newBadges.push(BADGES.POPULAR_RESOURCE);
  }

  // Reviewer
  if (stats.helpfulVotes >= 10 && !hasBadge(stats, BADGES.REVIEWER.id)) {
    newBadges.push(BADGES.REVIEWER);
  }

  // On Fire
  if (stats.streak >= 7 && !hasBadge(stats, BADGES.ON_FIRE.id)) {
    newBadges.push(BADGES.ON_FIRE);
  }

  // Champion
  if (stats.points >= 1000 && !hasBadge(stats, BADGES.CHAMPION.id)) {
    newBadges.push(BADGES.CHAMPION);
  }

  // Sierra Leone Pride
  const subjects = new Set(userResources.map(r => r.subject));
  if (subjects.size >= 9 && !hasBadge(stats, BADGES.SIERRA_LEONE_PRIDE.id)) {
    newBadges.push(BADGES.SIERRA_LEONE_PRIDE);
  }

  // Add new badges
  for (const badge of newBadges) {
    stats.badges.push({
      badgeId: badge.id,
      name: badge.name,
      icon: badge.icon,
      description: badge.description,
    });
  }

  // Calculate level based on points
  stats.level = Math.floor(stats.points / 100) + 1;

  await stats.save();
  return { stats, newBadges };
};

// Check if user has a badge
const hasBadge = (stats, badgeId) => {
  return stats.badges.some(b => b.badgeId === badgeId);
};

// Update streak
const updateStreak = async (userId) => {
  const stats = await getUserStats(userId);
  const now = new Date();
  const lastActive = stats.lastActive;

  // Check if last active was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive.toDateString() === yesterday.toDateString()) {
    // Continue streak
    stats.streak += 1;
  } else if (lastActive.toDateString() !== now.toDateString()) {
    // Reset streak
    stats.streak = 1;
  }

  stats.lastActive = now;
  await stats.save();

  // Check for 7-day streak bonus
  if (stats.streak === 7) {
    await addPoints(userId, 20);
  }

  // Award daily login point
  if (lastActive.toDateString() !== now.toDateString()) {
    await addPoints(userId, 1);
  }

  return stats;
};

module.exports = {
  BADGES,
  getUserStats,
  addPoints,
  checkAndAwardBadges,
  hasBadge,
  updateStreak,
};

// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: [{
    badgeId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  uploadCount: {
    type: Number,
    default: 0,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  helpfulVotes: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  level: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
userStatsSchema.index({ points: -1 });
userStatsSchema.index({ streak: -1 });

module.exports = mongoose.model('UserStats', userStatsSchema);

// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const mongoose = require('mongoose');

const searchAnalyticsSchema = new mongoose.Schema({
  searchTerm: {
    type: String,
    required: true,
    trim: true
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  clickedResourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Anonymous searches
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
searchAnalyticsSchema.index({ searchTerm: 1, createdAt: -1 });
searchAnalyticsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchAnalytics', searchAnalyticsSchema);

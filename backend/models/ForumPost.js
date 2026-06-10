// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: 200,
  },
  body: {
    type: String,
    required: [true, 'Please provide a body'],
    maxlength: 5000,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics', 'Other'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
  isResolved: {
    type: Boolean,
    default: false,
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
forumPostSchema.index({ subject: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });
forumPostSchema.index({ votes: -1 });
forumPostSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('ForumPost', forumPostSchema);

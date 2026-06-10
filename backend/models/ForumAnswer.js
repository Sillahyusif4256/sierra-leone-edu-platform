// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const mongoose = require('mongoose');

const forumAnswerSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true,
  },
  body: {
    type: String,
    required: [true, 'Please provide an answer'],
    maxlength: 5000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  isAccepted: {
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
forumAnswerSchema.index({ postId: 1, votes: -1 });
forumAnswerSchema.index({ author: 1 });

module.exports = mongoose.model('ForumAnswer', forumAnswerSchema);

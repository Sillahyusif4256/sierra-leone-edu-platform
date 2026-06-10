// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 1000,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics', 'Other'],
  },
  level: {
    type: String,
    required: [true, 'Please provide a level'],
    enum: ['Primary', 'JSS', 'SSS', 'University', 'Other'],
  },
  fileURL: {
    type: String,
    required: [true, 'Please provide a file URL'],
  },
  fileType: {
    type: String,
    enum: ['pdf', 'video', 'image', 'document'],
  },
  filePublicId: {
    type: String,
  },
  thumbnailURL: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text indexes for search
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ subject: 1, level: 1 });
resourceSchema.index({ downloads: -1 });
resourceSchema.index({ averageRating: -1 });
resourceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);

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

const Comment = require('../models/Comment');
const Resource = require('../models/Resource');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { createNotification } = require('../routes/notificationRoutes');

const addComment = asyncHandler(async (req, res) => {
  const { text, rating } = req.body;
  const resourceId = req.params.resourceId;

  if (!text || !rating) {
    res.status(400);
    throw new Error('Please provide text and rating');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  const existingComment = await Comment.findOne({
    resource: resourceId,
    user: req.user._id,
  });

  if (existingComment) {
    res.status(400);
    throw new Error('You have already commented on this resource');
  }

  const comment = await Comment.create({
    resource: resourceId,
    user: req.user._id,
    text,
    rating,
  });

  const allComments = await Comment.find({ resource: resourceId });
  const totalRatings = allComments.length;
  const sumRatings = allComments.reduce((sum, c) => sum + c.rating, 0);
  const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

  resource.averageRating = averageRating;
  resource.totalRatings = totalRatings;
  await resource.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'name profilePicture');

  // Notify the resource owner (if the commenter is not the owner)
  if (resource.uploadedBy.toString() !== req.user._id.toString()) {
    const commenter = await User.findById(req.user._id);
    const io = req.app.get('io');
    await createNotification(
      resource.uploadedBy,
      'new_comment',
      `${commenter.name} commented on your resource "${resource.title}"`,
      resource._id,
      io
    );
  }

  res.status(201).json(populatedComment);
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ resource: req.params.resourceId })
    .populate('user', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json(comments);
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  const resourceId = comment.resource;
  await comment.deleteOne();

  const allComments = await Comment.find({ resource: resourceId });
  const totalRatings = allComments.length;
  const sumRatings = allComments.reduce((sum, c) => sum + c.rating, 0);
  const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

  const resource = await Resource.findById(resourceId);
  if (resource) {
    resource.averageRating = averageRating;
    resource.totalRatings = totalRatings;
    await resource.save();
  }

  res.json({ message: 'Comment removed' });
});

module.exports = {
  addComment,
  getComments,
  deleteComment,
};

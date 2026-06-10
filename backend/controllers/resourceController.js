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

const Resource = require('../models/Resource');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { createNotification } = require('../routes/notificationRoutes');
const { addPoints, checkAndAwardBadges, updateStreak } = require('../utils/badgeUtils');

const uploadResource = asyncHandler(async (req, res) => {
  const { title, description, subject, level, fileType, tags } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  if (!title || !description || !subject || !level) {
    res.status(400);
    throw new Error('Please provide title, description, subject, and level');
  }

  try {
    // Upload to Cloudinary using upload method with buffer
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'sierra-leone-edu/resources',
        resource_type: 'auto',
      }
    );

    const resource = await Resource.create({
      title,
      description,
      subject,
      level,
      fileURL: result.secure_url,
      filePublicId: result.public_id,
      fileType: fileType || getFileType(req.file.mimetype),
      thumbnailURL: result.secure_url,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    });

    // Award points for upload
    await addPoints(req.user._id, 10);
    await checkAndAwardBadges(req.user._id);

    res.status(201).json(resource);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500);
    throw new Error(error.message || 'Error uploading to Cloudinary');
  }
});

const getFileType = (mimetype) => {
  if (mimetype.includes('pdf')) return 'pdf';
  if (mimetype.includes('video')) return 'video';
  if (mimetype.includes('image')) return 'image';
  return 'document';
};

const getAllResources = asyncHandler(async (req, res) => {
  const { subject, level, search, page = 1, limit = 10 } = req.query;

  let query = {};

  if (subject) query.subject = subject;
  if (level) query.level = level;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  query.isApproved = true;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const resources = await Resource.find(query)
    .populate('uploadedBy', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Resource.countDocuments(query);

  res.json({
    resources,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email profilePicture');

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.views += 1;
  await resource.save();

  res.json(resource);
});

const downloadResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.downloads += 1;
  await resource.save();

  // Award points to resource author for download
  await addPoints(resource.uploadedBy, 2);
  await checkAndAwardBadges(resource.uploadedBy);

  // Check for download milestones (10, 25, 50, 100, etc.)
  const milestones = [10, 25, 50, 100, 250, 500, 1000];
  if (milestones.includes(resource.downloads)) {
    const io = req.app.get('io');
    await createNotification(
      resource.uploadedBy,
      'new_download',
      `Your resource "${resource.title}" was downloaded ${resource.downloads} times!`,
      resource._id,
      io
    );
  }

  res.json({ fileURL: resource.fileURL });
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  if (resource.filePublicId) {
    await cloudinary.uploader.destroy(resource.filePublicId);
  }

  await resource.deleteOne();

  res.json({ message: 'Resource removed' });
});

const getMyResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ uploadedBy: req.user._id })
    .populate('uploadedBy', 'name email profilePicture')
    .sort({ createdAt: -1 });

  res.json(resources);
});

const approveResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.isApproved = true;
  await resource.save();

  // Notify the uploader
  const io = req.app.get('io');
  await createNotification(
    resource.uploadedBy,
    'resource_approved',
    `Your resource "${resource.title}" was approved!`,
    resource._id,
    io
  );

  res.json(resource);
});

const getPendingResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ isApproved: false })
    .populate('uploadedBy', 'name email profilePicture')
    .sort({ createdAt: -1 });

  res.json(resources);
});

const getStats = asyncHandler(async (req, res) => {
  const totalResources = await Resource.countDocuments({ isApproved: true });
  const totalUsers = await User.countDocuments();
  const totalDownloads = await Resource.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: null, total: { $sum: '$downloads' } } },
  ]);
  const subjects = await Resource.distinct('subject', { isApproved: true });

  res.json({
    totalResources,
    totalUsers,
    totalDownloads: totalDownloads[0]?.total || 0,
    totalSubjects: subjects.length,
  });
});

const exportResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ isApproved: true })
    .populate('uploadedBy', 'name email')
    .select('-__v');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=sierra-leone-edu-resources.json');
  res.json(resources);
});

const searchResources = asyncHandler(async (req, res) => {
  const { q, subject, level, fileType, sort = 'relevance', page = 1, limit = 10 } = req.query;

  let query = { isApproved: true };

  // Text search
  if (q) {
    query.$text = { $search: q };
  }

  // Filters
  if (subject) query.subject = subject;
  if (level) query.level = level;
  if (fileType) query.fileType = fileType;

  // Sorting
  let sortOptions = {};
  switch (sort) {
    case 'latest':
      sortOptions = { createdAt: -1 };
      break;
    case 'downloads':
      sortOptions = { downloads: -1 };
      break;
    case 'rating':
      sortOptions = { averageRating: -1 };
      break;
    case 'relevance':
    default:
      if (q) {
        sortOptions = { score: { $meta: 'textScore' } };
      } else {
        sortOptions = { createdAt: -1 };
      }
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let resources;
  if (q && sort === 'relevance') {
    resources = await Resource.find(query, { score: { $meta: 'textScore' } })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('uploadedBy', 'name email profilePicture');
  } else {
    resources = await Resource.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('uploadedBy', 'name email profilePicture');
  }

  const total = await Resource.countDocuments(query);

  res.json({
    resources,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

const getTrendingResources = asyncHandler(async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const resources = await Resource.find({
    isApproved: true,
    createdAt: { $gte: oneWeekAgo },
  })
    .sort({ downloads: -1 })
    .limit(10)
    .populate('uploadedBy', 'name email profilePicture');

  res.json(resources);
});

const getRecommendedResources = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  
  // Get user's downloaded resources to find their interests
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find resources from the same subjects the user has downloaded
  const userDownloadedResources = await Resource.find({
    isApproved: true,
  }).select('subject level');

  const subjects = [...new Set(userDownloadedResources.map(r => r.subject))];
  const levels = [...new Set(userDownloadedResources.map(r => r.level))];

  // Get recommended resources (same subjects, different resources)
  const recommended = await Resource.find({
    isApproved: true,
    subject: { $in: subjects },
    uploadedBy: { $ne: userId }, // Exclude user's own uploads
  })
    .sort({ downloads: -1, averageRating: -1 })
    .limit(10)
    .populate('uploadedBy', 'name email profilePicture');

  res.json(recommended);
});

module.exports = {
  uploadResource,
  getAllResources,
  getResourceById,
  downloadResource,
  deleteResource,
  getMyResources,
  approveResource,
  getPendingResources,
  getStats,
  exportResources,
  searchResources,
  getTrendingResources,
  getRecommendedResources,
};

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

const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/resourceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/stats', getStats);
router.get('/export', exportResources);
router.get('/search', searchResources);
router.get('/trending', getTrendingResources);
router.get('/recommended/:userId', protect, getRecommendedResources);
router.post('/upload', protect, upload.single('file'), (req, res, next) => {
  console.log('Upload request received');
  console.log('File:', req.file ? req.file.originalname : 'No file');
  console.log('Body:', req.body);
  uploadResource(req, res, next);
});
router.get('/', getAllResources);
router.get('/my-resources', protect, getMyResources);
router.get('/pending', protect, adminOnly, getPendingResources);
router.get('/download/:id', protect, downloadResource);
router.get('/:id', getResourceById);
router.delete('/:id', protect, deleteResource);
router.put('/approve/:id', protect, adminOnly, approveResource);

module.exports = router;

// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getPostById,
  addAnswer,
  votePost,
  acceptAnswer,
  voteAnswer,
  getPostsBySubject,
  getForumStats,
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/forum/posts - Get all posts with filters
router.get('/posts', getAllPosts);

// GET /api/forum/posts/subject/:subject - Get posts by subject
router.get('/posts/subject/:subject', getPostsBySubject);

// GET /api/forum/posts/:id - Get single post with answers
router.get('/posts/:id', getPostById);

// POST /api/forum/posts - Create new post (protected)
router.post('/posts', protect, createPost);

// POST /api/forum/posts/:id/answers - Add answer to post (protected)
router.post('/posts/:id/answers', protect, addAnswer);

// PUT /api/forum/posts/:id/vote - Vote on post (protected)
router.put('/posts/:id/vote', protect, votePost);

// PUT /api/forum/answers/:id/accept - Accept answer (protected)
router.put('/answers/:id/accept', protect, acceptAnswer);

// PUT /api/forum/answers/:id/vote - Vote on answer (protected)
router.put('/answers/:id/vote', protect, voteAnswer);

// GET /api/forum/stats - Get forum statistics
router.get('/stats', getForumStats);

module.exports = router;

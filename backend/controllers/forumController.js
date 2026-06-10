// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const asyncHandler = require('express-async-handler');
const ForumPost = require('../models/ForumPost');
const ForumAnswer = require('../models/ForumAnswer');
const User = require('../models/User');

// GET /api/forum/posts - Get all posts with filters
const getAllPosts = asyncHandler(async (req, res) => {
  const { subject, search, sort = 'latest', page = 1, limit = 10 } = req.query;

  let query = {};

  // Filter by subject
  if (subject) {
    query.subject = subject;
  }

  // Search
  if (search) {
    query.$text = { $search: search };
  }

  // Sorting
  let sortOptions = {};
  switch (sort) {
    case 'votes':
      sortOptions = { votes: -1 };
      break;
    case 'views':
      sortOptions = { views: -1 };
      break;
    case 'latest':
    default:
      sortOptions = { createdAt: -1 };
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const posts = await ForumPost.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .populate('author', 'name email role profilePicture')
    .lean();

  // Get answer counts for each post
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const answerCount = await ForumAnswer.countDocuments({ postId: post._id });
      return {
        ...post,
        answerCount,
      };
    })
  );

  const total = await ForumPost.countDocuments(query);

  res.json({
    posts: postsWithCounts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// POST /api/forum/posts - Create new post (protected)
const createPost = asyncHandler(async (req, res) => {
  const { title, body, subject, tags } = req.body;

  if (!title || !body || !subject) {
    res.status(400);
    throw new Error('Please provide title, body, and subject');
  }

  const post = await ForumPost.create({
    title,
    body,
    subject,
    tags: tags || [],
    author: req.user._id,
  });

  const populatedPost = await ForumPost.findById(post._id).populate(
    'author',
    'name email role profilePicture'
  );

  res.status(201).json(populatedPost);
});

// GET /api/forum/posts/:id - Get single post with answers
const getPostById = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id).populate(
    'author',
    'name email role profilePicture'
  );

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Increment views
  post.views += 1;
  await post.save();

  // Get answers sorted by votes
  const answers = await ForumAnswer.find({ postId: req.params.id })
    .sort({ isAccepted: -1, votes: -1, createdAt: -1 })
    .populate('author', 'name email role profilePicture');

  res.json({ post, answers });
});

// POST /api/forum/posts/:id/answers - Add answer to post
const addAnswer = asyncHandler(async (req, res) => {
  const { body } = req.body;

  if (!body) {
    res.status(400);
    throw new Error('Please provide answer body');
  }

  const post = await ForumPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const answer = await ForumAnswer.create({
    postId: req.params.id,
    body,
    author: req.user._id,
  });

  const populatedAnswer = await ForumAnswer.findById(answer._id).populate(
    'author',
    'name email role profilePicture'
  );

  res.status(201).json(populatedAnswer);
});

// PUT /api/forum/posts/:id/vote - Upvote/downvote post
const votePost = asyncHandler(async (req, res) => {
  const { vote } = req.body; // 1 for upvote, -1 for downvote

  if (vote !== 1 && vote !== -1) {
    res.status(400);
    throw new Error('Invalid vote value');
  }

  const post = await ForumPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.votes += vote;
  await post.save();

  res.json({ votes: post.votes });
});

// PUT /api/forum/answers/:id/accept - Mark answer as accepted
const acceptAnswer = asyncHandler(async (req, res) => {
  const answer = await ForumAnswer.findById(req.params.id).populate('postId');

  if (!answer) {
    res.status(404);
    throw new Error('Answer not found');
  }

  // Check if user is the post author
  if (answer.postId.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the post author can accept answers');
  }

  // Unaccept all other answers for this post
  await ForumAnswer.updateMany(
    { postId: answer.postId._id },
    { isAccepted: false }
  );

  // Accept this answer
  answer.isAccepted = true;
  await answer.save();

  // Mark post as resolved
  await ForumPost.findByIdAndUpdate(answer.postId._id, { isResolved: true });

  const populatedAnswer = await ForumAnswer.findById(answer._id).populate(
    'author',
    'name email role profilePicture'
  );

  res.json(populatedAnswer);
});

// PUT /api/forum/answers/:id/vote - Vote on answer
const voteAnswer = asyncHandler(async (req, res) => {
  const { vote } = req.body; // 1 for upvote, -1 for downvote

  if (vote !== 1 && vote !== -1) {
    res.status(400);
    throw new Error('Invalid vote value');
  }

  const answer = await ForumAnswer.findById(req.params.id);
  if (!answer) {
    res.status(404);
    throw new Error('Answer not found');
  }

  answer.votes += vote;
  await answer.save();

  res.json({ votes: answer.votes });
});

// GET /api/forum/posts/subject/:subject - Get posts by subject
const getPostsBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const posts = await ForumPost.find({ subject })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('author', 'name email role profilePicture')
    .lean();

  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const answerCount = await ForumAnswer.countDocuments({ postId: post._id });
      return {
        ...post,
        answerCount,
      };
    })
  );

  const total = await ForumPost.countDocuments({ subject });

  res.json({
    posts: postsWithCounts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/forum/stats - Get forum statistics
const getForumStats = asyncHandler(async (req, res) => {
  const totalPosts = await ForumPost.countDocuments();
  const totalAnswers = await ForumAnswer.countDocuments();
  const resolvedPosts = await ForumPost.countDocuments({ isResolved: true });

  // Get post counts by subject
  const postsBySubject = await ForumPost.aggregate([
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Get most active users
  const activeUsers = await ForumPost.aggregate([
    {
      $group: {
        _id: '$author',
        postCount: { $sum: 1 },
      },
    },
    {
      $sort: { postCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 1,
        postCount: 1,
        name: '$user.name',
        email: '$user.email',
        role: '$user.role',
      },
    },
  ]);

  res.json({
    totalPosts,
    totalAnswers,
    resolvedPosts,
    postsBySubject,
    activeUsers,
  });
});

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  addAnswer,
  votePost,
  acceptAnswer,
  voteAnswer,
  getPostsBySubject,
  getForumStats,
};

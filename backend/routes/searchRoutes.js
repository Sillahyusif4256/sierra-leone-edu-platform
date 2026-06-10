// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const SearchAnalytics = require('../models/SearchAnalytics');
const router = express.Router();

// POST /api/search/track - Track search term (anonymous)
router.post('/track', async (req, res) => {
  try {
    const { searchTerm, resultsCount, clickedResourceId } = req.body;
    const userId = req.user?._id || null;

    const searchAnalytics = await SearchAnalytics.create({
      searchTerm,
      resultsCount,
      clickedResourceId,
      userId
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking search:', error);
    res.status(500).json({ error: 'Failed to track search' });
  }
});

// GET /api/search/popular - Get popular search terms
router.get('/popular', async (req, res) => {
  try {
    const popularSearches = await SearchAnalytics.aggregate([
      {
        $group: {
          _id: '$searchTerm',
          count: { $sum: 1 },
          avgResults: { $avg: '$resultsCount' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const formatted = popularSearches.map(s => ({
      term: s._id,
      count: s.count,
      avgResults: Math.round(s.avgResults)
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    res.status(500).json({ error: 'Failed to fetch popular searches' });
  }
});

module.exports = router;

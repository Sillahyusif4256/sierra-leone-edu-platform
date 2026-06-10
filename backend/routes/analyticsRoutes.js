// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const User = require('../models/User');
const Resource = require('../models/Resource');
const router = express.Router();

// Helper function to calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// GET /api/analytics/overview - Overall stats
router.get('/overview', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total users
    const totalUsers = await User.countDocuments();
    const usersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    const usersLastMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    });
    const userGrowth = calculateGrowth(usersThisMonth, usersLastMonth);

    // Total resources
    const totalResources = await Resource.countDocuments();
    const resourcesThisMonth = await Resource.countDocuments({ createdAt: { $gte: startOfMonth } });
    const resourcesLastMonth = await Resource.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    });
    const resourceGrowth = calculateGrowth(resourcesThisMonth, resourcesLastMonth);

    // Total downloads (sum of all resource downloads)
    const resourcesWithDownloads = await Resource.find({}, { downloads: 1 });
    const totalDownloads = resourcesWithDownloads.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    // Downloads this month (simplified - using total downloads as proxy)
    const downloadsGrowth = 12.5; // Placeholder - would need download history table

    // Active users today
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activeUsersToday = await User.countDocuments({ 
      createdAt: { $gte: startOfDay } 
    });

    res.json({
      totalUsers,
      userGrowth,
      totalResources,
      resourceGrowth,
      totalDownloads,
      downloadsGrowth,
      activeUsersToday
    });
  } catch (error) {
    console.error('Analytics Overview Error:', error);
    res.status(500).json({ error: 'Failed to fetch overview stats' });
  }
});

// GET /api/analytics/uploads-over-time - Daily uploads over last 30 days
router.get('/uploads-over-time', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const uploads = await Resource.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Format data for chart
    const data = uploads.map(u => ({
      date: `${u._id.month}/${u._id.day}`,
      uploads: u.count
    }));

    res.json(data);
  } catch (error) {
    console.error('Uploads Over Time Error:', error);
    res.status(500).json({ error: 'Failed to fetch uploads over time' });
  }
});

// GET /api/analytics/downloads-per-subject - Downloads per subject
router.get('/downloads-per-subject', async (req, res) => {
  try {
    const subjectDownloads = await Resource.aggregate([
      {
        $group: {
          _id: '$subject',
          totalDownloads: { $sum: '$downloads' }
        }
      },
      {
        $sort: { totalDownloads: -1 }
      }
    ]);

    const data = subjectDownloads.map(s => ({
      subject: s._id,
      downloads: s.totalDownloads
    }));

    res.json(data);
  } catch (error) {
    console.error('Downloads Per Subject Error:', error);
    res.status(500).json({ error: 'Failed to fetch downloads per subject' });
  }
});

// GET /api/analytics/resource-distribution - Resource distribution by level
router.get('/resource-distribution', async (req, res) => {
  try {
    const distribution = await Resource.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const data = distribution.map(d => ({
      level: d._id,
      count: d.count
    }));

    res.json(data);
  } catch (error) {
    console.error('Resource Distribution Error:', error);
    res.status(500).json({ error: 'Failed to fetch resource distribution' });
  }
});

// GET /api/analytics/user-registrations - User registrations over time
router.get('/user-registrations', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const data = registrations.map(r => ({
      date: `${r._id.month}/${r._id.day}`,
      registrations: r.count
    }));

    res.json(data);
  } catch (error) {
    console.error('User Registrations Error:', error);
    res.status(500).json({ error: 'Failed to fetch user registrations' });
  }
});

// GET /api/analytics/top-resources - Top 10 most downloaded resources
router.get('/top-resources', async (req, res) => {
  try {
    const topResources = await Resource.find()
      .sort({ downloads: -1 })
      .limit(10)
      .populate('uploadedBy', 'name')
      .select('title downloads subject uploadedBy');

    const data = topResources.map(r => ({
      title: r.title,
      downloads: r.downloads,
      subject: r.subject,
      uploadedBy: r.uploadedBy?.name || 'Unknown'
    }));

    res.json(data);
  } catch (error) {
    console.error('Top Resources Error:', error);
    res.status(500).json({ error: 'Failed to fetch top resources' });
  }
});

// GET /api/analytics/top-contributors - Top uploaders
router.get('/top-contributors', async (req, res) => {
  try {
    const contributors = await User.aggregate([
      {
        $lookup: {
          from: 'resources',
          localField: '_id',
          foreignField: 'uploadedBy',
          as: 'resources'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          uploadCount: { $size: '$resources' },
          totalDownloads: { $sum: '$resources.downloads' }
        }
      },
      {
        $match: {
          uploadCount: { $gt: 0 }
        }
      },
      {
        $sort: { uploadCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Calculate average rating and assign badges
    const data = contributors.map((c, index) => {
      let badge = '⭐ New';
      if (c.uploadCount >= 50) badge = '🥇 Gold';
      else if (c.uploadCount >= 20) badge = '🥈 Silver';
      else if (c.uploadCount >= 5) badge = '🥉 Bronze';

      return {
        rank: index + 1,
        name: c.name,
        uploads: c.uploadCount,
        totalDownloads: c.totalDownloads || 0,
        averageRating: 4.5, // Placeholder - would need rating calculation
        badge
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Top Contributors Error:', error);
    res.status(500).json({ error: 'Failed to fetch top contributors' });
  }
});

// GET /api/analytics/recent-activity - Last 20 actions
router.get('/recent-activity', async (req, res) => {
  try {
    // Get recent uploads
    const recentUploads = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('uploadedBy', 'name')
      .select('title uploadedBy createdAt');

    const activities = recentUploads.map(r => ({
      type: 'upload',
      user: r.uploadedBy?.name || 'Unknown',
      resource: r.title,
      timestamp: r.createdAt
    }));

    // Get recent registrations
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name createdAt');

    recentRegistrations.forEach(r => {
      activities.push({
        type: 'registration',
        user: r.name,
        resource: null,
        timestamp: r.createdAt
      });
    });

    // Sort by timestamp and take last 20
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivity = activities.slice(0, 20);

    // Format time ago
    const data = recentActivity.map(a => {
      const minutesAgo = Math.floor((new Date() - new Date(a.timestamp)) / 60000);
      let timeAgo;
      if (minutesAgo < 1) timeAgo = 'Just now';
      else if (minutesAgo < 60) timeAgo = `${minutesAgo} mins ago`;
      else if (minutesAgo < 1440) timeAgo = `${Math.floor(minutesAgo / 60)} hours ago`;
      else timeAgo = `${Math.floor(minutesAgo / 1440)} days ago`;

      let message;
      if (a.type === 'upload') {
        message = `${a.user} uploaded "${a.resource}"`;
      } else {
        message = `${a.user} registered`;
      }

      return {
        message,
        timeAgo
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Recent Activity Error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// GET /api/analytics/geographic-distribution - Uploads by district
router.get('/geographic-distribution', async (req, res) => {
  try {
    // Since we don't have district data in User model, we'll return placeholder data
    // In a real implementation, you would add a 'district' field to the User model
    const districts = [
      { district: 'Freetown', uploads: 45 },
      { district: 'Bo', uploads: 23 },
      { district: 'Kenema', uploads: 18 },
      { district: 'Makeni', uploads: 15 },
      { district: 'Kono', uploads: 12 },
      { district: 'Port Loko', uploads: 10 },
      { district: 'Kambia', uploads: 8 },
      { district: 'Koinadugu', uploads: 6 },
      { district: 'Bombali', uploads: 5 },
      { district: 'Pujehun', uploads: 4 }
    ];

    res.json(districts);
  } catch (error) {
    console.error('Geographic Distribution Error:', error);
    res.status(500).json({ error: 'Failed to fetch geographic distribution' });
  }
});

module.exports = router;

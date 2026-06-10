// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Helper function to create notification and emit socket event
const createNotification = async (userId, type, message, resourceId = null, io = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      resourceId
    });

    // Emit socket event if io is provided
    if (io) {
      io.to(`user_${userId}`).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// GET /api/notifications - Get user's notifications
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = { router, createNotification };

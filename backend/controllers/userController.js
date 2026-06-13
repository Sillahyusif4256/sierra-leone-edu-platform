// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const User = require('../models/User');
const Resource = require('../models/Resource');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  
  // Add upload count for each user
  const usersWithUploads = await Promise.all(
    users.map(async (user) => {
      const uploadCount = await Resource.countDocuments({ uploadedBy: user._id });
      return {
        ...user.toObject(),
        uploadCount,
      };
    })
  );
  
  res.json(usersWithUploads);
});

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.json({ message: 'User role updated successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  // Delete all resources uploaded by this user
  await Resource.deleteMany({ uploadedBy: user._id });

  await user.deleteOne();

  res.json({ message: 'User deleted successfully' });
});

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile-pictures',
      width: 150,
      height: 150,
      crop: 'fill',
      gravity: 'face'
    });

    // Update user profile picture
    const user = await User.findById(req.user._id);
    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: result.secure_url
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error uploading profile picture');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    }
  });
});

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  uploadProfilePicture,
  updateProfile,
};

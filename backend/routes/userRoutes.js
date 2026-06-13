// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserRole, deleteUser, uploadProfilePicture, updateProfile } = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.put('/profile', protect, updateProfile);

module.exports = router;

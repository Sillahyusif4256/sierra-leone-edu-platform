// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');

router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// GET /api/users/profile
router.get('/profile', protect, getProfile);

// PUT /api/users/profile
router.put('/profile', protect, upload.single('profilePic'), updateProfile);

module.exports = router;

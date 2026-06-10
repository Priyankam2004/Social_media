const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    // Check username uniqueness if changed
    if (req.body.username && req.body.username.toLowerCase() !== user.username) {
      const usernameExists = await User.findOne({
        username: req.body.username.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (usernameExists) {
        res.status(400);
        throw new Error('This username is already taken');
      }
      user.username = req.body.username.toLowerCase();
    }

    // Handle profile picture upload
    if (req.file) {
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = req.file.mimetype;
      user.profilePic = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

      // Clean up local uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete temporary profile pic upload file:', err);
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };

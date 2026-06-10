const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    // Check if user already exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('A user with this email already exists');
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      res.status(400);
      throw new Error('This username is already taken');
    }

    // Handle profile picture upload
    let profilePic = '';
    if (req.file) {
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = req.file.mimetype;
      profilePic = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

      // Clean up local uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete temporary profile pic upload file:', err);
      }
    }

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password,
      profilePic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
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

module.exports = { register, login, getMe };

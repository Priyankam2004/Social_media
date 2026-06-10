const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image');
    }

    // Convert uploaded image to Base64 data URI
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = req.file.mimetype;
    const base64Image = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

    // Clean up local uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to delete temporary upload file:', err);
    }

    const post = await Post.create({
      user: req.user._id,
      image: base64Image,
      caption: req.body.caption || '',
    });

    // Populate user details
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name username profilePic')
      .populate('comments.user', 'name username profilePic');

    res.status(201).json(populatedPost);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name username profilePic')
      .populate('comments.user', 'name username profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name username profilePic')
      .populate('comments.user', 'name username profilePic');

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.json(post);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (owner only)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to delete this post');
    }

    // Remove local image file if it is not a base64 data URI
    if (post.image && post.image.startsWith('/uploads')) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully', postId: req.params.id });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Like / Unlike a post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some(
      (like) => like.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike - remove user from likes
      post.likes = post.likes.filter(
        (like) => like.toString() !== userId
      );
    } else {
      // Like - add user to likes
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes, postId: post._id });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Re-fetch with populated data
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'name username profilePic')
      .populate('comments.user', 'name username profilePic');

    res.status(201).json(updatedPost.comments);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/comment/:postId/:commentId
// @access  Private (comment owner only)
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Check ownership (comment owner or post owner)
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You are not authorized to delete this comment');
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    // Re-fetch with populated data
    const updatedPost = await Post.findById(req.params.postId)
      .populate('user', 'name username profilePic')
      .populate('comments.user', 'name username profilePic');

    res.json(updatedPost.comments);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  deleteComment,
};

const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST /api/posts - Create post
router.post('/', protect, upload.single('image'), createPost);

// GET /api/posts - Get all posts
router.get('/', protect, getPosts);

// GET /api/posts/:id - Get single post
router.get('/:id', protect, getPostById);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', protect, deletePost);

// PUT /api/posts/like/:id - Like/Unlike post
router.put('/like/:id', protect, likePost);

// POST /api/posts/comment/:id - Add comment
router.post('/comment/:id', protect, addComment);

// DELETE /api/posts/comment/:postId/:commentId - Delete comment
router.delete('/comment/:postId/:commentId', protect, deleteComment);

module.exports = router;

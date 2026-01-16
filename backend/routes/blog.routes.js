const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes - GET all blogs and GET blog by ID
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes - require authentication
router.post('/', authMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);
router.get('/user/my-blogs', authMiddleware, blogController.getUserBlogs);

module.exports = router;


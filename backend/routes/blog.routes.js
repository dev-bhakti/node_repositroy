const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes - GET all blogs and GET blog by ID
router.get('/', blogController.getAllBlogs); //get all blogs
router.get('/:id', blogController.getBlogById); //get blog by id

// Protected routes - require authentication
router.post('/', authMiddleware, blogController.createBlog); // create blog
router.put('/:id', authMiddleware, blogController.updateBlog); //edit blog by id
router.delete('/:id', authMiddleware, blogController.deleteBlog); //delete blog by id
router.get('/user/my-blogs', authMiddleware, blogController.getUserBlogs); //get user specific blogs

module.exports = router;


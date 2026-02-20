const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', bookController.getAllBook); //get all blogs
// router.get('/:id', bookController.getBookById); //get blog by id

// Protected routes
// router.post('/', authMiddleware, bookController.createBook); // create blog
// router.put('/:id', authMiddleware, bookController.updateBook); //edit blog by id
// router.delete('/:id', authMiddleware, bookController.deleteBook); //delete blog by id
// router.get('/user/my-book', authMiddleware, bookController.getUserBook); //get user specific blogs

module.exports = router;


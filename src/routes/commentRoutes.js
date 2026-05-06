const express = require('express');
const router = express.Router();
const { createComment, getALLcomments, deleteComment } = require('../controllers/commentControllers');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

// Public route
router.get('/', getALLcomments);

// Protected routes (require token)
router.post('/', verifyToken, createComment);
router.delete('/:id', verifyToken, deleteComment); 

module.exports = router;
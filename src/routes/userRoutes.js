const express = require('express');
const router = express.Router();
const { getAllUsers, getMe, updateMe, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

// Route for a user to get their own profile (needed by JWT mode to populate the page)
router.get('/me', verifyToken, authorizeRole('admin', 'user'), getMe);

// Route for a user to update their own profile
router.put('/me', verifyToken, authorizeRole('admin', 'user'), updateMe);

// Routes for Admins only
router.get('/', verifyToken, authorizeRole('admin'), getAllUsers);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteUser);

module.exports = router;

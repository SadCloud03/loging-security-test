const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

// Public Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Public Register Page
router.get('/register', (req, res) => {
    res.render('register');
})

// User Dashboard (Requires login)
router.get('/user', verifyToken, (req, res) => {
    res.render('user', { user: req.user });
});

// Admin Page (Requires login + Admin role)
router.get('/admin', verifyToken, authorizeRole('admin'), (req, res) => {
    res.render('admin', { user: req.user });
});

// Redirect root to login
router.get('/', (req, res) => res.redirect('/login'));

module.exports = router;
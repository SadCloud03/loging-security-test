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
});

// User Dashboard
// Cookie users: verifyToken protects this route normally.
// JWT users: page loads freely, but all API calls inside require a valid token via authFetch.
router.get('/user', (req, res, next) => {
    const sessionCookie = req.cookies.sessionId;
    if (sessionCookie) {
        // Stateful: verify and protect the page itself
        return verifyToken(req, res, () => {
            authorizeRole('admin', 'user')(req, res, () => {
                res.render('user', { user: req.user });
            });
        });
    }
    // Stateless (JWT): render the shell, JS will authenticate API calls
    res.render('user', { user: null });
});

// Admin Page
router.get('/admin', (req, res, next) => {
    const sessionCookie = req.cookies.sessionId;
    if (sessionCookie) {
        // Stateful: verify and protect the page itself
        return verifyToken(req, res, () => {
            authorizeRole('admin')(req, res, () => {
                res.render('admin', { user: req.user });
            });
        });
    }
    // Stateless (JWT): render the shell, JS will authenticate API calls
    res.render('admin', { user: null });
});

// Redirect root to login
router.get('/', (req, res) => res.redirect('/login'));

module.exports = router;

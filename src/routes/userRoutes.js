const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware')

const router = express.Router();

router.get('/admin', verifyToken, authorizeRole("admin"),  (req, res) => {
    res.json({
        message : "Welcome admin"
    });
});

router.get('/user', verifyToken, authorizeRole("admin", "user"), (req, res) => {
    res.json({
        message : "Welcome user"
    });
});

module.exports = router;
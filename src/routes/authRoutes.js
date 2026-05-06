const express = require('express');
const {register, login} = require("../controllers/authControllers")
const router = express.Router();
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 5, // Bloqueo tras 5 intentos fallidos
        message: "Too many requests, try again latter..."
    });

router.post('/register', register);
router.post('/login', loginLimiter, login);

module.exports = router;


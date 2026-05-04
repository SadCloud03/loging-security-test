const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Check cookies first (for EJS), then headers (for Postman/Mobile)
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.redirect('/login'); // Better for browser flow
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.redirect('/login');
    }
};

module.exports = verifyToken;
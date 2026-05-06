const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyToken = async (req, res, next) => {
    const sessionCookie = req.cookies.sessionId;
    const authHeader = req.headers.authorization?.split(" ")[1];
    const isApiRequest = req.originalUrl.startsWith('/api/');

    try {
        // CASO 1: Sesión Persistente (Stateful)
        if (sessionCookie) {
            const user = await User.findById(sessionCookie);
            if (!user) throw new Error("Sesión no encontrada");
            req.user = { id: user._id, role: user.role, username: user.username, userEmail: user.userEmail, method: 'cookie' };
            return next();
        }

        // CASO 2: Sesión sin Estado (Stateless - JWT)
        if (authHeader) {
            const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) throw new Error("User not found");
            req.user = { id: user._id, role: user.role, username: user.username, userEmail: user.userEmail, method: 'jwt' };
            return next();
        }

        // No auth found
        if (isApiRequest) return res.status(401).json({ message: 'Unauthorized' });
        return res.redirect('/login');

    } catch (err) {
        res.clearCookie("sessionId");
        if (isApiRequest) return res.status(401).json({ message: 'Session invalid' });
        return res.redirect('/login');
    }
};

module.exports = verifyToken;

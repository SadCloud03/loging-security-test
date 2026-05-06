const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
        const {username, userEmail, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username : username, userEmail : userEmail, password : hashedPassword, role : role})
        await newUser.save()

        res.status(201).json({message : `User created with username : ${username}`});
    } catch (err) {
        console.log(err);
        res.status(500).json({message : 'Something went wrong'});
    }
};

const login = async (req, res) => {
    try {
        const { userEmail, password, type } = req.body; // 'type' viene del botón clickeado
        const user = await User.findOne({ userEmail });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        // authController.js
        if (type === 'cookie') {
            // Generamos sesión persistente
            res.cookie('sessionId', user._id, { 
                httpOnly: true, 
                sameSite: 'strict',
                path: '/' // Asegura que la cookie esté disponible en todas las rutas
            });
            return res.json({ role: user.role }); // No enviamos token aquí
        } else {
            // Generamos JWT sin estado
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.clearCookie('sessionId'); // Limpiamos cookies para no mezclar
            return res.json({ token, role: user.role });
        }

    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    register,
    login,
};
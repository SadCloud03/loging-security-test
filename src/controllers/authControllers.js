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
        const {userEmail, password} = req.body;
        const email = await User.findOne({ userEmail });

        if (!email) {
            return res.status(404).json({message : "User not found"});
        }

        const isMatch = await bcrypt.compare( password, email.password)

        if (!isMatch) {
            return res.status(400).json({message : "Invalid credentials"})
        }

        const token = jwt.sign(
            {id : email._id, role : email.role}, 
            process.env.JWT_SECRET,
            { expiresIn : "1h"}
        );

        res.status(200).json({token});

    } catch (err) {
        res.status(500).json({message : 'Something went wrong'});
    }
};

module.exports = {
    register,
    login,
};
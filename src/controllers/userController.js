const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// USER: Get own profile
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
};

// ADMIN ONLY: Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// USER: Update self (Username, Email, or Password)
const updateMe = async (req, res) => {
    try {
        const { username, userEmail, password } = req.body;
        const updates = {};

        if (username) updates.username = username;
        if (userEmail) updates.userEmail = userEmail;
        
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updates }, 
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Update failed. Email/Username might be taken." });
    }
};

// ADMIN ONLY: Delete any user
const deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

module.exports = { getMe, getAllUsers, updateMe, deleteUser };

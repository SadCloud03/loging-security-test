const Comment = require('../models/commentModel');

const createComment = async (req, res) => {
    try {
        const { content } = req.body; // Destructure "content"
        
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const newComment = new Comment({
            content, // Matches your Schema
            author: req.user.id // From verifyToken middleware
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.log(err); // This is where your current terminal error is coming from
        res.status(500).json({ message: "Server error" });
    }
};

const getALLcomments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('author', 'username').sort({ createdAt : -1});
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({
            message : "Error fetching comments"
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Security Check: Is the user the author OR an admin?
        if (comment.author.toString() !== userId && userRole !== "admin") {
            return res.status(403).json({ 
                message: "User not authorized to delete this comment" 
            });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting comment" });
    }
};

module.exports = { 
    createComment, 
    getALLcomments, 
    deleteComment 
};
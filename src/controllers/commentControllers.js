const Comment = require('../models/commentModel');

const createComment = async (req, res) => {
    try {
        const content = req.body["content"];

        const newComment = new Comment({
            content : content, 
            author : req.user.id
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message : "Could not save comment"
        });
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
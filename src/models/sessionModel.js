const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    valid: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });
module.exports = mongoose.model("Session", sessionSchema);
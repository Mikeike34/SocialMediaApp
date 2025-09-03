//MongoDB Schema for Comments

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: String, required: true}, //PostgreSQL user id
    text: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Comment', commentSchema)
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticateToken = require('../middleware/auth');

//create a comment
router.post('/:postId',authenticateToken, async (req,res) => {
    try{
        const { text }= req.body
        const postId = req.params.postId;
        const userId = req.user.id;
        if(!text || text.trim() === ''){
            return res.status(400).json({error: 'Comment text is required'});
        }

        const comment = await Comment.create({ postId, authorId: userId, text });
        res.status(201).json(comment);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//get comments for a post
router.get('/:postId', async(req,res) => {
    try{
        const comments = await Comment.find({postId: req.params.postId }).sort({ createdAt: 1});
        res.json(comments)
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
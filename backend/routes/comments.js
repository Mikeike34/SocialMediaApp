const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

//create a comment
router.post('/:postId', async (req,res) => {
    try{
        const { postId } = req.params;
        const { authorId, text } = req.body;
        if(!text || text.trim() === ''){
            return res.status(400).json({error: 'Comment text is required'});
        }

        const comment = await Comment.create({ postId, authorId, text });
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
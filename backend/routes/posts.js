const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authenticateToken = require('../middleware/auth');

//create a new text-only post
router.post('/', authenticateToken, async (req , res) => {
    try{
        const{ text } = req.body;

        //validate text
        if (!text || text.trim() == '') {
            return res.status(400).json({error: 'Post text is required'});
        }
        
        const authorId = req.user.id; //set by JWT middleware
        const post = await Post.create({authorId: authorId.toString(), text});
        res.status(201).json(post);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//get all posts (most recent first)
router.get('/user/:authorId', async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1});
        res.json(posts);
    }catch(err){
        res.status(500).json({error: err.message });
    }
});

module.exports = router;
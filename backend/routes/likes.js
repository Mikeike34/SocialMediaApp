const express = require('express');
    const router = express.Router();
    const Like = require('../models/Like');
    const authenticateToken = require('../middleware/auth');

    //like a post
    router.post('/:postId',authenticateToken, async (req , res )=> {
        try{
            const postId = req.params.postId;
            const userId = req.user.id;

            //prevent duplicate likes by same user
            const existingLike = await Like.findOne({postId, userId});
            if(existingLike) return res.status(400).json({error: 'User already liked this post'});

            const like = await Like.create({postId, userId});
            res.status(201).json(like);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    //get likes count for a post
    router.get('/:postId', async(req , res) => {
        try{
            const count = await Like.countDocuments({ postId: req.params.postId});
            res.json({postId: req.params.postId, likes: count});
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    module.exports = router;

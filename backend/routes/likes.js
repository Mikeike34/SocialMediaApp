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

    //unlike a post
    router.delete('/:postId', authenticateToken, async (req , res) => {
        try{
            const postId = req.params.postId;
            const userId = req.user.id;

            const like = await Like.findOneAndDelete({postId, userId});
            if(!like){
                return res.status(404).json({error: 'Like not found'});
            }

            res.json({message: 'Like removed successfully'});
        }catch(err){
            res.status(500).json({error:err.message});
        }
    });

    //Check if current user has already liked a post
    router.get('/postId/status', authenticateToken, async (req, res) => {
        try{
            const postId = req.params.postId;
            const userId = req.user.id;

            const existingLike = await Like.findOne({ postId, userId});
            res.json({liked: !existingLike });
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

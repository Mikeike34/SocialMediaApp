    const express = require('express');
    const mongoose = require('mongoose');
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

            const like = await Like.findOneAndDelete({
                postId: new mongoose.Types.ObjectId(postId),
                userId: userId,
            });

            if(!like){
                return res.status(404).json({error: 'Like not found'});
            }
            res.json({message: 'Like removed successfully'});
        }catch(err){
            res.status(500).json({error:err.message});
        }
    });

    //Check if current user has already liked a post and gets like info
    router.get('/:postId/status', authenticateToken, async (req, res) => {
        try{
            const postId = req.params.postId;
            const userId = req.user.id;

            const existingLike = await Like.findOne({
                postId: new mongoose.Types.ObjectId(postId),
                userId: userId
            });

            const liked = !!existingLike;
            const likesCount = await Like.countDocuments({ postId });

            res.json({liked, likesCount});
        }catch(err){
            console.error(err);
            res.status(500).json({error: err.message});
        }
    });

    module.exports = router;

const express = require('express');
const authenticateToken = require('../middleware/auth');
const { followUser, unfollowUser, getFollowing, getFollowers } = require('../models/postgresFollowers');


const router = express.Router();


//Follow a user
router.post('/:id', authenticateToken, async (req , res ) => {
    try{
        const followerId = req.user.id; 
        const followingId = req.params.id;

        if(followerId == followingId){
            return res.status(400).json({error: "You cannot follow yourself"});
        }


        const follow = await followUser(followerId, followingId);
        res.status(201).json(follow || {message: "Already following"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});


//unfollow a user
router.delete('/:id', authenticateToken, async (req, res) => {
    try{
        const followerId = req.user.id;
        const followingId = req.params.id;

        const unfollow = await unfollowUser(followerId, followingId);
        if(!unfollow) return res.status(404).json({error: "Not following this user"});

        res.json({message: "Unfollowed Successfully"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//Get people user follows
router.get('/following/:id', async (req, res) => {
    try{
        const following = await getFollowing(req.params.id);
        res.json(following)
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//Get user followers
router.get('/followers/:id', async (req, res) => {
    try{
        const followers = await getFollowers(req.params.id);
        res.json(followers);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
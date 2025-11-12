const express = require('express');
const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, getUserById, getFollowingCount, getFollowerCount } = require('../models/postgresUser');
const {searchUsersByUsername} = require('../models/postgresUser');
const {searchFollowing} = require('../models/postgresUser');
const { getFollowers, getFollowing} = require('../models/postgresFollowers');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');


//signup
router.post('/signup', async (req , res) => {
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ error: 'All fields are required '});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(username, email, hashedPassword);

        res.status(201).json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//login
router.post('/login', async (req , res) => {
    try{
        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if(!user) return res.status(400).json({error: 'Invalid email or password'});

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) return res.status(400).json({error: 'Invalid username or password'});

        //JWT Payload
        const payload = { id: user.id, username: user.username};

        //token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

        res.json({message: 'Login Successful', token, user: {id: user.id, username: user.username, email: user.email }});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//Search for users by username
router.get('/search', async (req, res) => {
    const {query} = req.query;
    if(!query) return res.json([]); //returns empty array if no query

    try{
        const users = await searchUsersByUsername(query);
        res.json(users);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'})
    }
});

//Get list of users who are following current user
router.get('/search/following', authenticateToken, async(req,res) => {
    const {query} = req.query;
    const currentUserId = req.user.id;

    if(!query) return res.json([]);

    try{
        const users = await searchFollowing(query, currentUserId);
        res.json(users); //returns an array of users with isFollowing
    }catch(err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

//Get a user profile with follower/following counts
router.get('/:id', async (req , res) => {
    try {
        const user = await getUserById(req.params.id);
        if(!user) return res.status(404).json({error: 'User not found'});

        const followerCount = await getFollowerCount(req.params.id);
        const followingCount = await getFollowingCount(req.params.id);

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profile_pic: user.profile_pic,
            created_at: user.created_at,
            followerCount,
            followingCount
        });
    }catch(err){
        res.status(500).json({error: err.message });
    }
});


//Get user follower count
router.get('/followers/:id/count', async (req , res) => {
    try{
        const count = await getFollowerCount(req.params.id);
        res.json({followerCount: count});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});


//Get user's following count
router.get('/following/:id/count', async (req , res) => {
    try{
        const count = await getFollowingCount(req.params.id);
        res.json({followingCount: count});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});



module.exports = router;
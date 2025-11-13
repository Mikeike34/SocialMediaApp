const express = require('express');
const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, getUserById, getFollowingCount, getFollowerCount, updateProfilePic, updateUsername } = require('../models/postgresUser');
const {searchUsersByUsername} = require('../models/postgresUser');
const {searchFollowing} = require('../models/postgresUser');
const { getFollowers, getFollowing} = require('../models/postgresFollowers');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');


try{
     if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // create parent folders if needed
        console.log('Created uploads folder at:', UPLOAD_DIR);
    }
}catch(err){
    console.error('Failed to create uploads folder:',err);
}

//configuring multer to save uploaded images to uploads/ folder
const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage});


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
            profile_pic: user.profile_pic || null,
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

//update Profile pic
router.put('/:id/profile_pic', upload.single('profile_pic'), async(req, res) => {
    try{
        const userId = req.params.id;
        if(!req.file) return res.status(400).json({error: 'No file uploaded '});

        //get existing profilePic URL
        const user = await getUserById(userId);

        //if there is an existing profile pic, delete it from /uploads
        if(user.profile_pic){
            try{
                const oldFileName = path.basename(user.profile_pic);
                const oldFilePath = path.join(__dirname, '..', 'uploads', oldFileName);

                fs.unlink(oldFilePath, (err) => {
                    if(err){
                        console.warn('Failed to delete old profile picture:', err.message);
                        //do not block upload if old file deletion fails
                    }
                });
            }catch(err){
                console.warn('Error processing old profile picture:', err.message);
            }
        }

        //save the file path as URL in DB
        const profilePicUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        const updatedUser = await updateProfilePic(userId, profilePicUrl);

        res.json({user: updatedUser});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});




module.exports = router;
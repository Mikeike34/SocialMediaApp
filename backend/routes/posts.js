const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const pgPool = require('../databases/postgres'); //postgreSQL connection
const authenticateToken = require('../middleware/auth');

//create a new text-only post
router.post('/', authenticateToken, async (req , res) => {
    try{
        const{ text } = req.body;
        const authorId = req.user.id; //JWT contains user id

        //validate text
        if (!text || text.trim() == '') {
            return res.status(400).json({error: 'Post text is required'});
        }

        //checks if user exists in postgres database
        const userCheck = await pgPool.query(
            `SELECT id FROM users WHERE id = $1`,
            [authorId]
        );
        if (userCheck.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }
        
        //creates post in MongoDB
        const post = await Post.create({authorId: String(authorId), text});
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

//Edit a post
router.put('/:postId', authenticateToken, async (req, res ) => {
    try{
        const { text } = req.body;
        const { postId } = req.params;
        const userId = req.user.id;

        if(!text || text.trim() === ''){
            return res.status(400).json({error: 'Post text is required '});
        }

        //Find the post
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found' });
        }

        //check if the current user is the author
        if (post.authorId !== String(userId)){
            return res.status(403).json({error: 'You can only edit your own posts!'});
        }

        //update post
        post.text = text;
        await post.save();
        res.json(post);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});


//delete a post
router.delete('/:postId', authenticateToken, async (req, res ) => {
    try{ 
        const { postId } = req.params;
        const userId = req.user.id;

        //Find Post
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }

        //check if the current user is the author
        if (post.authorId !== String(userId)){
            return res.status(403).json({error: 'You can only delete your own posts! '});
        }

        //delete the post
        await post.deleteOne();

        res.json({message: 'Post deleted successfully'});
    }catch(err){
        res.status(500).json({error: err.message });
    }
});

module.exports = router;
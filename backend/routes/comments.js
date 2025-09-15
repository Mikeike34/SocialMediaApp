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
//router.get('/:postId', async(req,res) => {
    //try{
        //const comments = await Comment.find({postId: req.params.postId }).sort({ createdAt: 1});
        //res.json(comments)
    //}catch(err){
        //res.status(500).json({error: err.message});
    //}
//});

//gets all comments for a post (includes username on each comment)
router.get('/:postId', async (req , res) => {
    try{
        const comments = await Comment.find({postId: req.params.postId })
            .sort({createdAt: 1});
        
            if(comments.length === 0){
                return res.json([]);
            }

            //collect all unique author Ids
            const authorIds = [...new Set(comments.map(c => c.authorId))];

            //Query Postgres for usernames
            const {Pool} = require('pg');
            const pool = require('../databases/postgres');
            const query = `SELECT id, username FROM users WHERE id = ANY($1::int[])`;
            const result = await pool.query(query, [authorIds.map(id => parseInt(id, 10))]);

            const usersById = {};
            result.rows.forEach(user => {
                usersById[user.id] = user.username;
            });

            //Attach usernames to comments
            const commentsWithUser = comments.map(c => ({
                id: c._id,
                text: c.text,
                createdAt: c.createdAt,
                authorId: c.authorId,
                username: usersById[c.authorId] || 'Unknown'
            }));

            res.json(commentsWithUser);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
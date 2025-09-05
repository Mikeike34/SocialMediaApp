const express = require('express');
const authenticateToken = require('../middleware/auth');
const Post = require('../models/postgresFollowers');
const { getFollowingIds }= require('../models/postgresFollowers');
const pool = require('../databases/postgres');


const router = express.Router();

//Get feed (posts from users that are followed)
router.get('/', authenticateToken, async (req , res) => {
    try{ 
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //Get IDs of users followed
        const followingIds = await getFollowingIds(userId);

        if (followingIds.length === 0){
            return res.json({posts: [], total: 0, page, totalPages: 0});
        }

        //Fetch posts from MongoDB authored by these users
        const posts = await Post.find ({authorId: { $in: followingIds }})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean();
        
        //enrich posts with likeCount, commentCount, author info
        const enrichPosts = await Promise.all(posts.map(async (post) => {
            const likeCount = await pool.query(
                `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
                [post._id]
            );
            const commentCount = await pool.query(
                'SELECT COUNT(*) FROM comments WHERE post_id = $1',
                [post._id]
            );
            const authorInfo = await pool.query(
                `SELECT id, username, email, profile_pic, bio FROM users WHERE id = $1`,
                [post.authorId]
            );
            return {
                ...post,
                likeCount: parseInt(likeCount.rows[0].count, 10),
                commentCount: parseInt(commentCount.rows[0].count, 10),
                author: authorInfo.rows[0] || null
            };
        }));

        //total count for pagination
        const total = await Post.countDocuments({authorId: {$in: followingIds}});

        res.json({
            posts: enrichedPosts,
            total,
            page,totalPages: Math.ceil(total / limit)
        });
    }catch(err){
        console.error(err);
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
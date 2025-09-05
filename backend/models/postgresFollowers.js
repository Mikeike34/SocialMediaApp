const pool = require('../databases/postgres');

//Follow a user
async function followUser(followerId, followingId){
    const query = `
        INSERT INTO followers (follower_id, following_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *;
    `;
    const result = await pool.query(query, [followerId, followingId]);
    return result.rows[0];
}

//unfollow a user
async function unfollowUser(followerId, followingId){
    const query = `
        DELETE FROM followers
        WHERE follower_id = $1 AND following_id = $2
        RETURNING *;
    `;
    const result = await pool.query(query, [followerId, followingId]);
    return result.rows[0];
}

//Get all users someone is following
async function getFollowing(userId){
    const query = `
        SELECT u.id, u.username, u.profile_pic, u.bio
        FROM followers f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = $1;
    `;
    const result = await pool.query(query,[userId]);
    return result.rows;
}

//Get all followers of a user
async function getFollowers(userId){
    const query = `
        SELECT u.id, u.username, u.email, u.profile_pic, u.bio
        FROM followers f
        JOIN users u ON f.follower_id = u.id
        WHERE f.following_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

//Get a list of user IDs that a user is following (Helps build a personalized feed)
async function getFollowingIds(userId){
    const query = `
        SELECT following_id
        FROM followers
        WHERE following_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(r => r.following_id);
}

module.exports = {followUser, unfollowUser, getFollowing, getFollowers, getFollowingIds};
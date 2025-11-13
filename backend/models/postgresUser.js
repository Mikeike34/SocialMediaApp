const pool =require('../databases/postgres');

//Create a new user
async function createUser(username, email, hashedPassword){
    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING id, username, email, bio, profile_pic, created_at
    `;
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
}

//Get user by email
async function getUserByEmail(email){
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

//Get user by id
async function getUserById(id){
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

//Get user follower count
async function getFollowerCount(userId){
    const result = await pool.query(
        `SELECT COUNT(*) FROM followers WHERE following_id = $1`,
        [userId]
    );
    return parseInt(result.rows[0].count, 10);
}

//Get user following count
async function getFollowingCount(userId){
    const result = await pool.query(
        `SELECT COUNT(*) FROM followers WHERE follower_id = $1`,
        [userId]
    );
    return parseInt(result.rows[0].count, 10);
}

//Search users by username (case-insensitive)
async function searchUsersByUsername(query){
    try{
        const result = await pool.query(
            `SELECT id, username, email, profile_pic
            FROM users
            WHERE username ILIKE $1
            ORDER BY username ASC
            LIMIT 10;`,
            [`%${query}%`]
        );
        return result.rows;
    }catch(err){
        console.error('Error searching users: ', err);
        throw err;
    }
}

//Search users who the current user follows
async function searchFollowing(query, currentUserId){
    try{
        const result = await pool.query(
            `SELECT u.id, u.username, u.email, u.profile_pic,
                EXISTS (
                    SELECT 1 FROM followers f
                    WHERE f.follower_id = $1
                    AND f.following_id = u.id
                ) AS "isFollowing"
            FROM users u
            WHERE username ILIKE $2
            ORDER BY username ASC
            LIMIT 10;`,
            [currentUserId, `%${query}%`]
        );
        return result.rows;
    }catch(err){
        console.error('Error searching users with follow status: ', err);
        throw err;
    }
}

//Update username
async function updateUsername(userId, newUsername){
    const query = `
        UPDATE users
        SET username = $1
        WHERE id = $2
        RETURNING id, username, email, bio, profile_pic, created_at
    `;
    const values = [newUsername, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

//update profile picture
async function updateProfilePic(userId, profilePicUrl){
    const query = `
        UPDATE users
        SET profile_pic = $1
        WHERE id = $2
        RETURNING id, username, email, bio, profile_pic, created_at
    `;
    const values = [profilePicUrl, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getFollowerCount,
    getFollowingCount,
    searchUsersByUsername,
    searchFollowing,
    updateProfilePic,
    updateUsername
};
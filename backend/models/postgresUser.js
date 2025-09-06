const pool =require('../databases/postgres');

//Create a new user
async function createUser(username, email, hashedPassword){
    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING Id, username, email, bio, profile_pic, created_at
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

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getFollowerCount,
    getFollowingCount
};
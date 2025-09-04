const express = require('express');
const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, getUserById } = require('../models/postgresUser');
const router = express.Router();
const jwt = require('jsonwebtoken');


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

//Get a user profile
router.get('/:id', async (req , res) => {
    try {
        const user = await getUserById(req.params.id);
        if(!user) return res.status(404).json({error: 'User not found'});

        res.json(user)
    }catch(err){
        res.status(500).json({error: err.message });
    }
});

module.exports = router;
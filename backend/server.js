require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json()); //parse JSON bodies

//serve uploads folder publicly
app.use(`/uploads`, express.static(path.join(__dirname, 'uploads')));

//Database Connections
const mongoose = require('./databases/mongodb');
const pgPool = require('./databases/postgres');

//test postgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
    if(err) console.error('PostgreSQL error: ', err);
    else console.log('PostgreSQL time: ', res.rows[0]);
});


//API Routes
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const userRoutes = require('./routes/users');
const followerRoutes = require('./routes/followers');
const feedRoutes = require('./routes/feed');

//Mount routes
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followerRoutes);
app.use('/api/feed', feedRoutes);

//default route
app.get('/', (req, res) => res.send('Social Media API running'));

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



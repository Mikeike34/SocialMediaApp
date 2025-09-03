const { Pool } = require('pg') //uses Pool from the pg library. Pool allows for reusable connections to PostgreSQL. (no need to create a new connectioin for every request)

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.on('connect', () => console.log('PostgreSQL connected'));

module.exports = pool;
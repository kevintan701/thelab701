const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'thelab701',
  password: '110321',
  port: 6666,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };

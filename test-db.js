const { Pool } = require('pg');

const pool = new Pool({
    user: 'the.lab.701',
    host: 'localhost',
    database: 'thelab701',
    password: '',
    port: 5432,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to database');

        const result = await client.query('SELECT * FROM Products');
        console.log('Products in database:', result.rows);

        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        pool.end();
    }
}

testConnection(); 
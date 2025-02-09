require('dotenv').config();

// Database configuration
const dbConfig = {
    user: process.env.DB_USER || 'the.lab.701',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'thelab701',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
};

// Server configuration
const serverConfig = {
    port: parseInt(process.env.PORT || '3000'),
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    sessionSecret: process.env.SESSION_SECRET || 'session-secret',
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
};

// Cache configuration
const cacheConfig = {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
};

module.exports = {
    db: dbConfig,
    server: serverConfig,
    cache: cacheConfig,
}; 
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const config = require('./config');
const { logger, requestLogger } = require('./utils/logger');
const { authenticateToken, isAdmin } = require('./middleware/auth');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(requestLogger);

// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://kevintan701.github.io',
        'http://127.0.0.1:5500'  // For Live Server if you use it
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Session configuration
app.use(session({
    secret: config.server.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: config.server.env === 'production',
        sameSite: 'none'  // Required for cross-origin cookies
    }
}));

// Database connection
const pool = new Pool(config.db);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        logger.error('Database connection error:', err.stack);
        process.exit(1);
    }
    logger.info('Database connected successfully');
    
    // Verify Products table
    pool.query('SELECT * FROM Products')
        .then(result => {
            logger.info('Products table verified', { count: result.rows.length });
        })
        .catch(err => {
            logger.error('Products table error:', err.message);
            process.exit(1);
        });
});

// Input validation middleware
const validateProduct = [
    body('name').trim().notEmpty().escape(),
    body('price').isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 0 })
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

// Protected routes
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Products');
        logger.info('Products retrieved successfully');
        res.json(result.rows);
    } catch (err) {
        logger.error('Database error:', err);
        res.status(500).json({
            error: 'Database error',
            details: err.message
        });
    }
});

app.post('/add-to-cart', validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { productName, price, qty } = req.body;
    const query = `
        INSERT INTO cart_items (product_name, price, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (product_name) DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        price = EXCLUDED.price
        RETURNING *;
    `;
    
    try {
        const result = await pool.query(query, [productName, price, qty]);
        logger.info('Item added to cart', { product: productName });
        res.json({ 
            message: 'Added to cart',
            item: result.rows[0]
        });
    } catch (err) {
        logger.error('Error adding to cart:', err);
        res.status(500).json({
            error: 'Error processing add to cart request',
            details: err.message
        });
    }
});

// Admin routes
app.get('/admin/inventory', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.name, i.quantity, i.min_threshold, i.last_updated 
             FROM inventory i 
             JOIN Products p ON p.id = i.product_id`
        );
        res.json(result.rows);
    } catch (err) {
        logger.error('Error fetching inventory:', err);
        res.status(500).json({
            error: 'Error fetching inventory',
            details: err.message
        });
    }
});

// Error handling middleware
app.use((req, res, next) => {
    logger.warn('Route not found:', req.url);
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
    const net = require('net');
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => {
                resolve(port);
            });
        });
    });
};

// Start server with port fallback
const startServer = async () => {
    try {
        const port = await findAvailablePort(config.server.port);
        app.listen(port, () => {
            logger.info(`Server running at http://localhost:${port}`);
            if (port !== config.server.port) {
                logger.warn(`Original port ${config.server.port} was in use, using port ${port} instead`);
            }
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    pool.end(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    pool.end(() => {
        process.exit(0);
    });
});

startServer();

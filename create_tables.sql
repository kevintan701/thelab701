CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE cart_items (
    product_name VARCHAR(100) PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    quantity INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    min_threshold INTEGER DEFAULT 10,
    CONSTRAINT positive_quantity CHECK (quantity >= 0)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20) NOT NULL
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES Products(id),
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    customizations JSONB,
    CONSTRAINT positive_quantity CHECK (quantity > 0)
);

CREATE TABLE sales_data (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    quantity_sold INTEGER NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT positive_quantity CHECK (quantity_sold > 0),
    CONSTRAINT positive_revenue CHECK (total_revenue > 0)
);

-- Insert some sample products
INSERT INTO Products (name, price) VALUES 
    ('Americano 701', 4.00),
    ('Cold Brew 701', 5.00),
    ('Flat White 701', 6.00);

-- Insert initial inventory for products
INSERT INTO inventory (product_id, quantity) 
SELECT id, 100 FROM Products;
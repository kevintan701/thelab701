# THE.LAB.701 Coffee Shop Website

A modern web application for THE.LAB.701 coffee shop, featuring menu management, ordering system, and inventory tracking.

## Features

- Product catalog and menu management
- Shopping cart functionality
- User authentication and authorization
- Admin dashboard for inventory management
- Secure payment processing
- Order tracking and history

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Winston Logger
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/thelab701-website.git
cd thelab701-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Create the logs directory:
```bash
mkdir logs
```

## Development

Start the development server:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
```

## Testing

Run the test suite:
```bash
npm test
```

## API Documentation

### Public Endpoints

- `GET /products` - Get all products
- `GET /menu` - Get menu page
- `POST /add-to-cart` - Add item to cart

### Protected Endpoints

- `GET /admin/inventory` - Get inventory status (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

THE.LAB.701 - [Contact Information]
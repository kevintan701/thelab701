# THE.LAB.701 Coffee Shop Website
Live Site Available @ https://kevintan701.github.io/thelab701

A sophisticated web application for THE.LAB.701 coffee shop that provides a seamless digital experience for both customers and staff. This platform combines modern design with robust functionality to manage menu items, process orders, and track inventory efficiently.

## ✨ Features

- 🛍️ **Product Management**
  - Dynamic product catalog
  - Real-time menu updates
  - Category-based organization

- 🛒 **Customer Experience**
  - Intuitive shopping cart
  - Secure checkout process
  - Order history tracking

- 👤 **User System**
  - Secure authentication
  - Role-based authorization
  - Profile management

- 📊 **Admin Dashboard**
  - Inventory management
  - Sales analytics
  - Order processing

- 💳 **Payment Processing**
  - Secure payment gateway integration
  - Multiple payment methods
  - Transaction history

## 🏗️ Project Structure

```
project_root/
├── .github/                 # GitHub specific configurations
├── logs/                   # Application logs
├── middleware/            # Authentication and other middleware
├── public/               # Frontend assets and files
│   ├── css/            # Stylesheets
│   ├── data/          # Static data files
│   ├── js/           # JavaScript modules
│   ├── medias/      # Media assets
│   └── *.html      # HTML pages
├── utils/          # Utility functions
└── [other root files] # Configuration and setup files
```

## 🚀 Tech Stack

- **Backend**
  - Node.js (v14+)
  - Express.js (v4.x)
  - PostgreSQL (v12+)
  - JWT for authentication
  - Winston for logging

- **Frontend**
  - HTML5 & CSS3
  - Modern JavaScript (ES6+)
  - Responsive Design
  - Custom UI Components

- **DevOps & Tools**
  - Git for version control
  - npm for package management
  - ESLint for code quality
  - Jest for testing

## ⚙️ Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/thelab701-website.git
   cd thelab701-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   psql -U your_username -d your_database -f create_tables.sql
   ```

5. **Create required directories**
   ```bash
   mkdir -p logs
   ```

## 🚦 Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

## 🌍 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Other Configuration
LOGGING_LEVEL=info
```

## 🔍 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Retrieve all products |
| GET | `/menu` | Get menu items |
| POST | `/add-to-cart` | Add item to cart |

### Protected Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/admin/inventory` | Get inventory status | Admin |
| POST | `/admin/products` | Add new product | Admin |

## 🐛 Troubleshooting

Common issues and solutions:

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure proper network access

2. **Node.js Errors**
   - Clear node_modules and reinstall
   - Verify Node.js version
   - Check for conflicting dependencies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the code style guidelines
4. Write meaningful commit messages
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style Guidelines

- Use ESLint for code formatting
- Write meaningful comments
- Follow the existing naming conventions
- Create modular and reusable components
- Write unit tests for new features

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

THE.LAB.701
- Website: [thelab701.com](https://kevintan701.github.io/thelab701)
- Email: tanyuntao@gmail.com

## 🙏 Acknowledgments

- All contributors who have helped shape this project
- Open source community for various tools and libraries
- Our customers for their continued support and feedback

---
Made with ❤️ by THE.LAB.701 Team
# SkillForge - Freelance Platform

A modern freelance platform built with React frontend and Node.js backend, featuring job posting, bidding, payments, and blog integration.

## 🏗️ Architecture

```
skillforge/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Node.js backend (Express + ES Modules)
├── package.json     # Root package.json for managing both
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillforge
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- **Frontend**: http://localhost:8081 (React + Vite)
- **Backend**: http://localhost:5000 (Node.js + Express)

## 📁 Project Structure

### Client (Frontend)
```
client/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and configurations
│   ├── integrations/  # External service integrations
│   └── ui/            # UI components (shadcn/ui)
├── public/            # Static assets
├── package.json       # Frontend dependencies
└── vite.config.ts     # Vite configuration
```

### Server (Backend)
```
server/
├── routes/            # API route definitions
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/            # Data models (future)
├── utils/             # Utility functions
├── config/            # Configuration files
├── uploads/           # File uploads
├── server.js          # Main server file
└── package.json       # Backend dependencies
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build the client for production
- `npm run start` - Start the server in production mode
- `npm run install:all` - Install dependencies for both client and server

### Client
- `cd client && npm run dev` - Start development server
- `cd client && npm run build` - Build for production
- `cd client && npm run preview` - Preview production build

### Server
- `cd server && npm run dev` - Start development server with nodemon
- `cd server && npm start` - Start production server

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Blog
- `GET /api/blog/posts` - Get all blog posts
- `GET /api/blog/posts/:slug` - Get single blog post
- `GET /api/blog/categories` - Get blog categories
- `GET /api/blog/search` - Search blog posts
- `GET /api/blog/wordpress/*` - WordPress API proxy

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get user dashboard

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Bids
- `GET /api/bids` - Get all bids
- `GET /api/bids/:id` - Get single bid
- `POST /api/bids` - Create bid
- `PUT /api/bids/:id` - Update bid
- `DELETE /api/bids/:id` - Delete bid

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:id` - Get payment details

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/jobs` - Get all jobs
- `GET /api/admin/stats` - Get system stats

### Affiliate
- `GET /api/affiliate/dashboard` - Get affiliate dashboard
- `GET /api/affiliate/commissions` - Get commission summary
- `GET /api/affiliate/referrals` - Get referral links

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin resource sharing configuration
- **Helmet.js** - Security headers
- **Input Validation** - Request validation using express-validator
- **Error Handling** - Comprehensive error handling middleware

## 📝 Blog Integration

The platform includes WordPress blog integration:

- **WordPress API Proxy** - Proxies requests to WordPress REST API
- **Fallback Content** - Shows fallback content when WordPress API is unavailable
- **CORS Handling** - Proper CORS configuration for cross-origin requests
- **Content Formatting** - Formats WordPress content for React display

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Client-side routing
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **ES Modules** - Modern JavaScript modules
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Winston** - Logging
- **Axios** - HTTP client

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build the client
npm run build

# Start the server
npm start
```

The server will serve the built client files in production.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the WorkVix team.

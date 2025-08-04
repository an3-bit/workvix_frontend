import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import database
import { testConnection, initializeDatabase } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import jobRoutes from './routes/jobs.js';
import bidRoutes from './routes/bids.js';
import paymentRoutes from './routes/payments.js';
import blogRoutes from './routes/blog.js';
import adminRoutes from './routes/admin.js';
import affiliateRoutes from './routes/affiliate.js';

// Import logger
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:8081",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8081",
  credentials: true
}));
app.use(limiter);
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/affiliate', affiliateRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  // Join chat room
  socket.on('join-chat', (chatRoomId) => {
    socket.join(`chat-${chatRoomId}`);
    logger.info(`User joined chat room: ${chatRoomId}`);
  });

  // Handle new message
  socket.on('send-message', (data) => {
    // Broadcast message to chat room
    socket.to(`chat-${data.chatRoomId}`).emit('new-message', data);
    logger.info(`Message sent in chat room: ${data.chatRoomId}`);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`chat-${data.chatRoomId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // Handle notification
  socket.on('notification', (data) => {
    // Send notification to specific user
    io.to(`user-${data.userId}`).emit('new-notification', data);
    logger.info(`Notification sent to user: ${data.userId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:8081'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${err}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err}`);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

startServer(); 
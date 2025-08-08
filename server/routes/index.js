import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import jobRoutes from './jobs.js';
import bidRoutes from './bids.js';
import orderRoutes from './orders.js';
import reviewRoutes from './reviews.js';
import chatRoutes from './chats.js';
import paymentRoutes from './payments.js';
import supportRoutes from './support.js';
import notificationRoutes from './notifications.js';
import profileRoutes from './profiles.js';
import affiliateRoutes from './affiliates.js';
// import portfolioRoutes from './portfolio.js';
import statsRoutes from './stats.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/bids', bidRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/chats', chatRoutes);
router.use('/payments', paymentRoutes);
router.use('/support', supportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profiles', profileRoutes);
router.use('/affiliates', affiliateRoutes);
// router.use('/portfolio', portfolioRoutes);
router.use('/stats', statsRoutes);

export default router; 
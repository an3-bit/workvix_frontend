import express from 'express';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import {
  createBid,
  getAllBids,
  getBidById,
  updateBid,
  acceptBid,
  rejectBid,
  withdrawBid,
  getBidStats
} from '../controllers/bidController.js';

const router = express.Router();

// Public routes
router.get('/stats', getBidStats);

// Protected routes
router.get('/', protect, getAllBids);
router.get('/:id', protect, getBidById);
router.post('/', protect, authorize('freelancer'), createBid);
router.put('/:id', protect, authorize('freelancer'), checkOwnership('bid'), updateBid);
router.post('/:id/accept', protect, authorize('client'), acceptBid);
router.post('/:id/reject', protect, authorize('client'), rejectBid);
router.post('/:id/withdraw', protect, authorize('freelancer'), checkOwnership('bid'), withdrawBid);

export default router; 
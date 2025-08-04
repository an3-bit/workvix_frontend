import express from 'express';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobCategories,
  getJobStats
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/categories', getJobCategories);
router.get('/stats', getJobStats);
router.get('/:id', getJobById);

// Protected routes
router.post('/', protect, authorize('client'), createJob);
router.put('/:id', protect, authorize('client'), checkOwnership('job'), updateJob);
router.delete('/:id', protect, authorize('client'), checkOwnership('job'), deleteJob);

export default router; 
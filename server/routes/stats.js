import express from 'express';
import { StatsController } from '../controllers/index.js';

const router = express.Router();

router.get('/', StatsController.getStats);

export default router;
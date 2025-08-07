import express from 'express';
import { PortfolioController } from '../controllers';

const router = express.Router();

router.get('/', PortfolioController.getPortfolio);

export default router;
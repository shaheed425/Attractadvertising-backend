import express from 'express';
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPortfolios)
  .post(protect, createPortfolio);

router.route('/:id')
  .get(getPortfolioById)
  .put(protect, updatePortfolio)
  .delete(protect, deletePortfolio);

export default router;

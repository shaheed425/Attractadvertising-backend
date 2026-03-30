import express from 'express';
import {
  getLogos,
  createLogo,
  deleteLogo,
} from '../controllers/logoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getLogos)
  .post(protect, createLogo);

router.route('/:id')
  .delete(protect, deleteLogo);

export default router;

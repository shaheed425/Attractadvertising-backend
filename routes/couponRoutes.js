import express from 'express';
import {
  getCoupons,
  getPublicCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicCoupons);
router.post('/validate', validateCoupon);

router.route('/')
  .get(protect, getCoupons)
  .post(protect, createCoupon);

router.route('/:id')
  .put(protect, updateCoupon)
  .delete(protect, deleteCoupon);

export default router;

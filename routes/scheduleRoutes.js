import express from 'express';
import {
  createScheduleBooking,
  getScheduleBookings,
  updateScheduleStatus,
} from '../controllers/scheduleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createScheduleBooking)
  .get(protect, getScheduleBookings);

router.route('/:id/status')
  .put(protect, updateScheduleStatus);

export default router;

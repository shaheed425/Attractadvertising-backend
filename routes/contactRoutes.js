import express from 'express';
import {
  submitContact,
  getContacts,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protect, getContacts);

router.route('/:id')
  .delete(protect, deleteContact);

export default router;

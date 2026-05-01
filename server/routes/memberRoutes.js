import express from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/memberController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, librarian, getMembers)
  .post(protect, librarian, createMember);

router
  .route('/:id')
  .get(protect, librarian, getMemberById)
  .put(protect, librarian, updateMember)
  .delete(protect, librarian, deleteMember);

export default router;

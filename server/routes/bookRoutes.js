import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getBooks)
  .post(protect, librarian, createBook);

router
  .route('/:id')
  .get(getBookById)
  .put(protect, librarian, updateBook)
  .delete(protect, librarian, deleteBook);

export default router;

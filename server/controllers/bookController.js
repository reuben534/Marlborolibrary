import Book from '../models/Book.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private (Admin/Librarian)
export const createBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, category, copies, coverImage } = req.body;

  if (!title || !author || !isbn) {
    res.status(400);
    throw new Error('Please provide title, author, and ISBN');
  }

  const bookExists = await Book.findOne({ isbn });

  if (bookExists) {
    res.status(400);
    throw new Error('Book already exists with this ISBN');
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    category,
    copies: copies || 1,
    available: copies || 1,
    coverImage,
  });

  res.status(201).json(book);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (Admin/Librarian)
export const updateBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, category, copies, available, coverImage } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    book.copies = copies !== undefined ? copies : book.copies;
    book.available = available !== undefined ? available : book.available;
    book.coverImage = coverImage || book.coverImage;

    // Validate available vs copies
    if (book.available > book.copies) {
      res.status(400);
      throw new Error('Available copies cannot exceed total copies');
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (Admin/Librarian)
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    // Check if book is currently borrowed (available < copies)
    if (book.available < book.copies) {
      res.status(400);
      throw new Error('Cannot delete a book that is currently borrowed');
    }
    
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

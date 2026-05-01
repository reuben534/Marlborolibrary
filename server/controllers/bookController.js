import Book from '../models/Book.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private (Admin/Librarian)
export const createBook = async (req, res) => {
  const { title, author, isbn, category, copies, coverImage } = req.body;

  try {
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      return res.status(400).json({ message: 'Book already exists with this ISBN' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (Admin/Librarian)
export const updateBook = async (req, res) => {
  const { title, author, isbn, category, copies, available, coverImage } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.isbn = isbn || book.isbn;
      book.category = category || book.category;
      book.copies = copies !== undefined ? copies : book.copies;
      book.available = available !== undefined ? available : book.available;
      book.coverImage = coverImage || book.coverImage;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (Admin/Librarian)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      // Check if book is currently borrowed (available < copies)
      if (book.available < book.copies) {
        return res.status(400).json({ message: 'Cannot delete a book that is currently borrowed' });
      }
      
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

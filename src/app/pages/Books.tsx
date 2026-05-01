<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> ac623c4 (created database)
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { BookModal } from '../components/BookModal';
import { toast } from 'sonner';
<<<<<<< HEAD

interface Book {
  id: string;
=======
import { apiClient } from '../api/client';

interface Book {
  _id: string;
>>>>>>> ac623c4 (created database)
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  status: 'available' | 'low' | 'unavailable';
}

export function Books() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
<<<<<<< HEAD
=======
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
>>>>>>> ac623c4 (created database)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; book: Book | null }>({
    open: false,
    book: null,
  });

  const [bookModal, setBookModal] = useState<{ open: boolean; book: Book | null }>({
    open: false,
    book: null,
  });

<<<<<<< HEAD
  const [books] = useState<Book[]>([
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      copies: 5,
      available: 3,
      status: 'available',
    },
    {
      id: '2',
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      isbn: '978-0201616224',
      copies: 3,
      available: 1,
      status: 'low',
    },
    {
      id: '3',
      title: 'Design Patterns',
      author: 'Gang of Four',
      isbn: '978-0201633610',
      copies: 4,
      available: 0,
      status: 'unavailable',
    },
    {
      id: '4',
      title: 'Refactoring',
      author: 'Martin Fowler',
      isbn: '978-0134757599',
      copies: 6,
      available: 4,
      status: 'available',
    },
    {
      id: '5',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      copies: 3,
      available: 2,
      status: 'available',
    },
  ]);
=======
  const fetchBooks = async () => {
    try {
      const data = await apiClient('/books');
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
>>>>>>> ac623c4 (created database)

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
  );

<<<<<<< HEAD
  const handleDelete = () => {
    toast.success(`Book "${deleteModal.book?.title}" removed successfully!`);
  };

  const handleSaveBook = (data: any) => {
    console.log('Saving book:', data);
    // Here you would save the book data
=======
  const handleDelete = async () => {
    if (!deleteModal.book) return;
    
    try {
      await apiClient(`/books/${deleteModal.book._id}`, {
        method: 'DELETE',
      });
      toast.success(`Book "${deleteModal.book.title}" removed successfully!`);
      fetchBooks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove book');
    }
  };

  const handleSaveBook = async (data: any) => {
    try {
      if (bookModal.book) {
        // Update
        await apiClient(`/books/${bookModal.book._id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Book updated successfully!');
      } else {
        // Create
        await apiClient('/books', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Book added successfully!');
      }
      fetchBooks();
      setBookModal({ open: false, book: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save book');
    }
>>>>>>> ac623c4 (created database)
  };

  const canManage = user?.role === 'admin' || user?.role === 'librarian';

  const getStatusBadge = (status: Book['status']) => {
    const styles = {
      available: 'bg-green-100 text-green-700',
      low: 'bg-orange-100 text-orange-700',
      unavailable: 'bg-red-100 text-red-700',
    };
    const labels = {
      available: 'Available',
      low: 'Low Stock',
      unavailable: 'Unavailable',
    };
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

<<<<<<< HEAD
=======
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

>>>>>>> ac623c4 (created database)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Manage Books
          </h1>
          <p className="text-gray-600 mt-1">{filteredBooks.length} books registered</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setBookModal({ open: true, book: null })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors">
            <Plus className="size-5" />
            Add Book
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Books Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Book Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Author
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  ISBN
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Copies
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                {canManage && (
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.map((book) => (
<<<<<<< HEAD
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
=======
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
>>>>>>> ac623c4 (created database)
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center">
                        <BookOpen className="size-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{book.isbn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="font-semibold">{book.available}</span> / {book.copies}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(book.status)}</td>
                  {canManage && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setBookModal({ open: true, book })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, book })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Books Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredBooks.map((book) => (
          <div
<<<<<<< HEAD
            key={book.id}
=======
            key={book._id}
>>>>>>> ac623c4 (created database)
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="size-12 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center flex-shrink-0">
                <BookOpen className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                {getStatusBadge(book.status)}
              </div>
            </div>

            <div className="space-y-1 mb-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
              <p>
                <span className="font-medium">Available:</span>{' '}
                <span className="font-semibold">{book.available}</span> of {book.copies} copies
              </p>
            </div>

            {canManage && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => setBookModal({ open: true, book })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg font-medium hover:bg-green-100 transition-colors">
                  <Edit className="size-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, book })}
                  className="flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, book: null })}
        title="Remove Book"
        description={`Are you sure you want to remove the book "${deleteModal.book?.title}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="danger"
      />

      {/* Book Add/Edit Modal */}
      <BookModal
        open={bookModal.open}
        onOpenChange={(open) => setBookModal({ open, book: null })}
        book={bookModal.book}
        onSave={handleSaveBook}
      />
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> ac623c4 (created database)

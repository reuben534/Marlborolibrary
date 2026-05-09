import { useState, useEffect } from 'react';
import { X, BookOpen, Save, Loader2 } from 'lucide-react';

interface BookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category?: string;
    copies?: number;
    publisher?: string;
    publishYear?: number;
    description?: string;
  } | null;
  onSave: (data: any) => Promise<void>;
}

export function BookModal({ open, onOpenChange, book, onSave }: BookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishYear: '',
    category: '',
    copies: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'History',
    'Biography',
    'Self-Help',
    'Educational',
  ];

  useEffect(() => {
    if (book && open) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publishYear: book.publishYear?.toString() || '',
        category: book.category || '',
        copies: book.copies?.toString() || '',
        description: book.description || '',
      });
      setErrors({});
    } else if (open) {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publishYear: '',
        category: '',
        copies: '',
        description: '',
      });
      setErrors({});
    }
  }, [book, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    const copiesNum = parseInt(formData.copies);
    if (!formData.copies || isNaN(copiesNum) || copiesNum < 1) {
      newErrors.copies = 'Copies must be at least 1';
    }

    if (formData.publishYear) {
      const year = parseInt(formData.publishYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1000 || year > currentYear + 1) {
        newErrors.publishYear = 'Please enter a valid year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        copies: parseInt(formData.copies),
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
      // Backend error should be handled by the parent using toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => !isSubmitting && onOpenChange(false)}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-[#1B5E4B] rounded-lg p-2.5">
                  <BookOpen className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {book ? 'Edit Book' : 'Add New Book'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {book ? 'Update book information' : 'Fill in book details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent`}
                    placeholder="Enter book title"
                    disabled={isSubmitting}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.author ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent`}
                    placeholder="Enter author name"
                    disabled={isSubmitting}
                  />
                  {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.isbn ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent font-mono`}
                    placeholder="978-0-00-000000-0"
                    disabled={isSubmitting}
                  />
                  {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                    placeholder="Enter publisher name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Year
                  </label>
                  <input
                    type="number"
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.publishYear ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent`}
                    placeholder="2024"
                    disabled={isSubmitting}
                  />
                  {errors.publishYear && <p className="text-red-500 text-xs mt-1">{errors.publishYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Copies *
                  </label>
                  <input
                    type="number"
                    value={formData.copies}
                    onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.copies ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent`}
                    placeholder="1"
                    disabled={isSubmitting}
                  />
                  {errors.copies && <p className="text-red-500 text-xs mt-1">{errors.copies}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Enter book description or summary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> All copies will be marked as available when the book is added.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Save className="size-5" />
                  )}
                  {book ? 'Save Changes' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

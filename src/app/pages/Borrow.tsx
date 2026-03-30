import { useState } from 'react';
import { Calendar, BookUp } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function Borrow() {
  const [formData, setFormData] = useState({
    member: '',
    book: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });
  const [confirmModal, setConfirmModal] = useState(false);

  const members = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Mary Johnson' },
    { id: '3', name: 'Peter Williams' },
    { id: '4', name: 'Emma Brown' },
  ];

  const books = [
    { id: '1', title: 'Clean Code', available: 3 },
    { id: '2', title: 'The Pragmatic Programmer', available: 1 },
    { id: '3', title: 'Refactoring', available: 4 },
    { id: '4', title: 'Introduction to Algorithms', available: 2 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModal(true);
  };

  const handleConfirm = () => {
    const member = members.find((m) => m.id === formData.member);
    const book = books.find((b) => b.id === formData.book);
    toast.success(
      `Borrow confirmed! "${book?.title}" to ${member?.name}`
    );
    setFormData({
      member: '',
      book: '',
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Borrow Book
        </h1>
        <p className="text-gray-600 mt-1">Register a new book loan</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#1B5E4B] rounded-lg p-3">
            <BookUp className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Loan</h2>
            <p className="text-sm text-gray-600">Fill in the details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Member *
              </label>
              <select
                value={formData.member}
                onChange={(e) => setFormData({ ...formData, member: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                required
              >
                <option value="">Choose a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Book *
              </label>
              <select
                value={formData.book}
                onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                required
              >
                <option value="">Choose a book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.available} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Borrow Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.borrowDate}
                  onChange={(e) =>
                    setFormData({ ...formData, borrowDate: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> The standard loan period is 14 days.
              Make sure the member is aware of the return date.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors"
            >
              <BookUp className="size-5" />
              Confirm Borrow
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  member: '',
                  book: '',
                  borrowDate: new Date().toISOString().split('T')[0],
                  dueDate: '',
                })
              }
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Recent Borrows */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Loans
        </h3>
        <div className="space-y-3">
          {[
            { member: 'John Smith', book: 'Clean Code', date: '06/03/2026' },
            { member: 'Mary Johnson', book: 'Refactoring', date: '05/03/2026' },
            { member: 'Peter Williams', book: 'Design Patterns', date: '04/03/2026' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-gray-900">{item.member}</p>
                <p className="text-sm text-gray-600">{item.book}</p>
              </div>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title="Confirm Borrow"
        description="Are you sure you want to register this loan? The book will be marked as borrowed."
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant="info"
      />
    </div>
  );
}
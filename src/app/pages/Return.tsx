import { useState } from 'react';
import { Calendar, BookDown, DollarSign, Calculator } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function Return() {
  const [formData, setFormData] = useState({
    member: '',
    book: '',
    borrowDate: '',
    returnDate: new Date().toISOString().split('T')[0],
  });
  const [lateFee, setLateFee] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);

  const activeBorrows = [
    {
      id: '1',
      member: 'John Smith',
      book: 'Clean Code',
      borrowDate: '20/02/2026',
      dueDate: '06/03/2026',
    },
    {
      id: '2',
      member: 'Peter Williams',
      book: 'Design Patterns',
      borrowDate: '15/02/2026',
      dueDate: '01/03/2026',
    },
  ];

  const calculateFine = () => {
    if (!formData.borrowDate || !formData.returnDate) {
      toast.error('Select dates to calculate fine');
      return;
    }

    const borrow = new Date(formData.borrowDate);
    const returnD = new Date(formData.returnDate);
    const dueDate = new Date(borrow);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    if (returnD > dueDate) {
      const daysLate = Math.ceil(
        (returnD.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const fee = daysLate * 2; // £2 per day
      setLateFee(fee);
      toast.info(`${daysLate} days overdue. Fine: £${fee.toFixed(2)}`);
    } else {
      setLateFee(0);
      toast.success('Returned on time. No fine!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModal(true);
  };

  const handleConfirm = () => {
    const borrow = activeBorrows.find((b) => b.id === formData.member);
    toast.success(`Return confirmed! "${borrow?.book}" returned successfully.`);
    setFormData({
      member: '',
      book: '',
      borrowDate: '',
      returnDate: new Date().toISOString().split('T')[0],
    });
    setLateFee(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Return Book
        </h1>
        <p className="text-gray-600 mt-1">Register a book return</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 rounded-lg p-3">
            <BookDown className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Return</h2>
            <p className="text-sm text-gray-600">Fill in the details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Loan *
              </label>
              <select
                value={formData.member}
                onChange={(e) => {
                  const borrow = activeBorrows.find((b) => b.id === e.target.value);
                  if (borrow) {
                    const [day, month, year] = borrow.borrowDate.split('/');
                    setFormData({
                      ...formData,
                      member: e.target.value,
                      book: borrow.book,
                      borrowDate: `${year}-${month}-${day}`,
                    });
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                required
              >
                <option value="">Choose an active loan</option>
                {activeBorrows.map((borrow) => (
                  <option key={borrow.id} value={borrow.id}>
                    {borrow.member} - {borrow.book} (Due: {borrow.dueDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Borrow Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.borrowDate}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fine Calculation */}
          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fine Calculation
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={calculateFine}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Calculator className="size-5" />
                Calculate Fine
              </button>
              <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-lg">
                <DollarSign className="size-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Fine Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    £{lateFee.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Late fee: £2.00 per day overdue
            </p>
          </div>

          {/* Transaction ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              TXN-{Date.now().toString().slice(-8)}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors"
            >
              <BookDown className="size-5" />
              Confirm Return
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  member: '',
                  book: '',
                  borrowDate: '',
                  returnDate: new Date().toISOString().split('T')[0],
                });
                setLateFee(0);
              }}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Recent Returns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Returns</h3>
        <div className="space-y-3">
          {[
            { member: 'Mary Johnson', book: 'Refactoring', date: '06/03/2026', fee: 0 },
            { member: 'Emma Brown', book: 'Clean Code', date: '05/03/2026', fee: 6 },
            {
              member: 'John Smith',
              book: 'The Pragmatic Programmer',
              date: '04/03/2026',
              fee: 0,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-gray-900">{item.member}</p>
                <p className="text-sm text-gray-600">{item.book}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{item.date}</span>
                {item.fee > 0 ? (
                  <span className="text-sm font-semibold text-red-600">
                    Fine: £{item.fee.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-green-600">
                    No fine
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title="Confirm Return"
        description={`Are you sure you want to register this return?${
          lateFee > 0
            ? ` The member will need to pay a fine of £${lateFee.toFixed(2)}.`
            : ''
        }`}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant={lateFee > 0 ? 'warning' : 'info'}
      />
    </div>
  );
}
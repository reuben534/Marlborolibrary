import { useState, useEffect } from "react";
import { Calendar, BookDown, Banknote, Calculator } from "lucide-react";
import { ConfirmModal } from "../components/ConfirmModal";
import { toast } from "sonner";
import { apiClient } from "../api/client";

const formatZAR = (amount: number) =>
  `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function Return() {
  const [formData, setFormData] = useState({
    transactionId: "",
    member: "",
    book: "",
    borrowDate: "",
    dueDate: "",
    returnDate: new Date().toISOString().split("T")[0],
  });
  const [lateFee, setLateFee] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const [activeBorrows, setActiveBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBorrows = async () => {
      try {
        const transactions = await apiClient("/transactions");
        setActiveBorrows(
          transactions.filter(
            (t: any) => t.status === "active" || t.status === "overdue",
          ),
        );
      } catch (error) {
        console.error("Error fetching active borrows:", error);
        toast.error("Failed to load active loans");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBorrows();
  }, []);

  const calculateFine = () => {
    if (!formData.dueDate || !formData.returnDate) {
      toast.error("Select a loan to calculate fine");
      return;
    }

    const dueDate = new Date(formData.dueDate);
    const returnD = new Date(formData.returnDate);

    if (returnD > dueDate) {
      const daysLate = Math.ceil(
        (returnD.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const fee = daysLate * 1; // R1 per day as per backend
      setLateFee(fee);
      toast.info(`${daysLate} days overdue. Fine: ${formatZAR(fee)}`);
    } else {
      setLateFee(0);
      toast.success("Returned on time. No fine!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateFine();
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      await apiClient(`/transactions/return/${formData.transactionId}`, {
        method: "POST",
        body: JSON.stringify({
          condition: "Good",
          notes: "",
        }),
      });

      toast.success(
        `Return confirmed! "${formData.book}" returned successfully.`,
      );
      setFormData({
        transactionId: "",
        member: "",
        book: "",
        borrowDate: "",
        dueDate: "",
        returnDate: new Date().toISOString().split("T")[0],
      });
      setLateFee(0);

      // Refresh active borrows
      const transactions = await apiClient("/transactions");
      setActiveBorrows(
        transactions.filter(
          (t: any) => t.status === "active" || t.status === "overdue",
        ),
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to process return");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

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
                value={formData.transactionId}
                onChange={(e) => {
                  const borrow = activeBorrows.find(
                    (b) => b._id === e.target.value,
                  );
                  if (borrow && borrow.member && borrow.book) {
                    setFormData({
                      ...formData,
                      transactionId: borrow._id,
                      member: borrow.member.name || "Unknown Member",
                      book: borrow.book.title || "Unknown Book",
                      borrowDate: new Date(borrow.borrowDate)
                        .toISOString()
                        .split("T")[0],
                      dueDate: new Date(borrow.dueDate)
                        .toISOString()
                        .split("T")[0],
                    });
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                required
              >
                <option value="">Choose an active loan</option>
                {activeBorrows
                  .filter((borrow) => borrow.member && borrow.book)
                  .map((borrow) => (
                    <option key={borrow._id} value={borrow._id}>
                      {borrow.member?.name || "Unknown Member"} -{" "}
                      {borrow.book?.title || "Unknown Book"} (Due:{" "}
                      {new Date(borrow.dueDate).toLocaleDateString("en-GB")})
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
                <Banknote className="size-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Fine Amount (ZAR)</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatZAR(lateFee)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Late fee: R1.00 per day overdue
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
                  transactionId: "",
                  member: "",
                  book: "",
                  borrowDate: "",
                  dueDate: "",
                  returnDate: new Date().toISOString().split("T")[0],
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

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title="Confirm Return"
        description={`Are you sure you want to register this return?${
          lateFee > 0
            ? ` The member will need to pay a fine of ${formatZAR(lateFee)}.`
            : ""
        }`}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant={lateFee > 0 ? "warning" : "info"}
      />
    </div>
  );
}

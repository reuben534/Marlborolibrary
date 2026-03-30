import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Monitor, Calendar, Clock, Settings, Trash2, Edit, Eye } from 'lucide-react';
import { BookComputerModal } from '../components/BookComputerModal';
import { ComputerManagementModal } from '../components/ComputerManagementModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { ViewBookingModal } from '../components/ViewBookingModal';
import { toast } from 'sonner';

export interface Computer {
  id: string;
  name: string;
  location: string;
  specifications: string;
  status: 'available' | 'booked' | 'in-use' | 'maintenance';
}

export interface Booking {
  id: string;
  computerId: string;
  computerName: string;
  memberId: string;
  memberName: string;
  date: string;
  timeSlot: string;
  duration: number; // in hours
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  purpose?: string;
}

export function ComputerBooking() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'booked' | 'in-use' | 'maintenance'>('all');
  const [bookingModal, setBookingModal] = useState<{ open: boolean; computer: Computer | null }>({
    open: false,
    computer: null,
  });
  const [managementModal, setManagementModal] = useState<{ open: boolean; computer: Computer | null }>({
    open: false,
    computer: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  });

  const [computers, setComputers] = useState<Computer[]>([
    {
      id: '1',
      name: 'Computer 01',
      location: 'Main Floor - Section A',
      specifications: 'Intel i7, 16GB RAM, Windows 11',
      status: 'available',
    },
    {
      id: '2',
      name: 'Computer 02',
      location: 'Main Floor - Section A',
      specifications: 'Intel i5, 8GB RAM, Windows 11',
      status: 'booked',
    },
    {
      id: '3',
      name: 'Computer 03',
      location: 'Main Floor - Section B',
      specifications: 'Intel i7, 16GB RAM, macOS',
      status: 'available',
    },
    {
      id: '4',
      name: 'Computer 04',
      location: 'Study Room 1',
      specifications: 'Intel i5, 8GB RAM, Ubuntu',
      status: 'in-use',
    },
    {
      id: '5',
      name: 'Computer 05',
      location: 'Study Room 2',
      specifications: 'Intel i7, 16GB RAM, Windows 11',
      status: 'maintenance',
    },
    {
      id: '6',
      name: 'Computer 06',
      location: 'Main Floor - Section B',
      specifications: 'Intel i5, 8GB RAM, Windows 11',
      status: 'available',
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      computerId: '2',
      computerName: 'Computer 02',
      memberId: user?.role === 'member' ? user.id : '3',
      memberName: user?.role === 'member' ? user.fullName : 'Jane Member',
      date: '2026-03-26',
      timeSlot: '10:00 - 12:00',
      duration: 2,
      status: 'upcoming',
      purpose: 'Research work',
    },
    {
      id: '2',
      computerId: '4',
      computerName: 'Computer 04',
      memberId: '3',
      memberName: 'Jane Member',
      date: '2026-03-25',
      timeSlot: '14:00 - 16:00',
      duration: 2,
      status: 'active',
      purpose: 'Document editing',
    },
  ]);

  const canManage = user?.role === 'admin' || user?.role === 'librarian';

  // Filter computers
  const filteredComputers = computers.filter((computer) => {
    const matchesSearch = computer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         computer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || computer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter bookings based on user role
  const filteredBookings = user?.role === 'member' 
    ? bookings.filter(b => b.memberId === user.id)
    : bookings;

  const handleBookComputer = (computer: Computer) => {
    setBookingModal({ open: true, computer });
  };

  const handleSaveBooking = (data: any) => {
    const newBooking: Booking = {
      id: String(bookings.length + 1),
      computerId: data.computerId,
      computerName: data.computerName,
      memberId: user?.id || '',
      memberName: user?.fullName || '',
      date: data.date,
      timeSlot: data.timeSlot,
      duration: data.duration,
      status: 'upcoming',
      purpose: data.purpose,
    };
    setBookings([...bookings, newBooking]);
    toast.success('Computer booked successfully!');
  };

  const handleCancelBooking = () => {
    if (deleteModal.booking) {
      setBookings(bookings.filter(b => b.id !== deleteModal.booking!.id));
      toast.success('Booking cancelled successfully!');
      setDeleteModal({ open: false, booking: null });
    }
  };

  const handleSaveComputer = (data: any) => {
    if (data.id) {
      // Edit existing computer
      setComputers(computers.map(c => 
        c.id === data.id 
          ? { ...c, name: data.name, location: data.location, specifications: data.specifications, status: data.status }
          : c
      ));
      toast.success('Computer updated successfully!');
    } else {
      // Add new computer
      const newComputer: Computer = {
        id: String(computers.length + 1),
        name: data.name,
        location: data.location,
        specifications: data.specifications,
        status: data.status,
      };
      setComputers([...computers, newComputer]);
      toast.success('Computer added successfully!');
    }
  };

  // Statistics
  const stats = {
    total: computers.length,
    available: computers.filter(c => c.status === 'available').length,
    booked: computers.filter(c => c.status === 'booked').length,
    inUse: computers.filter(c => c.status === 'in-use').length,
    maintenance: computers.filter(c => c.status === 'maintenance').length,
    myBookings: user?.role === 'member' ? bookings.filter(b => b.memberId === user.id).length : 0,
  };

  const getStatusColor = (status: Computer['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'booked':
        return 'bg-blue-100 text-blue-700';
      case 'in-use':
        return 'bg-yellow-100 text-yellow-700';
      case 'maintenance':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Computer['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'in-use':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  const getBookingStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBookingStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Computer Booking
          </h1>
          <p className="text-gray-600 mt-1">
            Reserve computers for study and research
          </p>
        </div>
        {canManage && (
          <button 
            onClick={() => setManagementModal({ open: true, computer: null })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors">
            <Plus className="size-5" />
            Add Computer
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2.5">
              <Monitor className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Computers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-2.5">
              <Monitor className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              <p className="text-xs text-gray-600">Available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2.5">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
              <p className="text-xs text-gray-600">Booked</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 rounded-lg p-2.5">
              <Clock className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inUse}</p>
              <p className="text-xs text-gray-600">In Use</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 rounded-lg p-2.5">
              <Settings className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
              <p className="text-xs text-gray-600">Maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by computer name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Computers Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Computers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComputers.map((computer) => (
            <div
              key={computer.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#1B5E4B]/10 rounded-lg p-3">
                    <Monitor className="size-6 text-[#1B5E4B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{computer.name}</h3>
                    <p className="text-sm text-gray-600">{computer.location}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(computer.status)}`}>
                  {getStatusText(computer.status)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{computer.specifications}</p>

              <div className="flex gap-2">
                {computer.status === 'available' && (
                  <button
                    onClick={() => handleBookComputer(computer)}
                    className="flex-1 px-4 py-2 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors text-sm"
                  >
                    Book Now
                  </button>
                )}
                {canManage && (
                  <button
                    onClick={() => setManagementModal({ open: true, computer })}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Bookings / All Bookings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {user?.role === 'member' ? 'My Bookings' : 'All Bookings'}
        </h2>
        
        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Computer
                  </th>
                  {canManage && (
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Member
                    </th>
                  )}
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Time Slot
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="size-4 text-[#1B5E4B]" />
                        <span className="text-sm font-medium text-gray-900">
                          {booking.computerName}
                        </span>
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.memberName}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.timeSlot}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                        {getBookingStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewModal({ open: true, booking })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="size-4" />
                        </button>
                        {(booking.status === 'upcoming' || booking.status === 'active') && (
                          <button
                            onClick={() => setDeleteModal({ open: true, booking })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Monitor className="size-5 text-[#1B5E4B]" />
                  <h3 className="font-semibold text-gray-900">{booking.computerName}</h3>
                </div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                  {getBookingStatusText(booking.status)}
                </span>
              </div>

              {canManage && (
                <p className="text-sm text-gray-600 mb-2">Member: {booking.memberName}</p>
              )}
              
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="size-4" />
                  {booking.timeSlot} ({booking.duration}h)
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setViewModal({ open: true, booking })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  <Eye className="size-4" />
                  View
                </button>
                {(booking.status === 'upcoming' || booking.status === 'active') && (
                  <button
                    onClick={() => setDeleteModal({ open: true, booking })}
                    className="flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <BookComputerModal
        open={bookingModal.open}
        onOpenChange={(open) => setBookingModal({ open, computer: null })}
        computer={bookingModal.computer}
        onSave={handleSaveBooking}
      />

      {/* Computer Management Modal */}
      <ComputerManagementModal
        open={managementModal.open}
        onOpenChange={(open) => setManagementModal({ open, computer: null })}
        computer={managementModal.computer}
        onSave={handleSaveComputer}
      />

      {/* Cancel Booking Confirmation */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, booking: null })}
        title="Cancel Booking"
        description={`Are you sure you want to cancel the booking for "${deleteModal.booking?.computerName}" on ${deleteModal.booking?.date}? This action cannot be undone.`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={handleCancelBooking}
        variant="danger"
      />

      {/* View Booking Modal */}
      <ViewBookingModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ open, booking: null })}
        booking={viewModal.booking}
      />
    </div>
  );
}
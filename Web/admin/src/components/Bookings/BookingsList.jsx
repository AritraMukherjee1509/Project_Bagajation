import React, { useState } from 'react';
import { 
  FiEye, 
  FiEdit, 
  FiPhone, 
  FiMapPin,
  FiClock,
  FiUser,
  FiMoreVertical
} from 'react-icons/fi';

// Mock data - replace with API call
const bookings = [
  {
    id: 'BK001',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    service: 'AC Installation',
    provider: 'Subhajit Dey',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    amount: 1050,
    location: 'Kolkata, WB',
    createdAt: '2024-01-10T10:30:00Z'
  },
  {
    id: 'BK002',
    customerName: 'Priya Sharma',
    customerPhone: '+91 87654 32109',
    service: 'Plumbing Repair',
    provider: 'Amit Singh',
    date: '2024-01-16',
    time: '2:00 PM',
    status: 'pending',
    amount: 850,
    location: 'Mumbai, MH',
    createdAt: '2024-01-12T14:20:00Z'
  },
  {
    id: 'BK003',
    customerName: 'Arjun Mehta',
    customerPhone: '+91 76543 21098',
    service: 'Electrical Work',
    provider: 'Ravi Kumar',
    date: '2024-01-14',
    time: '11:30 AM',
    status: 'completed',
    amount: 1200,
    location: 'Delhi, DL',
    createdAt: '2024-01-08T09:15:00Z'
  },
  {
    id: 'BK004',
    customerName: 'Neha Patel',
    customerPhone: '+91 65432 10987',
    service: 'Home Cleaning',
    provider: 'Kavya Reddy',
    date: '2024-01-17',
    time: '9:00 AM',
    status: 'in-progress',
    amount: 750,
    location: 'Bangalore, KA',
    createdAt: '2024-01-13T16:45:00Z'
  }
];

const statusConfig = {
  pending: { color: 'orange', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  'in-progress': { color: 'purple', label: 'In Progress' },
  completed: { color: 'green', label: 'Completed' },
  cancelled: { color: 'red', label: 'Cancelled' }
};

export default function BookingsList({ filters }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <div className="bookings-list">
      <div className="list-header">
        <h3>All Bookings ({bookings.length})</h3>
        <div className="list-controls">
          <select className="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <div className="bookings-table">
        <div className="table-header">
          <div className="header-cell">Booking ID</div>
          <div className="header-cell">Customer</div>
          <div className="header-cell">Service</div>
          <div className="header-cell">Provider</div>
          <div className="header-cell">Date & Time</div>
          <div className="header-cell">Amount</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {bookings.map((booking) => (
            <div key={booking.id} className="table-row">
              <div className="table-cell">
                <span className="booking-id">{booking.id}</span>
              </div>
              
              <div className="table-cell">
                <div className="customer-info">
                  <div className="customer-avatar">
                    {booking.customerName.charAt(0)}
                  </div>
                  <div className="customer-details">
                    <div className="customer-name">{booking.customerName}</div>
                    <div className="customer-contact">
                      <FiPhone size={12} />
                      {booking.customerPhone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <div className="service-info">
                  <div className="service-name">{booking.service}</div>
                  <div className="service-location">
                    <FiMapPin size={12} />
                    {booking.location}
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <div className="provider-info">
                  <div className="provider-avatar">
                    {booking.provider.charAt(0)}
                  </div>
                  <span className="provider-name">{booking.provider}</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="datetime-info">
                  <div className="booking-date">{formatDate(booking.date)}</div>
                  <div className="booking-time">
                    <FiClock size={12} />
                    {formatTime(booking.time)}
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <span className="booking-amount">₹{booking.amount.toLocaleString()}</span>
              </div>

              <div className="table-cell">
                {getStatusBadge(booking.status)}
              </div>

              <div className="table-cell">
                <div className="action-buttons">
                  <button className="action-btn" title="View Details">
                    <FiEye />
                  </button>
                  <button className="action-btn" title="Edit Booking">
                    <FiEdit />
                  </button>
                  <button className="action-btn" title="More Options">
                    <FiMoreVertical />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          Showing 1-4 of 1,234 bookings
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  );
}
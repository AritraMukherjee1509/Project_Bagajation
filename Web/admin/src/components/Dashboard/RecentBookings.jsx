import React from 'react';
import { FiEye, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';

const recentBookings = [
  {
    id: 'BK001',
    customerName: 'Rajesh Kumar',
    service: 'AC Installation',
    status: 'confirmed',
    amount: 1050,
    time: '2 hours ago',
    location: 'Kolkata'
  },
  {
    id: 'BK002',
    customerName: 'Priya Sharma',
    service: 'Plumbing Repair',
    status: 'pending',
    amount: 850,
    time: '4 hours ago',
    location: 'Mumbai'
  },
  {
    id: 'BK003',
    customerName: 'Arjun Mehta',
    service: 'Electrical Work',
    status: 'in-progress',
    amount: 1200,
    time: '6 hours ago',
    location: 'Delhi'
  },
  {
    id: 'BK004',
    customerName: 'Neha Patel',
    service: 'Home Cleaning',
    status: 'completed',
    amount: 750,
    time: '8 hours ago',
    location: 'Bangalore'
  }
];

const statusConfig = {
  pending: { color: 'orange', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  'in-progress': { color: 'purple', label: 'In Progress' },
  completed: { color: 'green', label: 'Completed' }
};

export default function RecentBookings() {
  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="recent-bookings-card">
      <div className="card-header">
        <h3 className="card-title">Recent Bookings</h3>
        <a href="/bookings" className="view-all-link">
          View All <FiArrowRight />
        </a>
      </div>

      <div className="bookings-list-compact">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="booking-item-compact">
            <div className="booking-main">
              <div className="customer-section">
                <div className="customer-avatar">
                  {booking.customerName.charAt(0)}
                </div>
                <div className="customer-info">
                  <h4 className="customer-name">{booking.customerName}</h4>
                  <p className="booking-service">{booking.service}</p>
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-amount">₹{booking.amount.toLocaleString()}</div>
                {getStatusBadge(booking.status)}
              </div>
            </div>

            <div className="booking-footer">
              <div className="booking-meta">
                <span className="booking-time">
                  <FiClock size={12} />
                  {booking.time}
                </span>
                <span className="booking-location">
                  <FiMapPin size={12} />
                  {booking.location}
                </span>
              </div>
              
              <button className="view-booking-btn">
                <FiEye size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
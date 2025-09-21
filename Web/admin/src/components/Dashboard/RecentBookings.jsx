import React from 'react';
import { FiEye, FiClock, FiMapPin, FiArrowRight, FiRefreshCw } from 'react-icons/fi';

const statusConfig = {
  pending: { color: 'orange', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  'in-progress': { color: 'purple', label: 'In Progress' },
  completed: { color: 'green', label: 'Completed' },
  cancelled: { color: 'red', label: 'Cancelled' }
};

export default function RecentBookings({ data, loading, onRefresh, onViewAll }) {
  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown time';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="recent-bookings-card">
        <div className="card-header">
          <h3 className="card-title">Recent Bookings</h3>
          <FiRefreshCw className="spinning" />
        </div>
        <div className="loading-container">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="booking-item-skeleton">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentBookings = data || [];

  return (
    <div className="recent-bookings-card">
      <div className="card-header">
        <h3 className="card-title">Recent Bookings</h3>
        <div className="card-actions">
          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh}>
              <FiRefreshCw />
            </button>
          )}
          <button className="view-all-link" onClick={onViewAll}>
            View All <FiArrowRight />
          </button>
        </div>
      </div>

      <div className="bookings-list-compact">
        {recentBookings.length === 0 ? (
          <div className="empty-state">
            <p>No recent bookings</p>
          </div>
        ) : (
          recentBookings.map((booking) => (
            <div key={booking._id} className="booking-item-compact">
              <div className="booking-main">
                <div className="customer-section">
                  <div className="customer-avatar">
                    {booking.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="customer-info">
                    <h4 className="customer-name">
                      {booking.user?.name || 'Unknown User'}
                    </h4>
                    <p className="booking-service">
                      {booking.service?.name || 'Service not found'}
                    </p>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="booking-amount">
                    ₹{(booking.pricing?.totalAmount || booking.amount || 0).toLocaleString()}
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <div className="booking-footer">
                <div className="booking-meta">
                  <span className="booking-time">
                    <FiClock size={12} />
                    {formatTime(booking.createdAt)}
                  </span>
                  <span className="booking-location">
                    <FiMapPin size={12} />
                    {booking.address ? 
                      `${booking.address.city}, ${booking.address.state}` :
                      booking.location || 'Location not specified'
                    }
                  </span>
                </div>
                
                <button 
                  className="view-booking-btn"
                  onClick={() => onViewAll && onViewAll(booking)}
                >
                  <FiEye size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
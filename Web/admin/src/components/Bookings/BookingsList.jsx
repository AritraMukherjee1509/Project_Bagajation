import React, { useState } from 'react';
import { 
  FiEye, 
  FiEdit, 
  FiPhone, 
  FiMapPin,
  FiClock,
  FiUser,
  FiMoreVertical,
  FiRefreshCw,
  FiDownload,
  FiMessageCircle
} from 'react-icons/fi';

const statusConfig = {
  pending: { color: 'orange', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  'in-progress': { color: 'purple', label: 'In Progress' },
  completed: { color: 'green', label: 'Completed' },
  cancelled: { color: 'red', label: 'Cancelled' }
};

export default function BookingsList({ 
  bookings = [], 
  loading, 
  error,
  pagination = {},
  onPageChange,
  onRefresh,
  onViewDetails,
  onUpdateStatus,
  onExport
}) {
  const [selectedBookings, setSelectedBookings] = useState(new Set());
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const handleSelectBooking = (bookingId) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBookings.size === bookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(bookings.map(b => b._id)));
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const handleStatusUpdate = async (booking, newStatus) => {
    try {
      await onUpdateStatus(booking._id, { status: newStatus });
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleBulkExport = () => {
    if (selectedBookings.size === 0) {
      onExport();
    } else {
      const selectedBookingData = bookings.filter(b => selectedBookings.has(b._id));
      onExport(selectedBookingData);
    }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (timeString.includes(':')) return timeString;
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="bookings-list">
        <div className="loading-container">
          <div className="loading-spinner">
            <FiRefreshCw className="spinning" />
            <p>Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-list">
        <div className="error-container">
          <p>Error loading bookings: {error}</p>
          <button className="btn btn-primary" onClick={onRefresh}>
            <FiRefreshCw />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-list">
      <div className="list-header">
        <div className="header-left">
          <h3>All Bookings ({pagination.total || bookings.length})</h3>
          {selectedBookings.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedBookings.size} selected
              </span>
              <button className="bulk-action-btn" onClick={handleBulkExport}>
                <FiDownload />
                Export Selected
              </button>
            </div>
          )}
        </div>
        
        <div className="list-controls">
          <button className="btn btn-outline" onClick={onRefresh}>
            <FiRefreshCw />
            Refresh
          </button>
          <button className="btn btn-outline" onClick={handleBulkExport}>
            <FiDownload />
            Export All
          </button>
        </div>
      </div>

      <div className="bookings-table">
        <div className="table-header">
          <div className="header-cell checkbox">
            <input
              type="checkbox"
              checked={selectedBookings.size === bookings.length && bookings.length > 0}
              onChange={handleSelectAll}
            />
          </div>
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
          {bookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings found</p>
              <p className="empty-subtitle">Try adjusting your filters or refresh the page</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="table-row">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBookings.has(booking._id)}
                    onChange={() => handleSelectBooking(booking._id)}
                  />
                </div>
                
                <div className="table-cell">
                  <span className="booking-id">
                    {booking.bookingId || booking._id?.substring(0, 8) || 'N/A'}
                  </span>
                </div>
                
                <div className="table-cell">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {booking.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="customer-details">
                      <div className="customer-name">
                        {booking.user?.name || 'Unknown User'}
                      </div>
                      <div className="customer-contact">
                        <FiPhone size={12} />
                        {booking.user?.phone || booking.contactInfo?.phone || 'No phone'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="service-info">
                    <div className="service-name">
                      {booking.service?.name || 'Service not found'}
                    </div>
                    <div className="service-location">
                      <FiMapPin size={12} />
                      {booking.address ? 
                        `${booking.address.city}, ${booking.address.state}` :
                        booking.location || 'Location not specified'
                      }
                    </div>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="provider-info">
                    <div className="provider-avatar">
                      {booking.provider?.name?.charAt(0) || 'P'}
                    </div>
                    <span className="provider-name">
                      {booking.provider?.name || 'Not assigned'}
                    </span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="datetime-info">
                    <div className="booking-date">
                      {formatDate(booking.scheduledDate || booking.createdAt)}
                    </div>
                    <div className="booking-time">
                      <FiClock size={12} />
                      {formatTime(booking.scheduledTime || booking.scheduledDate)}
                    </div>
                  </div>
                </div>

                <div className="table-cell">
                  <span className="booking-amount">
                    ₹{(booking.pricing?.totalAmount || booking.amount || 0).toLocaleString()}
                  </span>
                </div>

                <div className="table-cell">
                  {getStatusBadge(booking.status)}
                </div>

                <div className="table-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view" 
                      title="View Details"
                      onClick={() => onViewDetails(booking)}
                    >
                      <FiEye />
                    </button>
                    
                    {booking.messages?.length > 0 && (
                      <button 
                        className="action-btn message" 
                        title="View Messages"
                      >
                        <FiMessageCircle />
                      </button>
                    )}
                    
                    <div className="action-menu">
                      <button 
                        className="action-btn more"
                        title="More Options"
                        onClick={() => setActionMenuOpen(
                          actionMenuOpen === booking._id ? null : booking._id
                        )}
                      >
                        <FiMoreVertical />
                      </button>
                      
                      {actionMenuOpen === booking._id && (
                        <div className="action-dropdown">
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleStatusUpdate(booking, 'confirmed')}
                              className="dropdown-item"
                            >
                              Confirm Booking
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={() => handleStatusUpdate(booking, 'in-progress')}
                              className="dropdown-item"
                            >
                              Start Service
                            </button>
                          )}
                          {booking.status === 'in-progress' && (
                            <button 
                              onClick={() => handleStatusUpdate(booking, 'completed')}
                              className="dropdown-item"
                            >
                              Complete Service
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button 
                              onClick={() => handleStatusUpdate(booking, 'cancelled')}
                              className="dropdown-item danger"
                            >
                              Cancel Booking
                            </button>
                          )}
                          <button 
                            onClick={() => onViewDetails(booking)}
                            className="dropdown-item"
                          >
                            View Full Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * 10) + 1}-{Math.min(pagination.page * 10, pagination.total)} of {pagination.total} bookings
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              disabled={!pagination.hasPrev}
              onClick={() => handlePageClick(pagination.page - 1)}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const pageNum = pagination.page <= 3 ? i + 1 : pagination.page - 2 + i;
              if (pageNum <= pagination.pages) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${pageNum === pagination.page ? 'active' : ''}`}
                    onClick={() => handlePageClick(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            <button 
              className="pagination-btn" 
              disabled={!pagination.hasNext}
              onClick={() => handlePageClick(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { 
  FiX, 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiCalendar, 
  FiClock,
  FiUser,
  FiDollarSign,
  FiMessageCircle,
  FiEdit
} from 'react-icons/fi';

export default function BookingDetails({ booking, onClose, onUpdate }) {
  const [status, setStatus] = useState(booking?.status || 'pending');
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'orange' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'in-progress', label: 'In Progress', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  const handleUpdateStatus = () => {
    onUpdate({ ...booking, status, notes });
    onClose();
  };

  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="booking-details-modal">
        <div className="modal-header">
          <h2 className="modal-title">Booking Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div className="booking-info-grid">
            {/* Customer Information */}
            <div className="info-section">
              <h3 className="section-title">
                <FiUser />
                Customer Information
              </h3>
              <div className="customer-card">
                <div className="customer-avatar large">
                  {booking.customerName.charAt(0)}
                </div>
                <div className="customer-details">
                  <h4>{booking.customerName}</h4>
                  <div className="contact-info">
                    <div className="contact-item">
                      <FiPhone />
                      <span>{booking.customerPhone}</span>
                    </div>
                    <div className="contact-item">
                      <FiMail />
                      <span>{booking.customerEmail || 'Not provided'}</span>
                    </div>
                    <div className="contact-item">
                      <FiMapPin />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="info-section">
              <h3 className="section-title">
                <FiCalendar />
                Service Information
              </h3>
              <div className="service-details">
                <div className="detail-row">
                  <span className="detail-label">Service:</span>
                  <span className="detail-value">{booking.service}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Provider:</span>
                  <span className="detail-value">{booking.provider}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{booking.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">
                    <FiClock />
                    {booking.time}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value amount">
                    <FiDollarSign />
                    ₹{booking.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="info-section full-width">
              <h3 className="section-title">
                <FiEdit />
                Status Management
              </h3>
              <div className="status-controls">
                <div className="current-status">
                  <span className="status-label">Current Status:</span>
                  <span className={`status-badge ${statusOptions.find(s => s.value === booking.status)?.color}`}>
                    {statusOptions.find(s => s.value === booking.status)?.label}
                  </span>
                </div>
                
                <div className="status-update">
                  <label className="form-label">Update Status:</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="status-select"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="notes-section">
                <label className="form-label">Add Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or comments about this booking..."
                  className="notes-textarea"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUpdateStatus}>
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
}
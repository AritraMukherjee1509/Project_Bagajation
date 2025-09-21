import React, { useState, useEffect } from 'react';
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
  FiEdit,
  FiLoader,
  FiStar,
  FiTruck,
  FiCheckCircle
} from 'react-icons/fi';
import { bookingsAPI } from '../../utils/api';

export default function BookingDetails({ booking, onClose, onUpdate }) {
  const [status, setStatus] = useState(booking?.status || 'pending');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'orange' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'in-progress', label: 'In Progress', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    if (booking) {
      setStatus(booking.status || 'pending');
      loadMessages();
    }
  }, [booking]);

  const loadMessages = async () => {
    if (!booking?._id) return;

    try {
      // Load messages for this booking
      // const response = await bookingsAPI.getBookingMessages(booking._id);
      // if (response.success) {
      //   setMessages(response.data);
      // }
      
      // Mock messages for now
      setMessages(booking.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!booking?._id) return;

    try {
      setLoading(true);
      
      const updateData = {
        status,
        ...(notes && { notes })
      };

      await onUpdate(updateData);
      
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !booking?._id) return;

    try {
      setLoading(true);
      
      const response = await bookingsAPI.addMessage(booking._id, {
        message: newMessage.trim(),
        sender: 'admin'
      });

      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    if (timeString.includes(':')) return timeString;
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock />;
      case 'confirmed':
        return <FiCheckCircle />;
      case 'in-progress':
        return <FiTruck />;
      case 'completed':
        return <FiCheckCircle />;
      case 'cancelled':
        return <FiX />;
      default:
        return <FiClock />;
    }
  };

  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="booking-details-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2 className="modal-title">Booking Details</h2>
            <div className="booking-id">
              ID: {booking.bookingId || booking._id?.substring(0, 8) || 'N/A'}
            </div>
          </div>
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
                  {booking.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="customer-details">
                  <h4>{booking.user?.name || 'Unknown User'}</h4>
                  <div className="contact-info">
                    <div className="contact-item">
                      <FiPhone />
                      <span>
                        {booking.user?.phone || booking.contactInfo?.phone || 'Not provided'}
                      </span>
                    </div>
                    <div className="contact-item">
                      <FiMail />
                      <span>
                        {booking.user?.email || booking.contactInfo?.email || 'Not provided'}
                      </span>
                    </div>
                    <div className="contact-item">
                      <FiMapPin />
                      <span>
                        {booking.address ? 
                          `${booking.address.street ? booking.address.street + ', ' : ''}${booking.address.city}, ${booking.address.state} ${booking.address.zipCode || ''}`.trim() :
                          booking.location || 'Not provided'
                        }
                      </span>
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
                  <span className="detail-value">
                    {booking.service?.name || 'Service not found'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">
                    {booking.service?.category || 'Not specified'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Provider:</span>
                  <span className="detail-value">
                    {booking.provider?.name || 'Not assigned'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Scheduled Date:</span>
                  <span className="detail-value">
                    {formatDate(booking.scheduledDate)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Scheduled Time:</span>
                  <span className="detail-value">
                    <FiClock />
                    {formatTime(booking.scheduledTime || booking.scheduledDate)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">
                    {booking.service?.duration || 'Not specified'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="info-section">
              <h3 className="section-title">
                <FiDollarSign />
                Pricing Details
              </h3>
              <div className="pricing-details">
                <div className="detail-row">
                  <span className="detail-label">Base Price:</span>
                  <span className="detail-value">
                    ₹{(booking.pricing?.basePrice || booking.service?.pricing?.basePrice || 0).toLocaleString()}
                  </span>
                </div>
                {booking.pricing?.additionalCharges > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Additional Charges:</span>
                    <span className="detail-value">
                      ₹{booking.pricing.additionalCharges.toLocaleString()}
                    </span>
                  </div>
                )}
                {booking.pricing?.discount > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Discount:</span>
                    <span className="detail-value discount">
                      -₹{booking.pricing.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                {booking.pricing?.tax > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Tax:</span>
                    <span className="detail-value">
                      ₹{booking.pricing.tax.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="detail-row total">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value amount">
                    <FiDollarSign />
                    ₹{(booking.pricing?.totalAmount || booking.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Status:</span>
                  <span className={`status-badge ${booking.paymentStatus || 'pending'}`}>
                    {booking.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Status and Actions */}
            <div className="info-section full-width">
              <h3 className="section-title">
                <FiEdit />
                Status Management
              </h3>
              <div className="status-controls">
                <div className="current-status">
                  <span className="status-label">Current Status:</span>
                  <div className="status-display">
                    {getStatusIcon(booking.status)}
                    <span className={`status-badge ${statusOptions.find(s => s.value === booking.status)?.color}`}>
                      {statusOptions.find(s => s.value === booking.status)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="status-update">
                  <label className="form-label">Update Status:</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="status-select"
                    disabled={loading}
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
                  disabled={loading}
                />
              </div>

              {/* Previous Notes */}
              {booking.notes && booking.notes.length > 0 && (
                <div className="previous-notes">
                  <h4>Previous Notes:</h4>
                  <div className="notes-list">
                    {booking.notes.map((note, index) => (
                      <div key={index} className="note-item">
                        <div className="note-meta">
                          <span className="note-author">{note.author || 'Admin'}</span>
                          <span className="note-date">
                            {formatDate(note.createdAt || note.date)}
                          </span>
                        </div>
                        <p className="note-content">{note.content || note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages/Communication */}
            <div className="info-section full-width">
              <h3 className="section-title">
                <FiMessageCircle />
                Messages & Communication
              </h3>
              
              <div className="messages-container">
                {messages.length > 0 ? (
                  <div className="messages-list">
                    {messages.map((message, index) => (
                      <div key={index} className={`message-item ${message.sender === 'admin' ? 'admin' : 'user'}`}>
                        <div className="message-header">
                          <span className="message-sender">
                            {message.sender === 'admin' ? 'Admin' : booking.user?.name || 'User'}
                          </span>
                          <span className="message-time">
                            {formatDate(message.createdAt || message.timestamp)}
                          </span>
                        </div>
                        <p className="message-content">{message.content || message.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-messages">
                    <p>No messages yet</p>
                  </div>
                )}
                
                <div className="message-input">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message to the customer..."
                    className="message-textarea"
                    rows={2}
                    disabled={loading}
                  />
                  <button 
                    className="send-message-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || loading}
                  >
                    {loading ? <FiLoader className="spinning" /> : <FiMessageCircle />}
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Rating & Review (if completed) */}
            {booking.status === 'completed' && booking.rating && (
              <div className="info-section full-width">
                <h3 className="section-title">
                  <FiStar />
                  Customer Feedback
                </h3>
                <div className="feedback-content">
                  <div className="rating-display">
                    <span className="rating-label">Rating:</span>
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`star ${i < booking.rating ? 'filled' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="rating-value">({booking.rating}/5)</span>
                  </div>
                  {booking.review && (
                    <div className="review-content">
                      <span className="review-label">Review:</span>
                      <p className="review-text">{booking.review}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Close
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleUpdateStatus}
            disabled={loading || status === booking.status}
          >
            {loading ? (
              <>
                <FiLoader className="spinning" />
                Updating...
              </>
            ) : (
              'Update Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
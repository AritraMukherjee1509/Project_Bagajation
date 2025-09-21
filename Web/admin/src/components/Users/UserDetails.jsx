import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiEdit, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiClock,
  FiUser,
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';
import { usersAPI, bookingsAPI } from '../../utils/api';

export default function UserDetails({ user, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [userBookings, setUserBookings] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && activeTab === 'bookings') {
      loadUserBookings();
    }
    if (user && activeTab === 'activity') {
      loadUserActivity();
    }
  }, [user, activeTab]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsAPI.getBookings({ 
        user: user._id,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      });
      
      if (response.success) {
        setUserBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to load user bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadUserActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      // You'll need to implement this API endpoint
      // const response = await usersAPI.getUserActivity(user._id);
      
      // Mock data for now
      setUserActivity([
        {
          id: 1,
          type: 'booking_created',
          title: 'Booked AC Installation Service',
          description: 'Booking ID: BK001 • Amount: ₹1,050',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          icon: 'calendar'
        },
        {
          id: 2,
          type: 'review_created',
          title: 'Rated Electrical Repair Service',
          description: 'Given 4-star rating with positive feedback',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          icon: 'star'
        },
        {
          id: 3,
          type: 'profile_updated',
          title: 'Updated Profile Information',
          description: 'Changed phone number and address',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          icon: 'user'
        }
      ]);
    } catch (error) {
      console.error('Failed to load user activity:', error);
      setError('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking_created':
      case 'booking_updated':
        return <FiCalendar />;
      case 'review_created':
        return <FiStar />;
      case 'profile_updated':
        return <FiUser />;
      default:
        return <FiActivity />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  if (!user) return null;

  const userStats = {
    totalBookings: user.stats?.totalBookings || 0,
    completedBookings: user.stats?.completedBookings || 0,
    cancelledBookings: user.stats?.cancelledBookings || 0,
    totalSpent: user.stats?.totalSpent || 0,
    averageRating: user.stats?.averageRating || 0,
    memberSince: user.createdAt
  };

  return (
    <div className="modal-overlay">
      <div className="user-details-modal large">
        <div className="modal-header">
          <div className="header-content">
            <div className="user-header-info">
              <img 
                src={user.avatar || user.profileImage || '/default-avatar.jpg'} 
                alt={user.name} 
                className="user-avatar-large"
                onError={(e) => {
                  e.target.src = '/default-avatar.jpg';
                }}
              />
              <div className="user-basic-info">
                <h2 className="user-name">{user.name}</h2>
                <p className="user-email">{user.email}</p>
                <span className={`status-badge ${user.status || 'active'}`}>
                  {user.status || 'active'}
                </span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => onEdit(user)}>
              <FiEdit />
              Edit User
            </button>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({userStats.totalBookings})
          </button>
          <button
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-grid">
                <div className="profile-section">
                  <h3 className="section-title">
                    <FiUser />
                    Personal Information
                  </h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">Full Name:</span>
                      <span className="info-value">{user.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">
                        <FiMail />
                        {user.email}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">
                        <FiPhone />
                        {user.phone || 'Not provided'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role:</span>
                      <span className="info-value">{user.role || 'user'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Member Since:</span>
                      <span className="info-value">
                        <FiCalendar />
                        {formatDate(userStats.memberSince)}
                      </span>
                    </div>
                  </div>

                  {user.address && (
                    <div className="address-section">
                      <h4>Address</h4>
                      <div className="address-info">
                        <FiMapPin />
                        <div>
                          {user.address.street && <p>{user.address.street}</p>}
                          <p>
                            {user.address.city}, {user.address.state} {user.address.zipCode}
                          </p>
                          <p>{user.address.country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="stats-section">
                  <h3 className="section-title">User Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiCalendar />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{userStats.totalBookings}</span>
                        <span className="stat-label">Total Bookings</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiDollarSign />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">₹{userStats.totalSpent.toLocaleString()}</span>
                        <span className="stat-label">Total Spent</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiStar />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{userStats.averageRating || 'N/A'}</span>
                        <span className="stat-label">Average Rating</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiClock />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{userStats.completedBookings}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <div className="tab-header">
                <h3>Booking History</h3>
                <div className="tab-actions">
                  <span className="total-count">Total: {userBookings.length}</span>
                  <button className="btn btn-outline btn-sm" onClick={loadUserBookings}>
                    <FiRefreshCw />
                    Refresh
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <FiRefreshCw className="spinning" />
                  <p>Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={loadUserBookings}>
                    Retry
                  </button>
                </div>
              ) : userBookings.length === 0 ? (
                <div className="empty-state">
                  <p>No bookings found for this user</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {userBookings.map((booking) => (
                    <div key={booking._id} className="booking-item">
                      <div className="booking-main">
                        <div className="booking-info">
                          <h4 className="service-name">
                            {booking.service?.name || 'Service not found'}
                          </h4>
                          <p className="provider-name">
                            by {booking.provider?.name || 'Provider not assigned'}
                          </p>
                          <span className="booking-date">
                            {formatDate(booking.scheduledDate || booking.createdAt)}
                          </span>
                        </div>
                        <div className="booking-meta">
                          <span className="booking-amount">
                            ₹{(booking.pricing?.totalAmount || 0).toLocaleString()}
                          </span>
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      {booking.rating && (
                        <div className="booking-rating">
                          <span className="rating-label">Rating:</span>
                          <div className="rating-stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={`star ${i < booking.rating ? 'filled' : ''}`} 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-tab">
              <div className="tab-header">
                <h3>Recent Activity</h3>
                <button className="btn btn-outline btn-sm" onClick={loadUserActivity}>
                  <FiRefreshCw />
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <FiRefreshCw className="spinning" />
                  <p>Loading activity...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={loadUserActivity}>
                    Retry
                  </button>
                </div>
              ) : userActivity.length === 0 ? (
                <div className="empty-state">
                  <p>No recent activity found</p>
                </div>
              ) : (
                <div className="activity-timeline">
                  {userActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-content">
                        <h4>{activity.title}</h4>
                        <p>{activity.description}</p>
                        <span className="activity-time">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
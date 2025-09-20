import React, { useState } from 'react';
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
  FiUser
} from 'react-icons/fi';

export default function UserDetails({ user, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  const userBookings = [
    {
      id: 'BK001',
      service: 'AC Installation',
      provider: 'Subhajit Dey',
      date: '2024-01-15',
      amount: 1050,
      status: 'completed',
      rating: 5
    },
    {
      id: 'BK002',
      service: 'Electrical Repair',
      provider: 'Ravi Kumar',
      date: '2024-01-10',
      amount: 850,
      status: 'completed',
      rating: 4
    }
  ];

  const userStats = {
    totalBookings: 12,
    completedBookings: 10,
    cancelledBookings: 2,
    totalSpent: 15600,
    averageRating: 4.5,
    memberSince: '2024-01-15'
  };

  return (
    <div className="modal-overlay">
      <div className="user-details-modal large">
        <div className="modal-header">
          <div className="header-content">
            <div className="user-header-info">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="user-avatar-large"
              />
              <div className="user-basic-info">
                <h2 className="user-name">{user.name}</h2>
                <p className="user-email">{user.email}</p>
                <span className={`status-badge ${user.status}`}>
                  {user.status}
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
            Bookings
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
                        {user.phone}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location:</span>
                      <span className="info-value">
                        <FiMapPin />
                        {user.location}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Member Since:</span>
                      <span className="info-value">
                        <FiCalendar />
                        {new Date(user.joinDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
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
                        <span className="stat-value">{userStats.averageRating}</span>
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
                <span className="total-count">Total: {userBookings.length}</span>
              </div>
              
              <div className="bookings-list">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-main">
                      <div className="booking-info">
                        <h4 className="service-name">{booking.service}</h4>
                        <p className="provider-name">by {booking.provider}</p>
                        <span className="booking-date">{booking.date}</span>
                      </div>
                      <div className="booking-meta">
                        <span className="booking-amount">₹{booking.amount.toLocaleString()}</span>
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
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-tab">
              <div className="tab-header">
                <h3>Recent Activity</h3>
              </div>
              
              <div className="activity-timeline">
                <div className="activity-item">
                  <div className="activity-icon">
                    <FiCalendar />
                  </div>
                  <div className="activity-content">
                    <h4>Booked AC Installation Service</h4>
                    <p>Booking ID: BK001 • Amount: ₹1,050</p>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">
                    <FiStar />
                  </div>
                  <div className="activity-content">
                    <h4>Rated Electrical Repair Service</h4>
                    <p>Given 4-star rating with positive feedback</p>
                    <span className="activity-time">1 week ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">
                    <FiUser />
                  </div>
                  <div className="activity-content">
                    <h4>Updated Profile Information</h4>
                    <p>Changed phone number and address</p>
                    <span className="activity-time">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
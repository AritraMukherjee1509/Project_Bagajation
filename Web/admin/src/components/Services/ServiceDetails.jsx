import React, { useState } from 'react';
import { 
  FiX, 
  FiEdit, 
  FiTrash2, 
  FiStar, 
  FiUsers, 
  FiDollarSign,
  FiClock,
  FiShield,
  FiMapPin,
  FiTrendingUp
} from 'react-icons/fi';

export default function ServiceDetails({ service, onClose, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!service) return null;

  const recentBookings = [
    {
      id: 'BK001',
      customerName: 'Rajesh Kumar',
      date: '2024-01-15',
      amount: 1050,
      status: 'completed'
    },
    {
      id: 'BK002', 
      customerName: 'Priya Sharma',
      date: '2024-01-12',
      amount: 1050,
      status: 'confirmed'
    }
  ];

  const reviews = [
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      rating: 5,
      comment: 'Excellent service! Very professional work.',
      date: '2024-01-15'
    },
    {
      id: 2,
      customerName: 'Priya Sharma', 
      rating: 4,
      comment: 'Good service, timely completion.',
      date: '2024-01-12'
    }
  ];

  const analytics = {
    totalBookings: 142,
    totalRevenue: 149100,
    averageRating: 4.8,
    completionRate: 95,
    monthlyTrend: [
      { month: 'Jan', bookings: 35, revenue: 36750 },
      { month: 'Feb', bookings: 42, revenue: 44100 },
      { month: 'Mar', bookings: 38, revenue: 39900 },
      { month: 'Apr', bookings: 27, revenue: 28350 }
    ]
  };

  return (
    <div className="modal-overlay">
      <div className="service-details-modal large">
        <div className="modal-header">
          <div className="header-content">
            <h2 className="modal-title">{service.name}</h2>
            <div className="service-meta">
              <span className="category-badge">{service.category}</span>
              <span className={`status-badge ${service.status}`}>
                {service.status}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => onEdit(service)}>
              <FiEdit />
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(service)}>
              <FiTrash2 />
              Delete
            </button>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="service-overview-grid">
                <div className="service-image-section">
                  <img src={service.image} alt={service.name} className="service-image" />
                  <div className="quick-stats">
                    <div className="stat-item">
                      <FiStar className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{service.rating}</span>
                        <span className="stat-label">Rating</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FiUsers className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{service.bookings}</span>
                        <span className="stat-label">Bookings</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FiDollarSign className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">₹{service.price}</span>
                        <span className="stat-label">Price</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="service-details-section">
                  <div className="detail-group">
                    <h3>Service Information</h3>
                    <div className="detail-list">
                      <div className="detail-item">
                        <span className="detail-label">Provider:</span>
                        <span className="detail-value">{service.provider}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{service.category}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{service.duration || 'Not specified'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Warranty:</span>
                        <span className="detail-value">{service.warranty || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h3>Description</h3>
                    <p className="service-description">{service.description}</p>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div className="detail-group">
                      <h3>Features</h3>
                      <div className="features-grid">
                        {service.features.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <FiShield className="feature-icon" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <div className="tab-header">
                <h3>Recent Bookings</h3>
                <span className="total-count">Total: {analytics.totalBookings}</span>
              </div>
              
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <div className="customer-avatar">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div className="booking-details">
                        <h4>{booking.customerName}</h4>
                        <span className="booking-date">{booking.date}</span>
                      </div>
                    </div>
                    <div className="booking-meta">
                      <span className="booking-amount">₹{booking.amount.toLocaleString()}</span>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="tab-header">
                <h3>Customer Reviews</h3>
                <div className="rating-summary">
                  <FiStar className="star-icon" />
                  <span className="average-rating">{analytics.averageRating}</span>
                  <span className="rating-count">({reviews.length} reviews)</span>
                </div>
              </div>
              
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.customerName.charAt(0)}
                        </div>
                        <div className="reviewer-details">
                          <h4>{review.customerName}</h4>
                          <span className="review-date">{review.date}</span>
                        </div>
                      </div>
                      <div className="review-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`star ${i < review.rating ? 'filled' : ''}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <div className="analytics-stats">
                <div className="stat-card">
                  <div className="stat-header">
                    <FiUsers className="stat-icon" />
                    <span className="stat-title">Total Bookings</span>
                  </div>
                  <div className="stat-value">{analytics.totalBookings}</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <FiDollarSign className="stat-icon" />
                    <span className="stat-title">Total Revenue</span>
                  </div>
                  <div className="stat-value">₹{analytics.totalRevenue.toLocaleString()}</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <FiStar className="stat-icon" />
                    <span className="stat-title">Average Rating</span>
                  </div>
                  <div className="stat-value">{analytics.averageRating}</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <FiTrendingUp className="stat-icon" />
                    <span className="stat-title">Completion Rate</span>
                  </div>
                  <div className="stat-value">{analytics.completionRate}%</div>
                </div>
              </div>

              <div className="trend-chart">
                <h4>Monthly Trends</h4>
                <div className="chart-bars">
                  {analytics.monthlyTrend.map((item, index) => (
                    <div key={index} className="chart-item">
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar"
                          style={{ height: `${(item.bookings / 50) * 100}%` }}
                        />
                        <span className="bar-value">{item.bookings}</span>
                      </div>
                      <span className="chart-label">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
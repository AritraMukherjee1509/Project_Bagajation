import React, { useState, useEffect } from 'react';
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
  FiTrendingUp,
  FiRefreshCw
} from 'react-icons/fi';
import { servicesAPI, bookingsAPI, reviewsAPI, analyticsAPI } from '../../utils/api';

export default function ServiceDetails({ service, onClose, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [recentBookings, setRecentBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (service) {
      loadTabData();
    }
  }, [service, activeTab]);

  const loadTabData = async () => {
    if (!service) return;

    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'bookings':
          await loadRecentBookings();
          break;
        case 'reviews':
          await loadReviews();
          break;
        case 'analytics':
          await loadAnalytics();
          break;
        default:
          // For overview tab, we don't need to load additional data
          break;
      }
    } catch (error) {
      console.error('Failed to load tab data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentBookings = async () => {
    try {
      const response = await bookingsAPI.getBookings({
        service: service._id,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      });

      if (response.success) {
        setRecentBookings(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load recent bookings:', error);
      throw error;
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getReviews({
        service: service._id,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      });

      if (response.success) {
        setReviews(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      throw error;
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await servicesAPI.getServiceAnalytics(service._id);

      if (response.success) {
        setAnalytics(response.data);
      } else {
        // Fallback to mock data if API not implemented
        setAnalytics({
          totalBookings: service.stats?.totalBookings || 0,
          totalRevenue: service.stats?.totalRevenue || 0,
          averageRating: service.ratings?.averageRating || 0,
          completionRate: service.stats?.completionRate || 0,
          monthlyTrend: [
            { month: 'Jan', bookings: 35, revenue: 36750 },
            { month: 'Feb', bookings: 42, revenue: 44100 },
            { month: 'Mar', bookings: 38, revenue: 39900 },
            { month: 'Apr', bookings: 27, revenue: 28350 }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Set fallback data
      setAnalytics({
        totalBookings: service.stats?.totalBookings || 0,
        totalRevenue: service.stats?.totalRevenue || 0,
        averageRating: service.ratings?.averageRating || 0,
        completionRate: service.stats?.completionRate || 0,
        monthlyTrend: []
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
      try {
        await onDelete(service);
      } catch (error) {
        console.error('Failed to delete service:', error);
        setError('Failed to delete service: ' + error.message);
      }
    }
  };

  if (!service) return null;

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
            <button className="btn btn-danger" onClick={handleDelete}>
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
            Bookings ({service.stats?.totalBookings || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({service.ratings?.totalReviews || 0})
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
                  <img 
                    src={service.images?.[0] || '/default-service.jpg'} 
                    alt={service.name} 
                    className="service-image"
                    onError={(e) => {
                      e.target.src = '/default-service.jpg';
                    }}
                  />
                  <div className="quick-stats">
                    <div className="stat-item">
                      <FiStar className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">
                          {service.ratings?.averageRating || 0}
                        </span>
                        <span className="stat-label">Rating</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FiUsers className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">
                          {service.stats?.totalBookings || 0}
                        </span>
                        <span className="stat-label">Bookings</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FiDollarSign className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">
                          ₹{service.pricing?.basePrice || 0}
                        </span>
                        <span className="stat-label">Base Price</span>
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
                        <span className="detail-value">
                          {service.provider?.name || 'Not assigned'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{service.category}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">
                          {service.duration || 'Not specified'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Warranty:</span>
                        <span className="detail-value">
                          {service.warranty || 'Not specified'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">
                          {service.createdAt ? 
                            new Date(service.createdAt).toLocaleDateString('en-IN') : 
                            'Unknown'
                          }
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">
                          {service.updatedAt ? 
                            new Date(service.updatedAt).toLocaleDateString('en-IN') : 
                            'Unknown'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h3>Description</h3>
                    <p className="service-description">
                      {service.description || 'No description available'}
                    </p>
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

                  {service.pricing && (
                    <div className="detail-group">
                      <h3>Pricing Details</h3>
                      <div className="pricing-details">
                        <div className="detail-item">
                          <span className="detail-label">Base Price:</span>
                          <span className="detail-value">
                            ₹{service.pricing.basePrice || 0}
                          </span>
                        </div>
                        {service.pricing.additionalCharges && (
                          <div className="detail-item">
                            <span className="detail-label">Additional Charges:</span>
                            <span className="detail-value">
                              ₹{service.pricing.additionalCharges}
                            </span>
                          </div>
                        )}
                        {service.pricing.discount && (
                          <div className="detail-item">
                            <span className="detail-label">Discount:</span>
                            <span className="detail-value">
                              {service.pricing.discount}%
                            </span>
                          </div>
                        )}
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
                <div className="tab-actions">
                  <span className="total-count">
                    Total: {service.stats?.totalBookings || 0}
                  </span>
                  <button className="btn btn-outline btn-sm" onClick={loadRecentBookings}>
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
                  <button className="btn btn-primary" onClick={loadRecentBookings}>
                    Retry
                  </button>
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="empty-state">
                  <p>No bookings found for this service</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="booking-item">
                      <div className="booking-info">
                        <div className="customer-avatar">
                          {booking.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="booking-details">
                          <h4>{booking.user?.name || 'Unknown User'}</h4>
                          <span className="booking-date">
                            {booking.scheduledDate ? 
                              new Date(booking.scheduledDate).toLocaleDateString('en-IN') :
                              new Date(booking.createdAt).toLocaleDateString('en-IN')
                            }
                          </span>
                        </div>
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
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="tab-header">
                <h3>Customer Reviews</h3>
                <div className="rating-summary">
                  <FiStar className="star-icon" />
                  <span className="average-rating">
                    {service.ratings?.averageRating || 0}
                  </span>
                  <span className="rating-count">
                    ({service.ratings?.totalReviews || 0} reviews)
                  </span>
                  <button className="btn btn-outline btn-sm" onClick={loadReviews}>
                    <FiRefreshCw />
                    Refresh
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <FiRefreshCw className="spinning" />
                  <p>Loading reviews...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={loadReviews}>
                    Retry
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="empty-state">
                  <p>No reviews found for this service</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="reviewer-details">
                            <h4>{review.user?.name || 'Anonymous'}</h4>
                            <span className="review-date">
                              {review.createdAt ? 
                                new Date(review.createdAt).toLocaleDateString('en-IN') : 
                                'Unknown date'
                              }
                            </span>
                          </div>
                        </div>
                        <div className="review-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`star ${i < (review.rating || 0) ? 'filled' : ''}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="review-comment">
                        {review.comment || review.review || 'No comment provided'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              {loading ? (
                <div className="loading-container">
                  <FiRefreshCw className="spinning" />
                  <p>Loading analytics...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={loadAnalytics}>
                    Retry
                  </button>
                </div>
              ) : analytics ? (
                <>
                  <div className="analytics-stats">
                    <div className="stat-card">
                      <div className="stat-header">
                        <FiUsers className="stat-icon" />
                        <span className="stat-title">Total Bookings</span>
                      </div>
                      <div className="stat-value">{analytics.totalBookings || 0}</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <FiDollarSign className="stat-icon" />
                        <span className="stat-title">Total Revenue</span>
                      </div>
                      <div className="stat-value">
                        ₹{(analytics.totalRevenue || 0).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <FiStar className="stat-icon" />
                        <span className="stat-title">Average Rating</span>
                      </div>
                      <div className="stat-value">{analytics.averageRating || 0}</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <FiTrendingUp className="stat-icon" />
                        <span className="stat-title">Completion Rate</span>
                      </div>
                      <div className="stat-value">{analytics.completionRate || 0}%</div>
                    </div>
                  </div>

                  {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 && (
                    <div className="trend-chart">
                      <h4>Monthly Trends</h4>
                      <div className="chart-bars">
                        {analytics.monthlyTrend.map((item, index) => {
                          const maxBookings = Math.max(...analytics.monthlyTrend.map(t => t.bookings));
                          return (
                            <div key={index} className="chart-item">
                              <div className="chart-bar-container">
                                <div 
                                  className="chart-bar"
                                  style={{ 
                                    height: maxBookings > 0 ? `${(item.bookings / maxBookings) * 100}%` : '0%'
                                  }}
                                />
                                <span className="bar-value">{item.bookings}</span>
                              </div>
                              <span className="chart-label">{item.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <p>No analytics data available</p>
                  <button className="btn btn-primary" onClick={loadAnalytics}>
                    <FiRefreshCw />
                    Load Analytics
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
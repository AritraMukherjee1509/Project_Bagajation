import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiLogOut,
  FiSettings,
  FiChevronDown
} from 'react-icons/fi';

export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const notifications = [
    {
      id: 1,
      title: 'New booking received',
      message: 'AC Installation service booked by Rajesh Kumar',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Service completed',
      message: 'Plumbing service completed successfully',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Payment received',
      message: 'Payment of ₹1,050 received for booking #1234',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="admin-header">
      <div className="header-left">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-item">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="notification-count">{unreadCount} new</span>
              </div>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="header-item">
          <button
            className="profile-btn"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="profile-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || 'Admin'}</span>
              <span className="profile-role">Administrator</span>
            </div>
            <FiChevronDown className="profile-arrow" />
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="profile-details">
                  <div className="profile-avatar large">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="profile-text">
                    <h3>{user?.name || 'Admin User'}</h3>
                    <p>{user?.email || 'admin@bagajatin.com'}</p>
                  </div>
                </div>
              </div>
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <FiUser />
                  Profile Settings
                </button>
                <button className="dropdown-item">
                  <FiSettings />
                  Account Settings
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={logout}>
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {(showProfileDropdown || showNotifications) && (
        <div
          className="dropdown-overlay"
          onClick={() => {
            setShowProfileDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
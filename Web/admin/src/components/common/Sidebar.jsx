// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiGrid, 
  FiUsers, 
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';

const menuItems = [
  {
    path: '/dashboard',
    icon: FiHome,
    label: 'Dashboard',
    badge: null
  },
  {
    path: '/bookings',
    icon: FiCalendar,
    label: 'Bookings',
    badge: null
  },
  {
    path: '/services',
    icon: FiGrid,
    label: 'Services',
    badge: null
  },
  {
    path: '/users',
    icon: FiUsers,
    label: 'Users',
    badge: null
  },
  {
    path: '/analytics',
    icon: FiGrid,
    label: 'Analytics',
    badge: null
  },
  {
    path: '/settings',
    icon: FiSettings,
    label: 'Settings',
    badge: null
  }
];

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Handle sidebar toggle
  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-badge">LG</span>
          {!isCollapsed && <span className="logo-text">Admin</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
        >
          {isCollapsed || (isMobile && !isOpen) ? <FiMenu /> : <FiX />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <IconComponent className="nav-icon" />
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
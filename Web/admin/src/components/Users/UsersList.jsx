import React, { useState } from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiPlus,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiSearch,
  FiFilter
} from 'react-icons/fi';

const users = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    location: 'Kolkata, WB',
    joinDate: '2024-01-15',
    totalBookings: 12,
    totalSpent: 15600,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    location: 'Mumbai, MH',
    joinDate: '2024-01-10',
    totalBookings: 8,
    totalSpent: 9800,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    phone: '+91 76543 21098',
    location: 'Delhi, DL',
    joinDate: '2024-01-05',
    totalBookings: 15,
    totalSpent: 18750,
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
  }
];

export default function UsersList({ onEdit, onDelete, onView, onCreate }) {
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="users-list">
      <div className="list-header">
        <div className="header-left">
          <h3>All Users ({filteredUsers.length})</h3>
          {selectedUsers.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedUsers.size} selected
              </span>
              <button className="bulk-action-btn">
                <FiTrash2 />
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="joinDate">Sort by Join Date</option>
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="totalBookings">Sort by Bookings</option>
          </select>
          
          <button className="btn btn-primary" onClick={onCreate}>
            <FiPlus />
            Add User
          </button>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="header-cell checkbox">
            <input
              type="checkbox"
              checked={selectedUsers.size === users.length}
              onChange={handleSelectAll}
            />
          </div>
          <div className="header-cell">User</div>
          <div className="header-cell">Contact</div>
          <div className="header-cell">Location</div>
          <div className="header-cell">Join Date</div>
          <div className="header-cell">Bookings</div>
          <div className="header-cell">Total Spent</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {filteredUsers.map((user) => (
            <div key={user.id} className="table-row">
              <div className="table-cell checkbox">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              </div>
              
              <div className="table-cell">
                <div className="user-info">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h4 className="user-name">{user.name}</h4>
                    <span className="user-id">ID: {user.id}</span>
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <div className="contact-info">
                  <div className="contact-item">
                    <FiMail size={14} />
                    <span>{user.email}</span>
                  </div>
                  <div className="contact-item">
                    <FiPhone size={14} />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <div className="location-info">
                  <FiMapPin size={14} />
                  <span>{user.location}</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="date-info">
                  <FiCalendar size={14} />
                  <span>{formatDate(user.joinDate)}</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="bookings-count">
                  <span className="count-value">{user.totalBookings}</span>
                  <span className="count-label">bookings</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="spent-amount">
                  ₹{user.totalSpent.toLocaleString()}
                </div>
              </div>

              <div className="table-cell">
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>

              <div className="table-cell">
                <div className="action-buttons">
                  <button 
                    className="action-btn view"
                    onClick={() => onView(user)}
                    title="View Details"
                  >
                    <FiEye />
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => onEdit(user)}
                    title="Edit User"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => onDelete(user)}
                    title="Delete User"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          Showing 1-{filteredUsers.length} of {filteredUsers.length} users
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  );
}
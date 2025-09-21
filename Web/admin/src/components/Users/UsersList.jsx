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
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';

export default function UsersList({ 
  users = [], 
  loading, 
  error,
  pagination = {},
  filters,
  setFilters,
  onEdit, 
  onDelete, 
  onView, 
  onCreate,
  onRefresh
}) {
  const [selectedUsers, setSelectedUsers] = useState(new Set());

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
      setSelectedUsers(new Set(users.map(u => u._id)));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} users?`)) {
      try {
        for (const userId of selectedUsers) {
          const user = users.find(u => u._id === userId);
          if (user) {
            await onDelete(user);
          }
        }
        setSelectedUsers(new Set());
      } catch (error) {
        console.error('Bulk delete failed:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="users-list">
        <div className="loading-container">
          <div className="loading-spinner">
            <FiRefreshCw className="spinning" />
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list">
        <div className="error-container">
          <p>Error loading users: {error}</p>
          <button className="btn btn-primary" onClick={onRefresh}>
            <FiRefreshCw />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list">
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-filter">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filters.status || 'all'} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="filter-input"
            placeholder="Start Date"
          />
          
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="filter-input"
            placeholder="End Date"
          />
          
          <select 
            value={filters.sortBy || 'createdAt'} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Sort by Join Date</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="stats.totalSpent">Sort by Total Spent</option>
            <option value="stats.totalBookings">Sort by Bookings</option>
          </select>
          
          <select 
            value={filters.order || 'desc'} 
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="sort-select"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="list-header">
        <div className="header-left">
          <h3>All Users ({pagination.total || users.length})</h3>
          {selectedUsers.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedUsers.size} selected
              </span>
              <button className="bulk-action-btn" onClick={handleBulkDelete}>
                <FiTrash2 />
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <button className="btn btn-outline" onClick={onRefresh}>
            <FiRefreshCw />
            Refresh
          </button>
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
              checked={selectedUsers.size === users.length && users.length > 0}
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
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users found</p>
              <button className="btn btn-primary" onClick={onCreate}>
                <FiPlus />
                Add First User
              </button>
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="table-row">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                  />
                </div>
                
                <div className="table-cell">
                  <div className="user-info">
                    <img 
                      src={user.avatar || user.profileImage || '/default-avatar.jpg'} 
                      alt={user.name}
                      className="user-avatar"
                      onError={(e) => {
                        e.target.src = '/default-avatar.jpg';
                      }}
                    />
                    <div className="user-details">
                      <h4 className="user-name">{user.name}</h4>
                      <span className="user-id">ID: {user._id?.substring(0, 8) || 'N/A'}</span>
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
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="location-info">
                    <FiMapPin size={14} />
                    <span>
                      {user.address ? 
                        `${user.address.city || ''}, ${user.address.state || ''}`.trim().replace(/^,|,$/g, '') || 'Not provided'
                        : user.location || 'Not provided'
                      }
                    </span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="date-info">
                    <FiCalendar size={14} />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="bookings-count">
                    <span className="count-value">{user.stats?.totalBookings || 0}</span>
                    <span className="count-label">bookings</span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="spent-amount">
                    ₹{(user.stats?.totalSpent || 0).toLocaleString()}
                  </div>
                </div>

                <div className="table-cell">
                  <span className={`status-badge ${user.status || 'active'}`}>
                    {user.status || 'active'}
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
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * filters.limit) + 1}-{Math.min(pagination.page * filters.limit, pagination.total)} of {pagination.total} users
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              disabled={!pagination.hasPrev}
              onClick={() => handlePageChange(pagination.page - 1)}
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
                    onClick={() => handlePageChange(pageNum)}
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
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
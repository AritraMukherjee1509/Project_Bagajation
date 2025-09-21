import React, { useState } from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiPlus,
  FiStar,
  FiUsers,
  FiDollarSign,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';

export default function ServicesList({ 
  services = [], 
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
  const [selectedServices, setSelectedServices] = useState(new Set());

  const handleSelectService = (serviceId) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedServices.size === services.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(services.map(s => s._id)));
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

  const toggleServiceStatus = async (service) => {
    try {
      const newStatus = service.status === 'active' ? 'inactive' : 'active';
      await onEdit({ ...service, status: newStatus });
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedServices.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedServices.size} services?`)) {
      try {
        // You would need to implement bulk delete in API
        for (const serviceId of selectedServices) {
          const service = services.find(s => s._id === serviceId);
          if (service) {
            await onDelete(service);
          }
        }
        setSelectedServices(new Set());
      } catch (error) {
        console.error('Bulk delete failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="services-list">
        <div className="loading-container">
          <div className="loading-spinner">
            <FiRefreshCw className="spinning" />
            <p>Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-list">
        <div className="error-container">
          <p>Error loading services: {error}</p>
          <button className="btn btn-primary" onClick={onRefresh}>
            <FiRefreshCw />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-list">
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-filter">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search services..."
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
          </select>
          
          <select 
            value={filters.category || 'all'} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="AC Services">AC Services</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Repair">Repair</option>
          </select>
          
          <select 
            value={filters.sortBy || 'createdAt'} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="pricing.basePrice">Sort by Price</option>
            <option value="ratings.averageRating">Sort by Rating</option>
          </select>
        </div>
      </div>

      <div className="list-header">
        <div className="header-left">
          <h3>All Services ({pagination.total || services.length})</h3>
          {selectedServices.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedServices.size} selected
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
            Add Service
          </button>
        </div>
      </div>

      <div className="services-table">
        <div className="table-header">
          <div className="header-cell checkbox">
            <input
              type="checkbox"
              checked={selectedServices.size === services.length && services.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          <div className="header-cell">Service</div>
          <div className="header-cell">Category</div>
          <div className="header-cell">Provider</div>
          <div className="header-cell">Price</div>
          <div className="header-cell">Rating</div>
          <div className="header-cell">Bookings</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {services.length === 0 ? (
            <div className="empty-state">
              <p>No services found</p>
              <button className="btn btn-primary" onClick={onCreate}>
                <FiPlus />
                Add First Service
              </button>
            </div>
          ) : (
            services.map((service) => (
              <div key={service._id} className="table-row">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedServices.has(service._id)}
                    onChange={() => handleSelectService(service._id)}
                  />
                </div>
                
                <div className="table-cell">
                  <div className="service-info">
                    <img 
                      src={service.images?.[0] || '/default-service.jpg'} 
                      alt={service.name}
                      className="service-image"
                      onError={(e) => {
                        e.target.src = '/default-service.jpg';
                      }}
                    />
                    <div className="service-details">
                      <h4 className="service-name">{service.name}</h4>
                      <p className="service-description">
                        {service.description?.substring(0, 100)}
                        {service.description?.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="table-cell">
                  <span className="category-badge">{service.category}</span>
                </div>

                <div className="table-cell">
                  <div className="provider-info">
                    <div className="provider-avatar">
                      {service.provider?.name?.charAt(0) || 'N'}
                    </div>
                    <span className="provider-name">
                      {service.provider?.name || 'Not assigned'}
                    </span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="price-info">
                    <FiDollarSign />
                    <span className="price">
                      ₹{service.pricing?.basePrice || 0}
                    </span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="rating-info">
                    <FiStar className="star-icon" />
                    <span className="rating">
                      {service.ratings?.averageRating || 0}
                    </span>
                    <span className="rating-count">
                      ({service.ratings?.totalReviews || 0})
                    </span>
                  </div>
                </div>

                <div className="table-cell">
                  <div className="bookings-info">
                    <FiUsers />
                    <span className="bookings">
                      {service.stats?.totalBookings || 0}
                    </span>
                  </div>
                </div>

                <div className="table-cell">
                  <button
                    className={`status-toggle ${service.status}`}
                    onClick={() => toggleServiceStatus(service)}
                  >
                    {service.status === 'active' ? (
                      <>
                        <FiToggleRight />
                        Active
                      </>
                    ) : (
                      <>
                        <FiToggleLeft />
                        Inactive
                      </>
                    )}
                  </button>
                </div>

                <div className="table-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => onView(service)}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => onEdit(service)}
                      title="Edit Service"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => onDelete(service)}
                      title="Delete Service"
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
            Showing {((pagination.page - 1) * filters.limit) + 1}-{Math.min(pagination.page * filters.limit, pagination.total)} of {pagination.total} services
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
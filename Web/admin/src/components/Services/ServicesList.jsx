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
  FiToggleRight
} from 'react-icons/fi';

const services = [
  {
    id: 1,
    name: 'AC Installation Service',
    category: 'AC Services',
    description: 'Professional AC installation with warranty',
    price: 1050,
    rating: 4.8,
    bookings: 142,
    status: 'active',
    provider: 'Subhajit Dey',
    image: 'https://images.unsplash.com/photo-1599158150601-174f0c8f4b9d?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'Electrical Repair',
    category: 'Electrical',
    description: 'Complete electrical repair and maintenance',
    price: 850,
    rating: 4.6,
    bookings: 98,
    status: 'active',
    provider: 'Ravi Kumar',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Plumbing Services',
    category: 'Plumbing',
    description: 'All types of plumbing work',
    price: 750,
    rating: 4.9,
    bookings: 76,
    status: 'inactive',
    provider: 'Priya Sharma',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=100&h=100&fit=crop'
  }
];

export default function ServicesList({ onEdit, onDelete, onView, onCreate }) {
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');

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
      setSelectedServices(new Set(services.map(s => s.id)));
    }
  };

  const toggleServiceStatus = (serviceId) => {
    // Implementation for toggling service status
    console.log('Toggle status for service:', serviceId);
  };

  const filteredServices = services.filter(service => {
    if (filterStatus === 'all') return true;
    return service.status === filterStatus;
  });

  return (
    <div className="services-list">
      <div className="list-header">
        <div className="header-left">
          <h3>All Services ({filteredServices.length})</h3>
          {selectedServices.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedServices.size} selected
              </span>
              <button className="bulk-action-btn">
                <FiTrash2 />
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="bookings">Sort by Bookings</option>
          </select>
          
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
              checked={selectedServices.size === services.length}
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
          {filteredServices.map((service) => (
            <div key={service.id} className="table-row">
              <div className="table-cell checkbox">
                <input
                  type="checkbox"
                  checked={selectedServices.has(service.id)}
                  onChange={() => handleSelectService(service.id)}
                />
              </div>
              
              <div className="table-cell">
                <div className="service-info">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="service-image"
                  />
                  <div className="service-details">
                    <h4 className="service-name">{service.name}</h4>
                    <p className="service-description">{service.description}</p>
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <span className="category-badge">{service.category}</span>
              </div>

              <div className="table-cell">
                <div className="provider-info">
                  <div className="provider-avatar">
                    {service.provider.charAt(0)}
                  </div>
                  <span className="provider-name">{service.provider}</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="price-info">
                  <FiDollarSign />
                  <span className="price">₹{service.price}</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="rating-info">
                  <FiStar className="star-icon" />
                  <span className="rating">{service.rating}</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="bookings-info">
                  <FiUsers />
                  <span className="bookings">{service.bookings}</span>
                </div>
              </div>

              <div className="table-cell">
                <button
                  className={`status-toggle ${service.status}`}
                  onClick={() => toggleServiceStatus(service.id)}
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
          ))}
        </div>
      </div>
    </div>
  );
}
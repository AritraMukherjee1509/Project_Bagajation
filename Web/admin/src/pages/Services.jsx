import React, { useState } from 'react';
import ServicesList from '../components/Services/ServicesList';
import ServiceForm from '../components/Services/ServiceForm';
import ServiceDetails from '../components/Services/ServiceDetails';
import { FiDownload, FiUpload, FiFilter } from 'react-icons/fi';

export default function Services() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  const handleCreateService = () => {
    setSelectedService(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setShowDetails(true);
  };

  const handleDeleteService = (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      // Implementation for deleting service
      console.log('Delete service:', service);
    }
  };

  const handleSaveService = (serviceData) => {
    if (formMode === 'create') {
      // Implementation for creating new service
      console.log('Create service:', serviceData);
    } else {
      // Implementation for updating service
      console.log('Update service:', serviceData);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedService(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedService(null);
  };

  return (
    <div className="services-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Services Management</h1>
          <p className="page-subtitle">Manage all your services and their availability</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-outline">
            <FiDownload />
            Export Services
          </button>
          <button className="btn btn-outline">
            <FiUpload />
            Import Services
          </button>
          <button className="btn btn-outline">
            <FiFilter />
            Advanced Filter
          </button>
        </div>
      </div>

      <div className="services-content">
        <ServicesList
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onView={handleViewService}
          onCreate={handleCreateService}
        />
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={selectedService}
          onClose={handleCloseForm}
          onSave={handleSaveService}
        />
      )}

      {/* Service Details Modal */}
      {showDetails && (
        <ServiceDetails
          service={selectedService}
          onClose={handleCloseDetails}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />
      )}
    </div>
  );
}
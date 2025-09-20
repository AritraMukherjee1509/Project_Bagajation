import React, { useState } from 'react';
import { FiX, FiUpload, FiDollarSign, FiTag } from 'react-icons/fi';

const categories = [
  'AC Services',
  'Electrical',
  'Plumbing',
  'Cleaning',
  'Security',
  'Maintenance',
  'Repair'
];

const providers = [
  { id: 1, name: 'Subhajit Dey' },
  { id: 2, name: 'Ravi Kumar' },
  { id: 3, name: 'Priya Sharma' },
  { id: 4, name: 'Amit Singh' }
];

export default function ServiceForm({ service, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || '',
    price: service?.price || '',
    provider: service?.provider || '',
    duration: service?.duration || '',
    warranty: service?.warranty || '',
    features: service?.features || [],
    status: service?.status || 'active',
    image: service?.image || null
  });

  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.provider) {
      newErrors.provider = 'Provider is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="service-form-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter service name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Describe the service"
                  rows={4}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`form-select ${errors.category ? 'error' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Provider *</label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className={`form-select ${errors.provider ? 'error' : ''}`}
                  >
                    <option value="">Select provider</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.name}>{provider.name}</option>
                    ))}
                  </select>
                  {errors.provider && <span className="error-text">{errors.provider}</span>}
                </div>
              </div>
            </div>

            {/* Pricing & Details */}
            <div className="form-section">
              <h3 className="section-title">Pricing & Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <div className="input-with-icon">
                    <FiDollarSign className="input-icon" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`form-input ${errors.price ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Warranty Period</label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 1 year"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="form-section full-width">
              <h3 className="section-title">Features</h3>
              
              <div className="features-input">
                <div className="add-feature">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="form-input"
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="add-feature-btn"
                  >
                    <FiTag />
                    Add
                  </button>
                </div>
                
                <div className="features-list">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="feature-tag">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="remove-feature-btn"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-section full-width">
              <h3 className="section-title">Service Image</h3>
              
              <div className="image-upload">
                <div className="upload-area">
                  {formData.image ? (
                    <div className="image-preview">
                      <img src={formData.image} alt="Service preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FiUpload />
                      <span>Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="upload-input"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
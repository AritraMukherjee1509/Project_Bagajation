import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiDollarSign, FiTag, FiLoader } from 'react-icons/fi';

export default function ServiceForm({ service, mode = 'create', onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricing: {
      basePrice: '',
      currency: 'INR'
    },
    provider: '',
    duration: '',
    warranty: '',
    features: [],
    status: 'active',
    images: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);

  const categories = [
    'AC Services',
    'Electrical',
    'Plumbing',
    'Cleaning',
    'Security',
    'Maintenance',
    'Repair'
  ];

  // Initialize form data when service prop changes
  useEffect(() => {
    if (service && mode === 'edit') {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        category: service.category || '',
        pricing: {
          basePrice: service.pricing?.basePrice || '',
          currency: service.pricing?.currency || 'INR'
        },
        provider: service.provider?._id || service.provider || '',
        duration: service.duration || '',
        warranty: service.warranty || '',
        features: service.features || [],
        status: service.status || 'active',
        images: service.images || []
      });
    }
  }, [service, mode]);

  // Load providers when component mounts
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      // You'll need to implement this API call
      // const response = await providersAPI.getProviders({ status: 'active' });
      // if (response.success) {
      //   setProviders(response.data);
      // }
      
      // For now, using mock data
      setProviders([
        { _id: '1', name: 'Subhajit Dey' },
        { _id: '2', name: 'Ravi Kumar' },
        { _id: '3', name: 'Priya Sharma' },
        { _id: '4', name: 'Amit Singh' }
      ]);
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.pricing.basePrice || formData.pricing.basePrice <= 0) {
      newErrors['pricing.basePrice'] = 'Valid price is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save failed:', error);
      // Handle error (maybe set form errors)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="service-form-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'edit' ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
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
                  disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    <option value="">Select provider</option>
                    {providers.map(provider => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
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
                  <label className="form-label">Base Price (₹) *</label>
                  <div className="input-with-icon">
                    <FiDollarSign className="input-icon" />
                    <input
                      type="number"
                      name="pricing.basePrice"
                      value={formData.pricing.basePrice}
                      onChange={handleChange}
                      className={`form-input ${errors['pricing.basePrice'] ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                  {errors['pricing.basePrice'] && <span className="error-text">{errors['pricing.basePrice']}</span>}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                    disabled={loading}
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
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="add-feature-btn"
                    disabled={loading}
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
                        disabled={loading}
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
              <h3 className="section-title">Service Images</h3>
              
              <div className="image-upload">
                <div className="upload-area">
                  <label className="upload-label">
                    <FiUpload />
                    <span>Click to upload images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="upload-input"
                      disabled={loading}
                    />
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="images-preview">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Service ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                          disabled={loading}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="spinning" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                mode === 'edit' ? 'Update Service' : 'Create Service'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
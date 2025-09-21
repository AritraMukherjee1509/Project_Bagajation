import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiMail, FiPhone, FiMapPin, FiUser, FiLoader } from 'react-icons/fi';

export default function UserForm({ user, mode = 'create', onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    status: 'active',
    avatar: null,
    role: 'user'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        },
        status: user.status || 'active',
        avatar: user.avatar || user.profileImage || null,
        role: user.role || 'user'
      });
    }
  }, [user, mode]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Please select a valid image file'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    // Address validation
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Create a clean data object for API
      const submitData = {
        ...formData,
        // Only include avatar if it's been changed (not for edit mode with existing avatar)
        ...(formData.avatar && formData.avatar.startsWith('data:') && { avatar: formData.avatar })
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Save failed:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to save user'
      }));
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry'
  ];

  return (
    <div className="modal-overlay">
      <div className="user-form-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'edit' ? 'Edit User' : 'Add New User'}
          </h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-content">
            {/* Avatar Upload */}
            <div className="avatar-section">
              <div className="avatar-upload">
                {formData.avatar ? (
                  <div className="avatar-preview">
                    <img src={formData.avatar} alt="User avatar" />
                    <button
                      type="button"
                      className="remove-avatar-btn"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: null }))}
                      disabled={loading}
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <label className="avatar-upload-label">
                    <FiUpload />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="avatar-input"
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
              {errors.avatar && <span className="error-text">{errors.avatar}</span>}
            </div>

            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FiUser />
                Basic Information
              </h3>
              
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter full name"
                  disabled={loading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter email address"
                      disabled={loading || (mode === 'edit')} // Disable email editing in edit mode
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div className="input-with-icon">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="Enter phone number"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                    disabled={loading}
                  >
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                  </select>
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
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FiMapPin />
                Address Information
              </h3>
              
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter street address"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className={`form-input ${errors['address.city'] ? 'error' : ''}`}
                    placeholder="Enter city"
                    disabled={loading}
                  />
                  {errors['address.city'] && <span className="error-text">{errors['address.city']}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className={`form-select ${errors['address.state'] ? 'error' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors['address.state'] && <span className="error-text">{errors['address.state']}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter ZIP code"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="form-error">
              {errors.submit}
            </div>
          )}

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
                mode === 'edit' ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// API Configuration and HTTP client
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('admin_token');
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('admin_token', token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  // Default headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          this.removeAuthToken();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        
        throw new Error(data.error || data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload method
  async uploadFile(endpoint, formData) {
    const token = this.getAuthToken();
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.removeAuthToken();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }
}

// Create API client instance
const apiClient = new ApiClient();

// API Endpoints
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/admin/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/updatedetails', data),
  changePassword: (data) => apiClient.put('/auth/updatepassword', data),
};

export const dashboardAPI = {
  getStats: () => apiClient.get('/admin/dashboard'),
  getAnalytics: (params) => apiClient.get('/analytics/dashboard', params),
};

export const usersAPI = {
  getUsers: (params) => apiClient.get('/users', params),
  getUser: (id) => apiClient.get(`/users/${id}`),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getUserDashboard: (id) => apiClient.get(`/users/${id}/dashboard`),
  updatePreferences: (id, data) => apiClient.put(`/users/${id}/preferences`, data),
  getFavorites: (id) => apiClient.get(`/users/${id}/favorites`),
  addToFavorites: (id, serviceId) => apiClient.post(`/users/${id}/favorites/${serviceId}`),
  removeFromFavorites: (id, serviceId) => apiClient.delete(`/users/${id}/favorites/${serviceId}`),
};

export const servicesAPI = {
  getServices: (params) => apiClient.get('/services', params),
  getService: (id) => apiClient.get(`/services/${id}`),
  createService: (data) => apiClient.post('/services', data),
  updateService: (id, data) => apiClient.put(`/services/${id}`, data),
  deleteService: (id) => apiClient.delete(`/services/${id}`),
  getServiceAnalytics: (id) => apiClient.get(`/services/${id}/analytics`),
  getFeaturedServices: () => apiClient.get('/services/featured'),
  getPopularServices: () => apiClient.get('/services/popular'),
  searchServices: (params) => apiClient.get('/services/search', params),
  getServicesByCategory: (category) => apiClient.get(`/services/category/${category}`),
};

export const bookingsAPI = {
  getBookings: (params) => apiClient.get('/bookings', params),
  getBooking: (id) => apiClient.get(`/bookings/${id}`),
  createBooking: (data) => apiClient.post('/bookings', data),
  updateBooking: (id, data) => apiClient.put(`/bookings/${id}`, data),
  updateBookingStatus: (id, data) => apiClient.put(`/bookings/${id}/status`, data),
  cancelBooking: (id, data) => apiClient.put(`/bookings/${id}/cancel`, data),
  getBookingAnalytics: (params) => apiClient.get('/bookings/analytics', params),
  addMessage: (id, data) => apiClient.post(`/bookings/${id}/messages`, data),
};

export const providersAPI = {
  getProviders: (params) => apiClient.get('/providers', params),
  getProvider: (id) => apiClient.get(`/providers/${id}`),
  createProvider: (data) => apiClient.post('/providers/register', data),
  updateProvider: (id, data) => apiClient.put(`/providers/${id}`, data),
  deleteProvider: (id) => apiClient.delete(`/providers/${id}`),
  verifyProvider: (id, data) => apiClient.put(`/providers/${id}/verify`, data),
  getProviderDashboard: (id) => apiClient.get(`/providers/${id}/dashboard`),
  updateAvailability: (id, data) => apiClient.put(`/providers/${id}/availability`, data),
  getTopProviders: () => apiClient.get('/providers/top'),
};

export const reviewsAPI = {
  getReviews: (params) => apiClient.get('/reviews', params),
  getReview: (id) => apiClient.get(`/reviews/${id}`),
  createReview: (data) => apiClient.post('/reviews', data),
  updateReview: (id, data) => apiClient.put(`/reviews/${id}`, data),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
  markHelpful: (id) => apiClient.put(`/reviews/${id}/helpful`),
  moderateReview: (id, data) => apiClient.put(`/reviews/${id}/moderate`, data),
  addResponse: (id, data) => apiClient.post(`/reviews/${id}/response`, data),
  reportReview: (id, data) => apiClient.post(`/reviews/${id}/report`, data),
  getReviewStats: () => apiClient.get('/reviews/stats'),
};

export const analyticsAPI = {
  getDashboard: (params) => apiClient.get('/analytics/dashboard', params),
  getRevenue: (params) => apiClient.get('/analytics/revenue', params),
  getBookings: (params) => apiClient.get('/analytics/bookings', params),
  getUsers: (params) => apiClient.get('/analytics/users', params),
  getServices: (params) => apiClient.get('/analytics/services', params),
};

export const adminAPI = {
  getAdmins: () => apiClient.get('/admin/admins'),
  createAdmin: (data) => apiClient.post('/admin/admins', data),
  updateAdmin: (id, data) => apiClient.put(`/admin/admins/${id}`, data),
  deleteAdmin: (id) => apiClient.delete(`/admin/admins/${id}`),
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.put('/admin/settings', data),
  getActivity: (params) => apiClient.get('/admin/activity', params),
  bulkOperation: (action, data) => apiClient.post(`/admin/bulk/${action}`, data),
  sendNotification: (data) => apiClient.post('/admin/notifications', data),
};

// File upload APIs
export const uploadAPI = {
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.uploadFile('/auth/updatedetails', formData);
  },
  uploadServiceImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('serviceImages', file));
    return apiClient.uploadFile('/services', formData);
  },
  uploadReviewImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('reviewImages', file));
    return apiClient.uploadFile('/reviews', formData);
  },
  uploadDocuments: (files) => {
    const formData = new FormData();
    Object.keys(files).forEach(key => {
      if (files[key]) formData.append(key, files[key]);
    });
    return apiClient.uploadFile('/providers', formData);
  },
};

export default apiClient;
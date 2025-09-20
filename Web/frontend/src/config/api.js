// src/config/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const tokenManager = {
  getToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
  
  setToken: (token, remember = false) => {
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    return !!tokenManager.getToken();
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  // Authentication
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
};

export const servicesAPI = {
  // Get all services with filters
  getServices: (params = {}) => api.get('/services', { params }),
  
  // Get single service
  getService: (id) => api.get(`/services/${id}`),
  
  // Search services
  searchServices: (params) => api.get('/services/search', { params }),
  
  // Get services by category
  getServicesByCategory: (category, params = {}) => 
    api.get(`/services/category/${category}`, { params }),
  
  // Get featured services
  getFeaturedServices: () => api.get('/services/featured'),
  
  // Get popular services
  getPopularServices: () => api.get('/services/popular'),
  
  // Create service (provider only)
  createService: (serviceData) => api.post('/services', serviceData),
  
  // Update service (provider only)
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  
  // Delete service (provider only)
  deleteService: (id) => api.delete(`/services/${id}`),
  
  // Get service analytics (provider only)
  getServiceAnalytics: (id) => api.get(`/services/${id}/analytics`),
};

export const bookingsAPI = {
  // Get all bookings (filtered by user role)
  getBookings: (params = {}) => api.get('/bookings', { params }),
  
  // Get single booking
  getBooking: (id) => api.get(`/bookings/${id}`),
  
  // Create new booking
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  
  // Update booking
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  
  // Update booking status (provider/admin)
  updateBookingStatus: (id, statusData) => api.put(`/bookings/${id}/status`, statusData),
  
  // Cancel booking
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  
  // Get booking analytics
  getBookingAnalytics: (params = {}) => api.get('/bookings/analytics', { params }),
  
  // Add message to booking
  addBookingMessage: (id, messageData) => api.post(`/bookings/${id}/messages`, messageData),
};

export const providersAPI = {
  // Get all providers
  getProviders: (params = {}) => api.get('/providers', { params }),
  
  // Get single provider
  getProvider: (id) => api.get(`/providers/${id}`),
  
  // Register as provider
  registerProvider: (providerData) => api.post('/providers/register', providerData),
  
  // Update provider profile
  updateProvider: (id, providerData) => api.put(`/providers/${id}`, providerData),
  
  // Get provider dashboard
  getProviderDashboard: (id) => api.get(`/providers/${id}/dashboard`),
  
  // Update provider availability
  updateProviderAvailability: (id, availabilityData) => 
    api.put(`/providers/${id}/availability`, availabilityData),
  
  // Get top providers
  getTopProviders: (params = {}) => api.get('/providers/top', { params }),
};

export const reviewsAPI = {
  // Get all reviews
  getReviews: (params = {}) => api.get('/reviews', { params }),
  
  // Get single review
  getReview: (id) => api.get(`/reviews/${id}`),
  
  // Create review
  createReview: (reviewData) => api.post('/reviews', reviewData),
  
  // Update review
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  
  // Delete review
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  
  // Mark review as helpful
  markReviewHelpful: (id) => api.put(`/reviews/${id}/helpful`),
  
  // Add response to review (provider)
  addReviewResponse: (id, responseData) => api.post(`/reviews/${id}/response`, responseData),
  
  // Report review
  reportReview: (id, reportData) => api.post(`/reviews/${id}/report`, reportData),
};

export const usersAPI = {
  // Get user profile
  getUser: (id) => api.get(`/users/${id}`),
  
  // Update user profile
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Get user dashboard
  getUserDashboard: (id) => api.get(`/users/${id}/dashboard`),
  
  // Update user preferences
  updateUserPreferences: (id, preferences) => api.put(`/users/${id}/preferences`, preferences),
  
  // Get user favorites
  getUserFavorites: (id) => api.get(`/users/${id}/favorites`),
  
  // Add to favorites
  addToFavorites: (id, serviceId) => api.post(`/users/${id}/favorites/${serviceId}`),
  
  // Remove from favorites
  removeFromFavorites: (id, serviceId) => api.delete(`/users/${id}/favorites/${serviceId}`),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      console.error('API Error:', message);
      return { success: false, message, status: error.response.status };
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      return { success: false, message: 'Network error. Please check your connection.' };
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },
  
  // Format success response
  formatResponse: (response) => {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      pagination: response.data.pagination,
      total: response.data.total,
      count: response.data.count
    };
  },
  
  // Upload file with progress
  uploadFile: (endpoint, formData, onProgress) => {
    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
};

// Export token manager for use in components
export { tokenManager };

// Default export
export default api;
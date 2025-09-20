import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthNavigationHandler component that can use Router hooks
const AuthNavigationHandler = ({ onAuthExpired }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthExpired = () => {
      onAuthExpired();
      if (!location.pathname.includes('/login')) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [navigate, location.pathname, onAuthExpired]);

  return null; // This component doesn't render anything
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleAuthExpired = () => {
    setUser(null);
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');
      
      if (token && userData) {
        // Try to parse stored user data first
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Verify token with backend in the background
          authAPI.getProfile().then(response => {
            if (response.success) {
              // Update user data if backend returned newer data
              if (JSON.stringify(response.data) !== userData) {
                setUser(response.data);
                localStorage.setItem('admin_user', JSON.stringify(response.data));
              }
            }
          }).catch(() => {
            // Token invalid, but don't immediately logout
            // Let the individual API calls handle the 401
          });
          
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't clear storage here - let API calls handle 401s
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data));
        setUser(response.data);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
      // The navigation will be handled by AuthNavigationHandler
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('admin_user', JSON.stringify(response.data));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    changePassword,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      <AuthNavigationHandler onAuthExpired={handleAuthExpired} />
      {children}
    </AuthContext.Provider>
  );
};
// pages/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/Auth/AuthProvider';
import BookingsList from '../components/Bookings/BookingsList';
import BookingFilters from '../components/Bookings/BookingFilters';
import { FiDownload, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { bookingsAPI } from '../utils/api';

export default function Bookings() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    service: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    // Only load bookings if authenticated and not in auth loading state
    if (isAuthenticated && !authLoading) {
      loadBookings();
    }
  }, [filters, isAuthenticated, authLoading]);

  const loadBookings = async () => {
    // Double check authentication before making request
    if (!isAuthenticated || authLoading) {
      console.log('Skipping loadBookings - not authenticated or auth loading');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = {
        ...filters,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.service !== 'all' && { service: filters.service }),
        ...(filters.search && { search: filters.search })
      };

      console.log('Loading bookings with params:', params);
      const response = await bookingsAPI.getBookings(params);
      
      if (response.success) {
        setBookings(response.data);
        setPagination({
          total: response.total,
          page: response.page || 1,
          pages: response.pages || 1,
          hasNext: response.pagination?.next,
          hasPrev: response.pagination?.prev
        });
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      
      // Don't show error if it's just an auth issue
      if (!error.message.includes('Session expired')) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // This shouldn't happen with ProtectedRoute, but just in case
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the bookings page.</p>
        </div>
      </div>
    );
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleExport = async () => {
    try {
      const response = await bookingsAPI.getBookings({ 
        ...filters, 
        limit: 1000,
        export: true 
      });
      
      if (response.success) {
        const csvContent = convertToCSV(response.data);
        downloadCSV(csvContent, `bookings-${Date.now()}.csv`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      if (!error.message.includes('Session expired')) {
        setError('Export failed: ' + error.message);
      }
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Booking ID', 'Customer', 'Service', 'Provider', 'Date', 'Status', 'Amount'];
    const rows = data.map(booking => [
      booking.bookingId || 'N/A',
      booking.user?.name || 'N/A',
      booking.service?.name || 'N/A',
      booking.provider?.name || 'N/A',
      booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A',
      booking.status || 'N/A',
      `₹${booking.pricing?.totalAmount || 0}`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Bookings Management</h1>
          <p className="page-subtitle">Manage all service bookings and appointments</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-outline" 
            onClick={loadBookings} 
            disabled={loading || authLoading}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button 
            className="btn btn-outline" 
            onClick={handleExport}
            disabled={loading || authLoading}
          >
            <FiDownload />
            Export
          </button>
          <button className="btn btn-primary">
            <FiPlus />
            New Booking
          </button>
        </div>
      </div>

      <div className="bookings-content">
        <BookingFilters 
          filters={filters} 
          setFilters={handleFilterChange}
          loading={loading}
        />
        <BookingsList 
          bookings={bookings}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={loadBookings}
        />
      </div>
    </div>
  );
}
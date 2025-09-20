import React, { useState, useEffect } from 'react';
import BookingsList from '../components/Bookings/BookingsList';
import BookingFilters from '../components/Bookings/BookingFilters';
import { FiDownload, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { bookingsAPI } from '../utils/api';

export default function Bookings() {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    service: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadBookings();
  }, [filters]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a valid token before making the API call
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const params = {
        ...filters,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.service !== 'all' && { service: filters.service }),
        ...(filters.search && { search: filters.search })
      };

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
      setError(error.message);
      
      // Don't automatically redirect on API errors - let the user decide
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please refresh the page and login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleExport = async () => {
    try {
      const response = await bookingsAPI.getBookings({ 
        ...filters, 
        limit: 1000, // Get more records for export
        export: true 
      });
      
      if (response.success) {
        const csvContent = convertToCSV(response.data);
        downloadCSV(csvContent, `bookings-${Date.now()}.csv`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setError('Export failed: ' + error.message);
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Booking ID', 'Customer', 'Service', 'Provider', 'Date', 'Status', 'Amount'];
    const rows = data.map(booking => [
      booking.bookingId,
      booking.user?.name || 'N/A',
      booking.service?.name || 'N/A',
      booking.provider?.name || 'N/A',
      new Date(booking.createdAt).toLocaleDateString(),
      booking.status,
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
          <button className="btn btn-outline" onClick={loadBookings}>
            <FiRefreshCw />
            Refresh
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
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
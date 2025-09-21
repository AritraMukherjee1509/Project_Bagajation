import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import RecentBookings from '../components/Dashboard/RecentBookings';
import RevenueChart from '../components/Dashboard/RevenueChart';
import ServiceChart from '../components/Dashboard/ServiceChart';
import { dashboardAPI, analyticsAPI } from '../utils/api';
import { FiRefreshCw, FiDownload, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Load all dashboard data in parallel
      const [
        dashboardResponse,
        analyticsResponse,
        revenueResponse,
        serviceResponse
      ] = await Promise.allSettled([
        dashboardAPI.getStats(),
        analyticsAPI.getDashboard(),
        dashboardAPI.getRevenueChart('7d'),
        dashboardAPI.getServiceChart()
      ]);

      // Handle dashboard stats
      if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value.success) {
        setDashboardData(dashboardResponse.value.data);
      } else {
        console.error('Dashboard stats failed:', dashboardResponse.reason);
      }

      // Handle analytics data
      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.success) {
        setAnalyticsData(analyticsResponse.value.data);
      } else {
        console.error('Analytics failed:', analyticsResponse.reason);
      }

      // Handle revenue data
      if (revenueResponse.status === 'fulfilled' && revenueResponse.value.success) {
        setRevenueData(revenueResponse.value.data);
      } else {
        console.error('Revenue data failed:', revenueResponse.reason);
        // Set default revenue data structure
        setRevenueData({
          '7d': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 0, 0, 0, 0, 0, 0]
          },
          '30d': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [0, 0, 0, 0]
          },
          '90d': {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            data: [0, 0, 0]
          }
        });
      }

      // Handle service chart data
      if (serviceResponse.status === 'fulfilled' && serviceResponse.value.success) {
        setServiceData(serviceResponse.value.data);
      } else {
        console.error('Service chart failed:', serviceResponse.reason);
        // Set default service data
        setServiceData([
          { name: 'AC Services', value: 0, color: '#3b82f6', count: 0 },
          { name: 'Electrical', value: 0, color: '#f59e0b', count: 0 },
          { name: 'Plumbing', value: 0, color: '#10b981', count: 0 },
          { name: 'Cleaning', value: 0, color: '#ef4444', count: 0 },
          { name: 'Other', value: 0, color: '#8b5cf6', count: 0 }
        ]);
      }

    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const handleRefreshRevenue = async () => {
    try {
      const response = await dashboardAPI.getRevenueChart('7d');
      if (response.success) {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh revenue data:', error);
    }
  };

  const handleRefreshServices = async () => {
    try {
      const response = await dashboardAPI.getServiceChart();
      if (response.success) {
        setServiceData(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh service data:', error);
    }
  };

  const handleRefreshBookings = async () => {
    try {
      const response = await dashboardAPI.getRecentBookings(10);
      if (response.success) {
        setDashboardData(prev => ({
          ...prev,
          recentBookings: response.data
        }));
      }
    } catch (error) {
      console.error('Failed to refresh bookings:', error);
    }
  };

  const handleViewAllBookings = (booking) => {
    if (booking) {
      navigate('/bookings', { state: { selectedBooking: booking } });
    } else {
      navigate('/bookings');
    }
  };

  const handleExportDashboard = async () => {
    try {
      const response = await reportsAPI.generateReport('dashboard', {
        includeCharts: true,
        period: '30d'
      });
      
      if (response.success) {
        // Handle file download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-report-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export dashboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <FiRefreshCw className="spinning" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <p>Error loading dashboard: {error}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            <FiRefreshCw />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-outline" 
            onClick={handleExportDashboard}
            disabled={refreshing}
          >
            <FiDownload />
            Export Report
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/settings')}
          >
            <FiSettings />
            Settings
          </button>
          <button 
            className="btn btn-outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <StatsCards 
          data={dashboardData?.stats} 
          loading={loading}
        />
        
        <div className="dashboard-row">
          <div className="dashboard-col-2">
            <RevenueChart 
              data={revenueData} 
              loading={loading}
              onRefresh={handleRefreshRevenue}
            />
          </div>
          <div className="dashboard-col-1">
            <ServiceChart 
              data={serviceData} 
              loading={loading}
              onRefresh={handleRefreshServices}
            />
          </div>
        </div>

        <RecentBookings 
          data={dashboardData?.recentBookings} 
          loading={loading}
          onRefresh={handleRefreshBookings}
          onViewAll={handleViewAllBookings}
        />
      </div>
    </div>
  );
}
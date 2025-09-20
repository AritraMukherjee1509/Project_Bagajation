import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import RecentBookings from '../components/Dashboard/RecentBookings';
import RevenueChart from '../components/Dashboard/RevenueChart';
import ServiceChart from '../components/Dashboard/ServiceChart';
import { dashboardAPI, analyticsAPI } from '../utils/api';
import { FiRefreshCw } from 'react-icons/fi';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardResponse, analyticsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        analyticsAPI.getDashboard()
      ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      }

      if (analyticsResponse.success) {
        setAnalyticsData(analyticsResponse.data);
      }
    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
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
          <p className="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <button className="btn btn-outline" onClick={handleRefresh}>
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      <div className="dashboard-content">
        <StatsCards data={dashboardData?.stats} />
        
        <div className="dashboard-row">
          <div className="dashboard-col-2">
            <RevenueChart data={analyticsData?.revenue} />
          </div>
          <div className="dashboard-col-1">
            <ServiceChart data={analyticsData?.serviceCategoryStats} />
          </div>
        </div>

        <RecentBookings data={dashboardData?.recentActivity?.recentBookings} />
      </div>
    </div>
  );
}
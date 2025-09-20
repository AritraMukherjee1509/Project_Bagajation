import React from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import RecentBookings from '../components/Dashboard/RecentBookings';
import RevenueChart from '../components/Dashboard/RevenueChart';
import ServiceChart from '../components/Dashboard/ServiceChart';

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="dashboard-content">
        <StatsCards />
        
        <div className="dashboard-row">
          <div className="dashboard-col-2">
            <RevenueChart />
          </div>
          <div className="dashboard-col-1">
            <ServiceChart />
          </div>
        </div>

        <RecentBookings />
      </div>
    </div>
  );
}
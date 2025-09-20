import React, { useState } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiBarChart,
  FiPieChart
} from 'react-icons/fi';

const analyticsData = {
  overview: {
    totalRevenue: 2456700,
    revenueGrowth: 12.5,
    totalBookings: 1234,
    bookingsGrowth: 8.3,
    totalUsers: 5678,
    usersGrowth: 15.2,
    avgOrderValue: 1890,
    avgOrderGrowth: -2.1
  },
  revenueChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [185000, 220000, 195000, 280000, 315000, 245000]
  },
  bookingsChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [142, 168, 156, 201, 234, 189]
  },
  serviceBreakdown: [
    { name: 'AC Services', value: 35, count: 432, revenue: 453600 },
    { name: 'Electrical', value: 25, count: 309, revenue: 324500 },
    { name: 'Plumbing', value: 20, count: 247, revenue: 259300 },
    { name: 'Cleaning', value: 15, count: 185, revenue: 194250 },
    { name: 'Other', value: 5, count: 61, revenue: 64050 }
  ],
  topPerformers: [
    { name: 'Subhajit Dey', bookings: 89, revenue: 93450, rating: 4.9 },
    { name: 'Ravi Kumar', bookings: 76, revenue: 79800, rating: 4.8 },
    { name: 'Priya Sharma', bookings: 65, revenue: 68250, rating: 4.7 },
    { name: 'Amit Singh', bookings: 58, revenue: 60900, rating: 4.6 }
  ]
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6m');
  const [chartType, setChartType] = useState('revenue');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Track your business performance and insights</p>
        </div>
        
        <div className="header-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn btn-outline">
            <FiRefreshCw />
            Refresh
          </button>
          <button className="btn btn-primary">
            <FiDownload />
            Export Report
          </button>
        </div>
      </div>

      <div className="analytics-content">
        {/* Overview Stats */}
        <div className="overview-stats">
          <div className="stat-card revenue">
            <div className="stat-header">
              <div className="stat-icon">
                <FiDollarSign />
              </div>
              <div className={`stat-trend ${analyticsData.overview.revenueGrowth > 0 ? 'positive' : 'negative'}`}>
                {analyticsData.overview.revenueGrowth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {formatPercentage(analyticsData.overview.revenueGrowth)}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
              <p className="stat-title">Total Revenue</p>
              <span className="stat-subtitle">vs previous period</span>
            </div>
          </div>

          <div className="stat-card bookings">
            <div className="stat-header">
              <div className="stat-icon">
                <FiCalendar />
              </div>
              <div className={`stat-trend ${analyticsData.overview.bookingsGrowth > 0 ? 'positive' : 'negative'}`}>
                {analyticsData.overview.bookingsGrowth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {formatPercentage(analyticsData.overview.bookingsGrowth)}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{analyticsData.overview.totalBookings.toLocaleString()}</h3>
              <p className="stat-title">Total Bookings</p>
              <span className="stat-subtitle">vs previous period</span>
            </div>
          </div>

          <div className="stat-card users">
            <div className="stat-header">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className={`stat-trend ${analyticsData.overview.usersGrowth > 0 ? 'positive' : 'negative'}`}>
                {analyticsData.overview.usersGrowth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {formatPercentage(analyticsData.overview.usersGrowth)}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{analyticsData.overview.totalUsers.toLocaleString()}</h3>
              <p className="stat-title">Total Users</p>
              <span className="stat-subtitle">vs previous period</span>
            </div>
          </div>

          <div className="stat-card avg-order">
            <div className="stat-header">
              <div className="stat-icon">
                <FiBarChart />
              </div>
              <div className={`stat-trend ${analyticsData.overview.avgOrderGrowth > 0 ? 'positive' : 'negative'}`}>
                {analyticsData.overview.avgOrderGrowth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {formatPercentage(analyticsData.overview.avgOrderGrowth)}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{formatCurrency(analyticsData.overview.avgOrderValue)}</h3>
              <p className="stat-title">Avg Order Value</p>
              <span className="stat-subtitle">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container main-chart">
            <div className="chart-header">
              <div className="chart-title-section">
                <h3 className="chart-title">Performance Trends</h3>
                <div className="chart-controls">
                  <button 
                    className={`chart-type-btn ${chartType === 'revenue' ? 'active' : ''}`}
                    onClick={() => setChartType('revenue')}
                  >
                    Revenue
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === 'bookings' ? 'active' : ''}`}
                    onClick={() => setChartType('bookings')}
                  >
                    Bookings
                  </button>
                </div>
              </div>
            </div>
            
            <div className="chart-content">
              <div className="chart-bars">
                {(chartType === 'revenue' ? analyticsData.revenueChart : analyticsData.bookingsChart).data.map((value, index) => {
                  const maxValue = Math.max(...(chartType === 'revenue' ? analyticsData.revenueChart : analyticsData.bookingsChart).data);
                  const percentage = (value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="chart-bar-wrapper">
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar"
                          style={{ height: `${percentage}%` }}
                        >
                          <div className="bar-tooltip">
                            {chartType === 'revenue' ? formatCurrency(value) : value.toLocaleString()}
                          </div>
                        </div>
                        <span className="chart-value">
                          {chartType === 'revenue' ? `₹${(value / 1000).toFixed(0)}k` : value}
                        </span>
                      </div>
                      <span className="chart-label">
                        {(chartType === 'revenue' ? analyticsData.revenueChart : analyticsData.bookingsChart).labels[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="chart-container service-breakdown">
            <div className="chart-header">
              <h3 className="chart-title">Service Breakdown</h3>
              <div className="chart-legend">
                <FiPieChart />
                <span>by Revenue</span>
              </div>
            </div>
            
            <div className="breakdown-list">
              {analyticsData.serviceBreakdown.map((service, index) => (
                <div key={index} className="breakdown-item">
                  <div className="breakdown-info">
                    <div className="breakdown-color" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                    <div className="breakdown-details">
                      <span className="breakdown-name">{service.name}</span>
                      <span className="breakdown-stats">{service.count} bookings</span>
                    </div>
                  </div>
                  <div className="breakdown-values">
                    <span className="breakdown-percentage">{service.value}%</span>
                    <span className="breakdown-revenue">{formatCurrency(service.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="top-performers-section">
          <div className="section-header">
            <h3 className="section-title">Top Performing Providers</h3>
            <a href="/providers" className="view-all-link">View All</a>
          </div>
          
          <div className="performers-grid">
            {analyticsData.topPerformers.map((performer, index) => (
              <div key={index} className="performer-card">
                <div className="performer-rank">#{index + 1}</div>
                <div className="performer-info">
                  <div className="performer-avatar">
                    {performer.name.charAt(0)}
                  </div>
                  <div className="performer-details">
                    <h4 className="performer-name">{performer.name}</h4>
                    <div className="performer-stats">
                      <span className="stat-item">
                        <FiCalendar size={12} />
                        {performer.bookings} bookings
                      </span>
                      <span className="stat-item">
                        <FiDollarSign size={12} />
                        {formatCurrency(performer.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="performer-rating">
                  <FiTrendingUp className="rating-icon" />
                  <span className="rating-value">{performer.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
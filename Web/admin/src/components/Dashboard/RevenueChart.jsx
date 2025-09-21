import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCalendar, FiRefreshCw } from 'react-icons/fi';

export default function RevenueChart({ data, loading, onRefresh }) {
  const [timeRange, setTimeRange] = useState('7d');
  
  const defaultChartData = {
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
  };

  const chartData = data || defaultChartData;
  const currentData = chartData[timeRange] || defaultChartData[timeRange];
  const maxValue = Math.max(...currentData.data, 1); // Prevent division by zero
  const totalRevenue = currentData.data.reduce((sum, value) => sum + value, 0);
  
  // Calculate growth percentage
  const calculateGrowth = () => {
    if (!currentData.data || currentData.data.length < 2) return 0;
    const current = currentData.data[currentData.data.length - 1];
    const previous = currentData.data[currentData.data.length - 2];
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const growth = calculateGrowth();

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">Revenue Overview</h3>
          <div className="chart-stats">
            {loading ? (
              <div className="stats-skeleton">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            ) : (
              <>
                <span className="total-revenue">₹{totalRevenue.toLocaleString()}</span>
                <span className={`revenue-growth ${growth >= 0 ? 'positive' : 'negative'}`}>
                  <FiTrendingUp />
                  {growth >= 0 ? '+' : ''}{growth}%
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="chart-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
            disabled={loading}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
              <FiRefreshCw className={loading ? 'spinning' : ''} />
            </button>
          )}
        </div>
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="chart-skeleton">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="skeleton-bar"></div>
            ))}
          </div>
        ) : (
          <div className="chart-bars">
            {currentData.data.map((value, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className="bar-tooltip">
                    ₹{value.toLocaleString()}
                  </div>
                </div>
                <span className="chart-label">{currentData.labels[index]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color primary"></div>
            <span>Revenue</span>
          </div>
        </div>
        {!loading && (
          <div className="chart-summary">
            <span>Period: {timeRange === '7d' ? 'Weekly' : timeRange === '30d' ? 'Monthly' : 'Quarterly'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
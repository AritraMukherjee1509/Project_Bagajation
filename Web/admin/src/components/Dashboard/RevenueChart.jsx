import React, { useState } from 'react';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';

const chartData = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000]
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [85000, 92000, 78000, 105000]
  },
  '90d': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    data: [285000, 320000, 295000]
  }
};

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const currentData = chartData[timeRange];
  const maxValue = Math.max(...currentData.data);
  const totalRevenue = currentData.data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">Revenue Overview</h3>
          <div className="chart-stats">
            <span className="total-revenue">₹{totalRevenue.toLocaleString()}</span>
            <span className="revenue-growth">
              <FiTrendingUp />
              +12.5%
            </span>
          </div>
        </div>
        
        <div className="chart-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
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
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color primary"></div>
            <span>Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
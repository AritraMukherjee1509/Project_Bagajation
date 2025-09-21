import React from 'react';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

export default function ServiceChart({ data, loading, onRefresh }) {
  const defaultServiceData = [
    { name: 'AC Services', value: 0, color: '#3b82f6', count: 0 },
    { name: 'Electrical', value: 0, color: '#f59e0b', count: 0 },
    { name: 'Plumbing', value: 0, color: '#10b981', count: 0 },
    { name: 'Cleaning', value: 0, color: '#ef4444', count: 0 },
    { name: 'Other', value: 0, color: '#8b5cf6', count: 0 }
  ];

  const serviceData = data || defaultServiceData;
  const totalServices = serviceData.reduce((sum, item) => sum + (item.count || 0), 0);
  const topService = serviceData.reduce((max, item) => 
    (item.value || 0) > (max.value || 0) ? item : max, serviceData[0] || {});

  if (loading) {
    return (
      <div className="service-chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Popular Services</h3>
          <div className="chart-subtitle">
            <FiRefreshCw className="spinning" />
            Loading...
          </div>
        </div>
        <div className="chart-skeleton">
          <div className="donut-skeleton"></div>
          <div className="legend-skeleton">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="legend-item-skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Popular Services</h3>
        <div className="chart-subtitle">
          <FiTrendingUp />
          {totalServices} total bookings
        </div>
        {onRefresh && (
          <button className="refresh-btn" onClick={onRefresh}>
            <FiRefreshCw />
          </button>
        )}
      </div>

      <div className="donut-chart-container">
        {totalServices === 0 ? (
          <div className="empty-chart">
            <p>No service data available</p>
          </div>
        ) : (
          <>
            <div className="donut-chart">
              <svg viewBox="0 0 100 100" className="donut-svg">
                {serviceData.map((item, index) => {
                  const startAngle = serviceData.slice(0, index).reduce((sum, s) => sum + (s.value / 100) * 360, 0);
                  const angle = ((item.value || 0) / 100) * 360;
                  const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 50 + 35 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                  const y2 = 50 + 35 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                  const largeArc = angle > 180 ? 1 : 0;

                  if (angle === 0) return null;

                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={item.color}
                      className="donut-segment"
                      style={{ '--delay': `${index * 0.2}s` }}
                    />
                  );
                })}
                <circle cx="50" cy="50" r="20" fill="var(--surface)" />
              </svg>
              
              <div className="donut-center">
                <div className="center-value">{topService.value || 0}%</div>
                <div className="center-label">Top Service</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="service-legend">
        {serviceData.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-dot" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="legend-content">
              <span className="legend-name">{item.name}</span>
              <div className="legend-stats">
                <span className="legend-percentage">{item.value || 0}%</span>
                <span className="legend-count">({item.count || 0})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
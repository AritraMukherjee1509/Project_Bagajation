import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const serviceData = [
  { name: 'AC Services', value: 35, color: '#3b82f6', count: 142 },
  { name: 'Electrical', value: 25, color: '#f59e0b', count: 98 },
  { name: 'Plumbing', value: 20, color: '#10b981', count: 76 },
  { name: 'Cleaning', value: 15, color: '#ef4444', count: 54 },
  { name: 'Other', value: 5, color: '#8b5cf6', count: 23 }
];

export default function ServiceChart() {
  const totalServices = serviceData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="service-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Popular Services</h3>
        <div className="chart-subtitle">
          <FiTrendingUp />
          {totalServices} total bookings
        </div>
      </div>

      <div className="donut-chart-container">
        <div className="donut-chart">
          <svg viewBox="0 0 100 100" className="donut-svg">
            {serviceData.map((item, index) => {
              const startAngle = serviceData.slice(0, index).reduce((sum, s) => sum + (s.value / 100) * 360, 0);
              const angle = (item.value / 100) * 360;
              const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 35 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
              const y2 = 50 + 35 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
              const largeArc = angle > 180 ? 1 : 0;

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
            <div className="center-value">{serviceData[0].value}%</div>
            <div className="center-label">Top Service</div>
          </div>
        </div>
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
                <span className="legend-percentage">{item.value}%</span>
                <span className="legend-count">({item.count})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
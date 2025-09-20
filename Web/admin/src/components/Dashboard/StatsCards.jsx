import React from 'react';
import { 
  FiCalendar, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

const stats = [
  {
    id: 1,
    title: 'Total Bookings',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: FiCalendar,
    color: 'blue',
    subtitle: 'This month'
  },
  {
    id: 2,
    title: 'Total Revenue',
    value: '₹2,45,670',
    change: '+18%',
    trend: 'up',
    icon: FiDollarSign,
    color: 'green',
    subtitle: 'This month'
  },
  {
    id: 3,
    title: 'Active Users',
    value: '5,678',
    change: '+5%',
    trend: 'up',
    icon: FiUsers,
    color: 'purple',
    subtitle: 'Registered users'
  },
  {
    id: 4,
    title: 'Growth Rate',
    value: '23.5%',
    change: '-2%',
    trend: 'down',
    icon: FiTrendingUp,
    color: 'orange',
    subtitle: 'vs last month'
  }
];

export default function StatsCards() {
  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const TrendIcon = stat.trend === 'up' ? FiArrowUp : FiArrowDown;
        
        return (
          <div key={stat.id} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <IconComponent />
              </div>
              <div className={`stat-change ${stat.trend}`}>
                <TrendIcon />
                {stat.change}
              </div>
            </div>
            
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span className="stat-subtitle">{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
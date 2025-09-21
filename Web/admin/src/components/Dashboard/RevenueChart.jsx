import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import styles from '../../styles/Dashboard/RevenueChart.module.css';

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
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleSection}>
          <h3 className={styles.chartTitle}>Revenue Overview</h3>
          <div className={styles.chartStats}>
            {loading ? (
              <div className={styles.statsSkeletonLine}>
                <div className={styles.skeletonLine}></div>
                <div className={`${styles.skeletonLine} ${styles.short}`}></div>
              </div>
            ) : (
              <>
                <span className={styles.totalRevenue}>₹{totalRevenue.toLocaleString()}</span>
                <span className={`${styles.revenueGrowth} ${growth >= 0 ? styles.positive : styles.negative}`}>
                  <FiTrendingUp />
                  {growth >= 0 ? '+' : ''}{growth}%
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className={styles.chartControls}>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className={styles.timeRangeSelect}
            disabled={loading}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          {onRefresh && (
            <button className={styles.refreshBtn} onClick={onRefresh} disabled={loading}>
              <FiRefreshCw className={loading ? styles.spinning : ''} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.chartSkeleton}>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className={styles.skeletonBar}></div>
            ))}
          </div>
        ) : (
          <div className={styles.chartBars}>
            {currentData.data.map((value, index) => (
              <div key={index} className={styles.chartBarWrapper}>
                <div 
                  className={styles.chartBar}
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className={styles.barTooltip}>
                    ₹{value.toLocaleString()}
                  </div>
                </div>
                <span className={styles.chartLabel}>{currentData.labels[index]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.chartFooter}>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.primary}`}></div>
            <span>Revenue</span>
          </div>
        </div>
        {!loading && (
          <div className={styles.chartSummary}>
            <span>Period: {timeRange === '7d' ? 'Weekly' : timeRange === '30d' ? 'Monthly' : 'Quarterly'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
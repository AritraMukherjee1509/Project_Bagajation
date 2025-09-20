import React from 'react';
import { FiFilter, FiCalendar, FiSearch, FiX } from 'react-icons/fi';

export default function BookingFilters({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      service: 'all',
      search: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== ''
  ).length;

  return (
    <div className="booking-filters">
      <div className="filters-header">
        <div className="filters-title">
          <FiFilter />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="active-count">({activeFiltersCount})</span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            <FiX />
            Clear All
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group">
          <div className="search-filter">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <FiCalendar />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>

        {/* Service Filter */}
        <div className="filter-group">
          <label className="filter-label">Service Type</label>
          <select
            value={filters.service}
            onChange={(e) => handleFilterChange('service', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Services</option>
            <option value="ac-installation">AC Installation</option>
            <option value="ac-repair">AC Repair</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Amount Range */}
        <div className="filter-group">
          <label className="filter-label">Amount Range</label>
          <select
            value={filters.amountRange || 'all'}
            onChange={(e) => handleFilterChange('amountRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Amounts</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="2000+">₹2000+</option>
          </select>
        </div>

        {/* Provider Filter */}
        <div className="filter-group">
          <label className="filter-label">Provider</label>
          <select
            value={filters.provider || 'all'}
            onChange={(e) => handleFilterChange('provider', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Providers</option>
            <option value="subhajit-dey">Subhajit Dey</option>
            <option value="ravi-kumar">Ravi Kumar</option>
            <option value="priya-sharma">Priya Sharma</option>
            <option value="amit-singh">Amit Singh</option>
          </select>
        </div>
      </div>
    </div>
  );
}
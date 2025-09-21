import React, { useState, useEffect } from 'react';
import { FiFilter, FiCalendar, FiSearch, FiX, FiRefreshCw } from 'react-icons/fi';
import { servicesAPI, providersAPI } from '../../utils/api';

export default function BookingFilters({ filters, setFilters, loading }) {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setFiltersLoading(true);
      
      // Load services for filter dropdown
      const servicesResponse = await servicesAPI.getServices({ 
        status: 'active',
        limit: 100,
        select: 'name category'
      });
      
      if (servicesResponse.success) {
        setServices(servicesResponse.data);
      }
      
      // Load providers for filter dropdown
      const providersResponse = await providersAPI.getProviders({ 
        status: 'active',
        limit: 100,
        select: 'name'
      });
      
      if (providersResponse.success) {
        setProviders(providersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load filter options:', error);
    } finally {
      setFiltersLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      service: 'all',
      provider: 'all',
      search: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      page: 1,
      limit: 10
    });
  };

  const clearIndividualFilter = (key) => {
    if (key === 'dateRange') {
      setFilters(prev => ({
        ...prev,
        dateRange: 'all',
        startDate: '',
        endDate: ''
      }));
    } else if (key === 'amountRange') {
      setFilters(prev => ({
        ...prev,
        minAmount: '',
        maxAmount: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: key === 'search' ? '' : 'all'
      }));
    }
  };

  const getActiveFilters = () => {
    const active = [];
    
    if (filters.status && filters.status !== 'all') {
      active.push({ key: 'status', label: `Status: ${filters.status}`, value: filters.status });
    }
    if (filters.service && filters.service !== 'all') {
      const service = services.find(s => s._id === filters.service);
      active.push({ 
        key: 'service', 
        label: `Service: ${service?.name || filters.service}`, 
        value: filters.service 
      });
    }
    if (filters.provider && filters.provider !== 'all') {
      const provider = providers.find(p => p._id === filters.provider);
      active.push({ 
        key: 'provider', 
        label: `Provider: ${provider?.name || filters.provider}`, 
        value: filters.provider 
      });
    }
    if (filters.dateRange && filters.dateRange !== 'all') {
      active.push({ key: 'dateRange', label: `Date: ${filters.dateRange}`, value: filters.dateRange });
    }
    if (filters.startDate && filters.endDate) {
      active.push({ 
        key: 'dateRange', 
        label: `Date: ${filters.startDate} to ${filters.endDate}`, 
        value: 'custom' 
      });
    }
    if (filters.minAmount || filters.maxAmount) {
      const min = filters.minAmount || '0';
      const max = filters.maxAmount || '∞';
      active.push({ 
        key: 'amountRange', 
        label: `Amount: ₹${min} - ₹${max}`, 
        value: 'custom' 
      });
    }
    if (filters.search) {
      active.push({ 
        key: 'search', 
        label: `Search: "${filters.search}"`, 
        value: filters.search 
      });
    }
    
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="booking-filters">
      <div className="filters-header">
        <div className="filters-title">
          <FiFilter />
          <span>Filters</span>
          {activeFilters.length > 0 && (
            <span className="active-count">({activeFilters.length})</span>
          )}
        </div>
        
        {activeFilters.length > 0 && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            <FiX />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Tags */}
      {activeFilters.length > 0 && (
        <div className="active-filters">
          {activeFilters.map((filter, index) => (
            <div key={index} className="filter-tag">
              <span>{filter.label}</span>
              <button 
                onClick={() => clearIndividualFilter(filter.key)}
                className="remove-filter"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group search-group">
          <div className="search-filter">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search bookings by ID, customer name, or service..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
              disabled={loading}
            />
            {filters.search && (
              <button 
                className="clear-search" 
                onClick={() => handleFilterChange('search', '')}
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
            disabled={loading}
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
            value={filters.dateRange || 'all'}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('dateRange', value);
              if (value !== 'custom') {
                handleFilterChange('startDate', '');
                handleFilterChange('endDate', '');
              }
            }}
            className="filter-select"
            disabled={loading}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="last-week">Last Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <>
            <div className="filter-group">
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="filter-input"
                disabled={loading}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">End Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="filter-input"
                disabled={loading}
                min={filters.startDate}
              />
            </div>
          </>
        )}

        {/* Service Filter */}
        <div className="filter-group">
          <label className="filter-label">Service</label>
          <select
            value={filters.service || 'all'}
            onChange={(e) => handleFilterChange('service', e.target.value)}
            className="filter-select"
            disabled={loading || filtersLoading}
          >
            <option value="all">All Services</option>
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
          {filtersLoading && (
            <FiRefreshCw className="filter-loading" />
          )}
        </div>

        {/* Provider Filter */}
        <div className="filter-group">
          <label className="filter-label">Provider</label>
          <select
            value={filters.provider || 'all'}
            onChange={(e) => handleFilterChange('provider', e.target.value)}
            className="filter-select"
            disabled={loading || filtersLoading}
          >
            <option value="all">All Providers</option>
            {providers.map(provider => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </select>
          {filtersLoading && (
            <FiRefreshCw className="filter-loading" />
          )}
        </div>

        {/* Amount Range Filter */}
        <div className="filter-group">
          <label className="filter-label">Amount Range</label>
          <div className="amount-range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="filter-input amount-input"
              disabled={loading}
              min="0"
            />
            <span className="range-separator">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              className="filter-input amount-input"
              disabled={loading}
              min={filters.minAmount || "0"}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="createdAt">Date Created</option>
            <option value="scheduledDate">Scheduled Date</option>
            <option value="pricing.totalAmount">Amount</option>
            <option value="status">Status</option>
            <option value="user.name">Customer Name</option>
            <option value="service.name">Service Name</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Order</label>
          <select
            value={filters.order || 'desc'}
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="filter-summary">
        <span className="results-count">
          {loading ? 'Loading...' : `Showing filtered results`}
        </span>
        {!loading && (
          <button className="refresh-filters" onClick={loadFilterOptions}>
            <FiRefreshCw />
            Refresh Options
          </button>
        )}
      </div>
    </div>
  );
}
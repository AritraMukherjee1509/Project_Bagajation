// src/components/Listing/FilterSidebar.jsx
import React, { useState, useEffect } from 'react';
import s from '../../assets/css/components/Listing/FilterSidebar.module.css';
import { 
  FiFilter, 
  FiX, 
  FiStar, 
  FiMapPin, 
  FiDollarSign,
  FiClock,
  FiShield
} from 'react-icons/fi';
import { servicesAPI, apiUtils } from '../../config/api';

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity }
];

const ratings = [4, 3, 2, 1];

export default function FilterSidebar({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    fetchAvailableLocations();
  }, []);

  const fetchAvailableLocations = async () => {
    try {
      setLoadingLocations(true);
      // Fetch services to extract unique locations
      const response = await servicesAPI.getServices({ limit: 1000 });
      const result = apiUtils.formatResponse(response);
      
      if (result.success) {
        // Extract unique cities from services
        const uniqueCities = [...new Set(
          result.data
            .flatMap(service => service.serviceArea?.cities || [])
            .filter(Boolean)
        )].sort();
        
        setLocations(uniqueCities);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      // Fallback to default cities
      setLocations(['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune']);
    } finally {
      setLoadingLocations(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      category: '',
      priceRange: null,
      rating: null,
      availability: false,
      verified: false
    };
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const activeFiltersCount = Object.values(filters || {}).filter(value => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value !== '';
    return value !== null && value !== undefined;
  }).length;

  const handlePriceRangeChange = (rangeIndex) => {
    const range = priceRanges[rangeIndex];
    updateFilter('minPrice', range.min);
    updateFilter('maxPrice', range.max === Infinity ? undefined : range.max);
    updateFilter('priceRange', rangeIndex);
  };

  const handleRatingChange = (rating) => {
    updateFilter('rating', filters?.rating === rating ? null : rating);
  };

  return (
    <div className={s.filterContainer}>
      <button 
        className={s.mobileToggle}
        onClick={() => setIsOpen(true)}
      >
        <FiFilter />
        Filters
        {activeFiltersCount > 0 && (
          <span className={s.filterCount}>{activeFiltersCount}</span>
        )}
      </button>

      <div className={`${s.sidebar} ${isOpen ? s.open : ''}`}>
        <div className={s.header}>
          <h3 className={s.title}>
            <FiFilter />
            Filters
          </h3>
          <button 
            className={s.closeBtn}
            onClick={() => setIsOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className={s.content}>
          {/* Price Range */}
          <div className={s.filterGroup}>
            <h4 className={s.filterTitle}>
              <FiDollarSign />
              Price Range
            </h4>
            <div className={s.filterOptions}>
              {priceRanges.map((range, index) => (
                <label key={index} className={s.filterOption}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters?.priceRange === index}
                    onChange={() => handlePriceRangeChange(index)}
                  />
                  <span className={s.checkmark}></span>
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className={s.filterGroup}>
            <h4 className={s.filterTitle}>
              <FiStar />
              Minimum Rating
            </h4>
            <div className={s.filterOptions}>
              {ratings.map((rating) => (
                <label key={rating} className={s.filterOption}>
                  <input
                    type="radio"
                    name="rating"
                    checked={filters?.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                  />
                  <span className={s.checkmark}></span>
                  <div className={s.ratingOption}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <FiStar key={i} className={s.starFilled} />
                    ))}
                    <span>& above</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className={s.filterGroup}>
            <h4 className={s.filterTitle}>
              <FiMapPin />
              Location
            </h4>
            <select 
              className={s.select}
              value={filters?.location || ''}
              onChange={(e) => updateFilter('location', e.target.value)}
              disabled={loadingLocations}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {loadingLocations && (
              <span className={s.loadingText}>Loading locations...</span>
            )}
          </div>

          {/* Availability */}
          <div className={s.filterGroup}>
            <h4 className={s.filterTitle}>
              <FiClock />
              Availability
            </h4>
            <label className={s.checkboxOption}>
              <input
                type="checkbox"
                checked={filters?.availability || false}
                onChange={(e) => updateFilter('availability', e.target.checked)}
              />
              <span className={s.checkbox}></span>
              Available Now
            </label>
          </div>

          {/* Verified */}
          <div className={s.filterGroup}>
            <h4 className={s.filterTitle}>
              <FiShield />
              Verification
            </h4>
            <label className={s.checkboxOption}>
              <input
                type="checkbox"
                checked={filters?.verified || false}
                onChange={(e) => updateFilter('verified', e.target.checked)}
              />
              <span className={s.checkbox}></span>
              Verified Professionals Only
            </label>
          </div>
        </div>

        <div className={s.footer}>
          <button className={s.clearBtn} onClick={clearFilters}>
            Clear All
          </button>
          <button 
            className={s.applyBtn}
            onClick={() => setIsOpen(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {isOpen && <div className={s.overlay} onClick={() => setIsOpen(false)} />}
    </div>
  );
}
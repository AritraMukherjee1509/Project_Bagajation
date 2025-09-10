import React, { useState } from 'react';
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

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity }
];

const ratings = [4, 3, 2, 1];
const locations = ['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'];

export default function FilterSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: null,
    rating: null,
    location: '',
    availability: false,
    verified: false
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: null,
      rating: null,
      location: '',
      availability: false,
      verified: false
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

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
                    checked={filters.priceRange === index}
                    onChange={() => updateFilter('priceRange', index)}
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
                    checked={filters.rating === rating}
                    onChange={() => updateFilter('rating', rating)}
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
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
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
                checked={filters.availability}
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
                checked={filters.verified}
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
// src/pages/Listing.jsx
import React, { useState, useEffect } from 'react';
import { servicesAPI, providersAPI, apiUtils } from '../config/api';
import ListingHero from '../components/Listing/ListingHero';
import Category from '../components/Listing/Category';
import ServicesGrid from '../components/Listing/ServicesGrid';
import FilterSidebar from '../components/Listing/FilterSidebar';

export default function Listing() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    priceRange: null,
    rating: null,
    availability: false,
    verified: false
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch services when filters change
  useEffect(() => {
    fetchServices();
  }, [filters, pagination.page]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        categoriesResponse,
        popularResponse,
        featuredResponse,
        providersResponse
      ] = await Promise.all([
        servicesAPI.getServices({ limit: 500 }), // Get all services to extract categories
        servicesAPI.getPopularServices(),
        servicesAPI.getFeaturedServices(),
        providersAPI.getTopProviders({ limit: 8 })
      ]);

      // Extract categories from services
      const allServices = apiUtils.formatResponse(categoriesResponse);
      if (allServices.success) {
        const categoryData = extractCategories(allServices.data);
        setCategories(categoryData);
      }

      // Set popular services
      const popular = apiUtils.formatResponse(popularResponse);
      if (popular.success) {
        setPopularServices(popular.data);
      }

      // Set featured services
      const featured = apiUtils.formatResponse(featuredResponse);
      if (featured.success) {
        setFeaturedServices(featured.data);
      }

      // Set top providers
      const providers = apiUtils.formatResponse(providersResponse);
      if (providers.success) {
        setTopProviders(providers.data);
      }

    } catch (error) {
      const errorResult = apiUtils.handleError(error);
      console.error('Failed to fetch initial data:', errorResult.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === false) {
          delete params[key];
        }
      });

      const response = await servicesAPI.getServices(params);
      const result = apiUtils.formatResponse(response);
      
      if (result.success) {
        setServices(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.total
        }));
      }
    } catch (error) {
      const errorResult = apiUtils.handleError(error);
      console.error('Failed to fetch services:', errorResult.message);
    }
  };

  const extractCategories = (services) => {
    const categoryMap = new Map();
    
    services.forEach(service => {
      if (categoryMap.has(service.category)) {
        categoryMap.set(service.category, categoryMap.get(service.category) + 1);
      } else {
        categoryMap.set(service.category, 1);
      }
    });

    // Convert to array with icons
    const categoryIcons = {
      'AC Services': 'FiWind',
      'Electrical': 'FiZap',
      'Plumbing': 'FiDroplet',
      'Cleaning': 'FiHome',
      'Security': 'FiShield',
      'Maintenance': 'FiTruck',
      'Repair': 'FiTool',
      'Installation': 'FiSettings'
    };

    const categoryColors = {
      'AC Services': '#06b6d4',
      'Electrical': '#f59e0b',
      'Plumbing': '#3b82f6',
      'Cleaning': '#10b981',
      'Security': '#ef4444',
      'Maintenance': '#8b5cf6',
      'Repair': '#f97316',
      'Installation': '#6366f1'
    };

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      icon: categoryIcons[name] || 'FiGrid',
      color: categoryColors[name] || '#6b7280'
    }));
  };

  const handleSearch = (searchData) => {
    setFilters(prev => ({
      ...prev,
      search: searchData.searchQuery,
      location: searchData.location
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategorySelect = (categoryName) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryName ? '' : categoryName
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="spinner">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ListingHero onSearch={handleSearch} />
      <Category 
        categories={categories} 
        onCategorySelect={handleCategorySelect}
        selectedCategory={filters.category}
      />
      <div className="listing-content">
        <div className="container">
          {/* <div className="listing-layout"> */}
            {/* <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
            /> */}
            <div className="services-content">
              <ServicesGrid 
                title="All Services" 
                services={services}
                loading={false}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              />
              {featuredServices.length > 0 && (
                <ServicesGrid 
                  title="Featured Services" 
                  services={featuredServices}
                  loading={false}
                />
              )}
              {popularServices.length > 0 && (
                <ServicesGrid 
                  title="Popular Services" 
                  services={popularServices}
                  loading={false}
                />
              )}
            </div>
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
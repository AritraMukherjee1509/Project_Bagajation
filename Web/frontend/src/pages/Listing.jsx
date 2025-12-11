// src/pages/Listing.jsx
import React, { useState, useEffect } from 'react';
import { servicesAPI, providersAPI, apiUtils } from '../config/api';
import ListingHero from '../components/Listing/ListingHero';
import Category from '../components/Listing/Category';
import SubCategory from '../components/Listing/SubCategory';
import ServiceList from '../components/Listing/ServiceList';
import ServicesGrid from '../components/Listing/ServicesGrid';
import { serviceHierarchy } from '../data/serviceHierarchy';

export default function Listing() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigationState, setNavigationState] = useState({
    level: 1,
    selectedCategory: null,
    selectedSubCategory: null,
    selectedService: null
  });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    subCategory: '',
    service: '',
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

  useEffect(() => {
    if (navigationState.level === 3 && navigationState.selectedService) {
      fetchServices();
    }
  }, [filters, pagination.page, navigationState]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        category: navigationState.selectedCategory,
        subCategory: navigationState.selectedSubCategory,
        service: navigationState.selectedService,
        ...filters
      };

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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    setFilters(prev => ({
      ...prev,
      search: searchData.searchQuery,
      location: searchData.location
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategorySelect = (categoryName) => {
    setNavigationState({
      level: 2,
      selectedCategory: categoryName,
      selectedSubCategory: null,
      selectedService: null
    });
  };

  const handleSubCategorySelect = (subCategoryName) => {
    setNavigationState(prev => ({
      ...prev,
      level: 3,
      selectedSubCategory: subCategoryName,
      selectedService: null
    }));
  };

  const handleServiceSelect = (serviceName) => {
    setNavigationState(prev => ({
      ...prev,
      selectedService: serviceName
    }));
    setFilters(prev => ({
      ...prev,
      category: navigationState.selectedCategory,
      subCategory: navigationState.selectedSubCategory,
      service: serviceName
    }));
  };

  const handleBackToCategories = () => {
    setNavigationState({
      level: 1,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedService: null
    });
  };

  const handleBackToSubCategories = () => {
    setNavigationState(prev => ({
      ...prev,
      level: 2,
      selectedSubCategory: null,
      selectedService: null
    }));
  };

  const categories = Object.entries(serviceHierarchy).map(([name, data]) => ({
    name,
    icon: data.icon,
    color: data.color,
    image: data.image,
    count: Object.values(data.subCategories).reduce((acc, sub) => acc + (sub.services?.length || 0), 0)
  }));

  return (
    <main>
      <ListingHero onSearch={handleSearch} />
      
      {navigationState.level === 1 && (
        <Category 
          categories={categories} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={navigationState.selectedCategory}
        />
      )}

      {navigationState.level === 2 && navigationState.selectedCategory && (
        <SubCategory
          category={navigationState.selectedCategory}
          subCategories={serviceHierarchy[navigationState.selectedCategory].subCategories}
          onSubCategorySelect={handleSubCategorySelect}
          onBack={handleBackToCategories}
          selectedSubCategory={navigationState.selectedSubCategory}
        />
      )}

      {navigationState.level === 3 && navigationState.selectedSubCategory && (
        <ServiceList
          category={navigationState.selectedCategory}
          subCategory={navigationState.selectedSubCategory}
          services={serviceHierarchy[navigationState.selectedCategory].subCategories[navigationState.selectedSubCategory].services}
          onBack={handleBackToSubCategories}
          onServiceSelect={handleServiceSelect}
        />
      )}

      {navigationState.selectedService && (
        <div className="listing-content">
          <div className="container">

            {/* ✅ Added exactly this wrapper like your 1st code */}
            <div className="services-content">
              <ServicesGrid 
                title={`${navigationState.selectedService} Providers`}
                services={services}
                loading={loading}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                showPagination={true}
              />
            </div>

          </div>
        </div>
      )}
    </main>
  );
}

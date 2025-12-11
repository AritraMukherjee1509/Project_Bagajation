// src/pages/Listing.jsx
import React, { useState, useEffect } from 'react';
import { servicesAPI, apiUtils } from '../config/api';
import ListingHero from '../components/Listing/ListingHero';
import Category from '../components/Listing/Category';
import SubCategory from '../components/Listing/SubCategory';
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
      } else {
        setServices([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      const errorResult = apiUtils.handleError(error);
      console.error('Failed to fetch services:', errorResult.message);
      setServices([]);
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

    setFilters(prev => ({
      ...prev,
      category: navigationState.selectedCategory,
      subCategory: subCategoryName,
      service: ''
    }));

    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleServiceSelect = (service) => {
    const serviceName = typeof service === 'string' ? service : (service?.name || service?.title || service?._id);
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

    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBackToCategories = () => {
    setNavigationState({
      level: 1,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedService: null
    });
    setFilters({
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
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBackToSubCategories = () => {
    setNavigationState(prev => ({
      ...prev,
      level: 2,
      selectedSubCategory: null,
      selectedService: null
    }));
    setFilters(prev => ({ ...prev, service: '' }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const categories = Object.entries(serviceHierarchy).map(([name, data]) => ({
    name,
    icon: data.icon,
    color: data.color,
    image: data.image,
    count: Object.values(data.subCategories).reduce((acc, sub) => acc + (sub.services?.length || 0), 0)
  }));

  // Build a lightweight services array from the hierarchy for the selected subcategory
  const getGridServicesForSubCategory = () => {
    if (!navigationState.selectedCategory || !navigationState.selectedSubCategory) return [];
    const sub = serviceHierarchy[navigationState.selectedCategory]?.subCategories?.[navigationState.selectedSubCategory];
    if (!sub) return [];

    const rawServices = sub.services || [];
    return rawServices.map((svc, idx) => {
      if (typeof svc === 'string') {
        return {
          _id: `hier-${navigationState.selectedCategory}-${navigationState.selectedSubCategory}-${idx}`,
          name: svc,
          title: svc,
          images: [],
          provider: {},
          pricing: { basePrice: 0, discountPrice: null },
          ratings: { averageRating: 0, totalReviews: 0 },
          category: navigationState.selectedCategory,
          subCategory: navigationState.selectedSubCategory
        };
      } else {
        return {
          _id: svc._id || svc.id || `hier-${navigationState.selectedCategory}-${navigationState.selectedSubCategory}-${idx}`,
          name: svc.name || svc.title || `Service ${idx+1}`,
          title: svc.name || svc.title,
          images: svc.images || [],
          provider: svc.provider || {},
          pricing: svc.pricing || { basePrice: svc.price || 0 },
          ratings: svc.ratings || { averageRating: svc.rating || 0, totalReviews: svc.reviews || 0 },
          category: navigationState.selectedCategory,
          subCategory: navigationState.selectedSubCategory
        };
      }
    });
  };

  // Trending services: collect a small set across the whole hierarchy (first-found approach)
  const getTrendingServices = (limit = 8) => {
    const list = [];
    Object.entries(serviceHierarchy).some(([catName, catData]) => {
      return Object.entries(catData.subCategories || {}).some(([subName, subData]) => {
        const svcArray = subData.services || [];
        for (let i = 0; i < svcArray.length && list.length < limit; i++) {
          const svc = svcArray[i];
          const item = typeof svc === 'string'
            ? {
                _id: `trend-${catName}-${subName}-${i}`,
                name: svc,
                title: svc,
                images: [],
                provider: {},
                pricing: { basePrice: 0 },
                ratings: { averageRating: 0, totalReviews: 0 },
                category: catName,
                subCategory: subName
              }
            : {
                _id: svc._id || svc.id || `trend-${catName}-${subName}-${i}`,
                name: svc.name || svc.title || svc._id,
                title: svc.name || svc.title,
                images: svc.images || [],
                provider: svc.provider || {},
                pricing: svc.pricing || { basePrice: svc.price || 0 },
                ratings: svc.ratings || { averageRating: svc.rating || 0, totalReviews: svc.reviews || 0 },
                category: catName,
                subCategory: subName
              };

          list.push(item);
        }
        return list.length >= limit; // break outer loops when enough collected
      });
    });
    return list;
  };

  const subCategoryGridServices = getGridServicesForSubCategory();
  const trendingServices = getTrendingServices(8);

  return (
    <main>
      <ListingHero onSearch={handleSearch} />

      {navigationState.level === 1 && (
        <>
          <Category 
            categories={categories} 
            onCategorySelect={handleCategorySelect}
            selectedCategory={navigationState.selectedCategory}
          />

          {/* Trending services shown below categories */}
          <section className="section">
            <div className="container">
              <ServicesGrid
                title={`Trending Services`}
                services={trendingServices}
                loading={false}
                pagination={null}
                showPagination={false}
              />
            </div>
          </section>
        </>
      )}

      {navigationState.level === 2 && navigationState.selectedCategory && (
        <>
          <SubCategory
            category={navigationState.selectedCategory}
            subCategories={serviceHierarchy[navigationState.selectedCategory].subCategories}
            onSubCategorySelect={handleSubCategorySelect}
            onBack={handleBackToCategories}
            selectedSubCategory={navigationState.selectedSubCategory}
          />

          {/* Trending services shown below types (subcategories) */}
          <section className="section">
            <div className="container">
              <ServicesGrid
                title={`Trending in ${navigationState.selectedCategory}`}
                services={trendingServices}
                loading={false}
                pagination={null}
                showPagination={false}
              />
            </div>
          </section>
        </>
      )}

      {/* Grid of services (cards) for selected subcategory */}
      {navigationState.level === 3 && navigationState.selectedSubCategory && (
        <div className="listing-content">
          <div className="container">

            {/* Back to types button */}
            <div style={{ margin: '1rem 0' }}>
              <button type="button" onClick={handleBackToSubCategories} className="btn btn-ghost">
                ← Back to Types
              </button>
            </div>

            <div className="services-content">
              <ServicesGrid
                title={`${navigationState.selectedSubCategory} Services`}
                services={subCategoryGridServices}
                loading={false}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                showPagination={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* When a specific service is selected show provider list (API-backed) */}
      {navigationState.selectedService && navigationState.level === 3 && (
        <div className="listing-content">
          <div className="container">

            {/* Back to types button (still visible when viewing providers) */}
            <div style={{ margin: '1rem 0' }}>
              <button type="button" onClick={handleBackToSubCategories} className="btn btn-ghost">
                ← Back to Types
              </button>
            </div>

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

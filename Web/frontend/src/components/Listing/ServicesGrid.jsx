// src/components/Listing/ServicesGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import s from '../../assets/css/components/Listing/ServicesGrid.module.css';
import { 
  FiStar, 
  FiHeart, 
  FiMapPin, 
  FiClock, 
  FiShield,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, apiUtils } from '../../config/api';

export default function ServicesGrid({ 
  title = 'Services', 
  services = [], 
  loading = false,
  pagination = null,
  onPageChange = null,
  showPagination = false
}) {
  const [favorites, setFavorites] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [updatingFavorites, setUpdatingFavorites] = useState(new Set());
  const sectionRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserFavorites();
    }
  }, [isAuthenticated, user]);

  const fetchUserFavorites = async () => {
    try {
      const response = await usersAPI.getUserFavorites(user._id);
      const result = apiUtils.formatResponse(response);
      
      if (result.success) {
        const favoriteIds = new Set(result.data.map(service => service._id));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Failed to fetch user favorites:', error);
    }
  };

  const toggleFavorite = async (serviceId) => {
    if (!isAuthenticated) {
      // Show login prompt or redirect
      alert('Please login to add favorites');
      return;
    }

    if (updatingFavorites.has(serviceId)) {
      return; // Prevent multiple requests
    }

    try {
      setUpdatingFavorites(prev => new Set([...prev, serviceId]));
      
      if (favorites.has(serviceId)) {
        // Remove from favorites
        await usersAPI.removeFromFavorites(user._id, serviceId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(serviceId);
          return newFavorites;
        });
      } else {
        // Add to favorites
        await usersAPI.addToFavorites(user._id, serviceId);
        setFavorites(prev => new Set([...prev, serviceId]));
      }
    } catch (error) {
      console.error('Failed to update favorites:', error);
      const errorResult = apiUtils.handleError(error);
      alert(errorResult.message);
    } finally {
      setUpdatingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (basePrice, discountPrice) => {
    if (!discountPrice) return 0;
    return Math.round(((basePrice - discountPrice) / basePrice) * 100);
  };

  const getServiceImage = (service) => {
    if (service.images && service.images.length > 0) {
      return service.images[0].url;
    }
    // Fallback image based on category
    const fallbackImages = {
      'AC Services': 'https://images.unsplash.com/photo-1599158150601-174f0c8f4b9d?q=80&w=1400&auto=format&fit=crop',
      'Electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1400&auto=format&fit=crop',
      'Plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1400&auto=format&fit=crop',
      'Cleaning': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
      'Security': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1400&auto=format&fit=crop',
      'Maintenance': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1400&auto=format&fit=crop'
    };
    return fallbackImages[service.category] || fallbackImages['AC Services'];
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="section">
        <div className="container">
          <div className={s.loading}>
            <div className={s.spinner}>Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    return (
      <section ref={sectionRef} className="section">
        <div className="container">
          <div className={`${s.head} ${isVisible ? s.visible : ''}`}>
            <div className={s.titleSection}>
              <h3 className="h3">{title}</h3>
            </div>
          </div>
          <div className={s.noServices}>
            <p>No services found matching your criteria.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="section">
      <div className="container">
        <div className={`${s.head} ${isVisible ? s.visible : ''}`}>
          <div className={s.titleSection}>
            <h3 className="h3">{title}</h3>
            <p className={s.subtitle}>Discover top-rated professionals in your area</p>
          </div>
          {!showPagination && (
            <Link className={s.seeAll} to="/services">
              See All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
        
        <div className={`${s.grid} ${isVisible ? s.visible : ''}`}>
          {services.map((service, index) => (
            <div 
              key={service._id} 
              className={s.cardWrapper}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className={s.card}>
                <Link to={`/service/${service._id}`} className={s.cardLink}>
                  <div className={s.imageContainer}>
                    <div 
                      className={s.photo} 
                      style={{ backgroundImage: `url(${getServiceImage(service)})` }} 
                    />
                    
                    {/* {service.provider?.verification?.status === 'verified' && (
                      <div className={s.verifiedBadge}>
                        <FiShield />
                        Verified
                      </div>
                    )} */}
                    
                    {/* <div className={`${s.availabilityBadge} ${service.availability?.isAvailable ? s.available : s.busy}`}>
                      <FiClock />
                      {service.availability?.isAvailable ? 'Available' : 'Busy'}
                    </div> */}
                  </div>

                  <div className={s.body}>
                    <div className={s.header}>
                      <div className={s.rating}>
                        <div className={s.stars}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={i < Math.round(service.ratings?.averageRating || 0) ? s.starFill : s.starEmpty} 
                            />
                          ))}
                        </div>
                        <span className={s.ratingText}>{service.ratings?.averageRating?.toFixed(1) || '0.0'}</span>
                        <span className={s.reviewCount}>({service.ratings?.totalReviews || 0} reviews)</span>
                      </div>
                      
                      <div className={s.location}>
                        <FiMapPin />
                        {service.serviceArea?.cities?.[0] || 'Multiple cities'}
                      </div>
                    </div>

                    <h4 className={s.title}>{service.name}</h4>
                    
                    <div className={s.pricing}>
                      <span className={s.price}>
                        {formatPrice(service.pricing?.discountPrice || service.pricing?.basePrice)}
                      </span>
                      {service.pricing?.discountPrice && (
                        <>
                          <span className={s.oldPrice}>
                            {formatPrice(service.pricing.basePrice)}
                          </span>
                          <span className={s.discount}>
                            {calculateDiscount(service.pricing.basePrice, service.pricing.discountPrice)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* <div className={s.providerInfo}>
                      <div className={s.provider}>
                        <div className={s.avatar}>
                          {service.provider?.avatar?.url ? (
                            <img src={service.provider.avatar.url} alt={service.provider.name} />
                          ) : (
                            service.provider?.name?.charAt(0) || 'P'
                          )}
                        </div>
                        <div className={s.providerDetails}>
                          <div className={s.name}>{service.provider?.name || 'Provider'}</div>
                          <div className={s.experience}>
                            {service.provider?.experience?.years || 0}+ years experience
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </Link>

                {/* <button 
                  className={`${s.favoriteBtn} ${favorites.has(service._id) ? s.favorited : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(service._id);
                  }}
                  disabled={updatingFavorites.has(service._id)}
                  aria-label="Add to favorites"
                >
                  <FiHeart />
                </button> */}
                <div className={`${s.availabilityBadge} ${service.availability?.isAvailable ? s.available : s.busy}`}>
                      <FiClock />
                      {service.availability?.isAvailable ? 'Available' : 'Busy'}
                    </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {showPagination && pagination && onPageChange && (
          <div className={s.pagination}>
            <button 
              className={s.pageBtn}
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <FiChevronLeft />
              Previous
            </button>
            
            <div className={s.pageNumbers}>
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1)
                .slice(Math.max(0, pagination.page - 3), Math.min(Math.ceil(pagination.total / pagination.limit), pagination.page + 2))
                .map(pageNum => (
                  <button
                    key={pageNum}
                    className={`${s.pageNumber} ${pageNum === pagination.page ? s.active : ''}`}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
            </div>
            
            <button 
              className={s.pageBtn}
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
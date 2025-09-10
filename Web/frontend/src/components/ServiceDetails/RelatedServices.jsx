import React, { useState, useEffect, useRef } from 'react';
import s from '../../assets/css/components/ServiceDetails/RelatedServices.module.css';
import { 
  FiStar, 
  FiHeart, 
  FiMapPin, 
  FiClock, 
  FiShield,
  FiArrowRight
} from 'react-icons/fi';

const relatedServices = [
  {
    id: 2,
    title: 'AC Repair Service',
    by: 'Ravi Kumar',
    price: 850,
    oldPrice: 1000,
    rating: 4.8,
    reviews: 89,
    location: 'Mumbai',
    isVerified: true,
    isAvailable: true,
    photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    category: 'AC Services'
  },
  {
    id: 3,
    title: 'AC Maintenance',
    by: 'Priya Sharma',
    price: 650,
    oldPrice: 800,
    rating: 4.6,
    reviews: 156,
    location: 'Delhi',
    isVerified: true,
    isAvailable: false,
    photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=400&auto=format&fit=crop',
    category: 'AC Services'
  },
  {
    id: 4,
    title: 'Electrical Wiring',
    by: 'Amit Singh',
    price: 1200,
    oldPrice: 1400,
    rating: 4.9,
    reviews: 203,
    location: 'Bangalore',
    isVerified: false,
    isAvailable: true,
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop',
    category: 'Electrical'
  },
  {
    id: 5,
    title: 'Home Cleaning',
    by: 'Neha Patel',
    price: 750,
    oldPrice: 900,
    rating: 4.7,
    reviews: 134,
    location: 'Chennai',
    isVerified: true,
    isAvailable: true,
    photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=400&auto=format&fit=crop',
    category: 'Cleaning'
  }
];

export default function RelatedServices() {
  const [favorites, setFavorites] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <section ref={sectionRef} className={s.wrap}>
      <div className={`${s.header} ${isVisible ? s.visible : ''}`}>
        <h3 className={s.title}>Related Services</h3>
        <p className={s.subtitle}>You might also be interested in</p>
      </div>

      <div className={`${s.servicesList} ${isVisible ? s.visible : ''}`}>
        {relatedServices.map((service, index) => (
          <div 
            key={service.id} 
            className={s.serviceCard}
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <a href={`/service/${service.id}`} className={s.cardLink}>
              <div className={s.imageContainer}>
                <div 
                  className={s.serviceImage} 
                  style={{ backgroundImage: `url(${service.photo})` }} 
                />
                <button 
                  className={`${s.favoriteBtn} ${favorites.has(service.id) ? s.favorited : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(service.id);
                  }}
                  aria-label="Add to favorites"
                >
                  <FiHeart />
                </button>
                
                {service.isVerified && (
                  <div className={s.verifiedBadge}>
                    <FiShield />
                  </div>
                )}
                
                <div className={`${s.availabilityBadge} ${service.isAvailable ? s.available : s.busy}`}>
                  <FiClock />
                  {service.isAvailable ? 'Available' : 'Busy'}
                </div>
              </div>

              <div className={s.serviceContent}>
                <div className={s.serviceHeader}>
                  <span className={s.category}>{service.category}</span>
                  <div className={s.rating}>
                    <FiStar className={s.star} />
                    <span className={s.ratingText}>{service.rating}</span>
                  </div>
                </div>

                <h4 className={s.serviceTitle}>{service.title}</h4>
                
                <div className={s.pricing}>
                  <span className={s.price}>₹{service.price}</span>
                  <span className={s.oldPrice}>₹{service.oldPrice}</span>
                </div>

                <div className={s.providerInfo}>
                  <div className={s.provider}>
                    <div className={s.avatar}>
                      {service.by.charAt(0)}
                    </div>
                    <div className={s.providerDetails}>
                      <div className={s.providerName}>{service.by}</div>
                      <div className={s.location}>
                        <FiMapPin />
                        {service.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            
            <div className={s.cardFooter}>
              <button className={s.viewBtn}>
                View Details
                <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={s.viewAllContainer}>
        <a href="/listing" className={s.viewAllBtn}>
          View All Services
          <FiArrowRight />
        </a>
      </div>
    </section>
  );
}
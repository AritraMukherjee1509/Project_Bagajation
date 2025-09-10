import React, { useState, useEffect, useRef } from 'react';
import s from '../../assets/css/components/Listing/ServicesGrid.module.css';
import { 
  FiStar, 
  FiHeart, 
  FiMapPin, 
  FiClock, 
  FiShield,
  FiPlus,
  FiMinus
} from 'react-icons/fi';

const generateCards = () => Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: [
    'AC Installation Service',
    'Electrical Repair',
    'Plumbing Maintenance',
    'Home Cleaning',
    'Security System Setup',
    'Appliance Repair',
    'Painting Service',
    'Furniture Assembly'
  ][i % 8],
  by: [
    'Subhajit Dey',
    'Ravi Kumar',
    'Priya Sharma',
    'Amit Singh',
    'Neha Patel',
    'Rohit Gupta',
    'Kavya Reddy',
    'Arjun Mehta'
  ][i % 8],
  price: [1050, 850, 1200, 750, 2500, 950, 1800, 650][i % 8],
  oldPrice: [1200, 1000, 1400, 900, 3000, 1100, 2200, 800][i % 8],
  rating: [4.5, 4.8, 4.2, 4.9, 4.6, 4.3, 4.7, 4.4][i % 8],
  reviews: [120, 89, 156, 203, 67, 134, 98, 178][i % 8],
  location: ['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Ahmedabad'][i % 8],
  experience: ['5+ years', '3+ years', '7+ years', '4+ years', '6+ years', '8+ years', '2+ years', '5+ years'][i % 8],
  isVerified: i % 3 === 0,
  isAvailable: i % 4 !== 0,
  photo: [
    'https://images.unsplash.com/photo-1599158150601-174f0c8f4b9d?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581578017426-462ea8f114ba?q=80&w=1400&auto=format&fit=crop'
  ][i % 8],
}));

export default function ServicesGrid({ title = 'Best Services' }) {
  const [cards] = useState(generateCards());
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
    <section ref={sectionRef} className="section">
      <div className="container">
        <div className={`${s.head} ${isVisible ? s.visible : ''}`}>
          <div className={s.titleSection}>
            <h3 className="h3">{title}</h3>
            <p className={s.subtitle}>Discover top-rated professionals in your area</p>
          </div>
          <a className={s.seeAll} href="#">
            See All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        
        <div className={`${s.grid} ${isVisible ? s.visible : ''}`}>
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className={s.cardWrapper}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <a className={s.card} href={`/service/${card.id}`}>
                <div className={s.imageContainer}>
                  <div 
                    className={s.photo} 
                    style={{ backgroundImage: `url(${card.photo})` }} 
                  />
                  <button 
                    className={`${s.favoriteBtn} ${favorites.has(card.id) ? s.favorited : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(card.id);
                    }}
                    aria-label="Add to favorites"
                  >
                    <FiHeart />
                  </button>
                  
                  {card.isVerified && (
                    <div className={s.verifiedBadge}>
                      <FiShield />
                      Verified
                    </div>
                  )}
                  
                  <div className={`${s.availabilityBadge} ${card.isAvailable ? s.available : s.busy}`}>
                    <FiClock />
                    {card.isAvailable ? 'Available' : 'Busy'}
                  </div>
                </div>

                <div className={s.body}>
                  <div className={s.header}>
                    <div className={s.rating}>
                      <div className={s.stars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={i < Math.round(card.rating) ? s.starFill : s.starEmpty} 
                          />
                        ))}
                      </div>
                      <span className={s.ratingText}>{card.rating}</span>
                      <span className={s.reviewCount}>({card.reviews} reviews)</span>
                    </div>
                    
                    <div className={s.location}>
                      <FiMapPin />
                      {card.location}
                    </div>
                  </div>

                  <h4 className={s.title}>{card.title}</h4>
                  
                  <div className={s.pricing}>
                    <span className={s.price}>₹{card.price}</span>
                    <span className={s.oldPrice}>₹{card.oldPrice}</span>
                    <span className={s.discount}>
                      {Math.round(((card.oldPrice - card.price) / card.oldPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className={s.providerInfo}>
                    <div className={s.provider}>
                      <div className={s.avatar}>
                        {card.by.charAt(0)}
                      </div>
                      <div className={s.providerDetails}>
                        <div className={s.name}>{card.by}</div>
                        <div className={s.experience}>{card.experience} experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
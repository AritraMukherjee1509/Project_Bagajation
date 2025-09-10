import React, { useState, useEffect, useRef } from 'react';
import s from '../../assets/css/components/Listing/Category.module.css';
import { 
  FiWind, 
  FiZap, 
  FiDroplet, 
  FiHome, 
  FiShield, 
  FiTruck,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const categories = [
  { name: 'AC Services', icon: <FiWind />, count: 45, color: '#06b6d4' },
  { name: 'Electrical', icon: <FiZap />, count: 32, color: '#f59e0b' },
  { name: 'Plumbing', icon: <FiDroplet />, count: 28, color: '#3b82f6' },
  { name: 'Cleaning', icon: <FiHome />, count: 56, color: '#10b981' },
  { name: 'Security', icon: <FiShield />, count: 23, color: '#ef4444' },
  { name: 'Shifting', icon: <FiTruck />, count: 19, color: '#8b5cf6' },
  { name: 'Maintenance', icon: <FiWind />, count: 34, color: '#06b6d4' },
  { name: 'Repair', icon: <FiZap />, count: 41, color: '#f59e0b' }
];

export default function Category() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);
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

    const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className={`section ${s.wrap}`}>
      <div className="container">
        <div className={`${s.header} ${isVisible ? s.visible : ''}`}>
          <h2 className={s.title}>Browse by Category</h2>
          <p className={s.subtitle}>Find the perfect service for your home needs</p>
        </div>

        <div className={`${s.categoryContainer} ${isVisible ? s.visible : ''}`}>
          <button className={s.scrollBtn} onClick={scrollLeft} aria-label="Scroll left">
            <FiChevronLeft />
          </button>

          <div className={s.categoriesWrapper} ref={scrollContainerRef}>
            <div className={s.categories}>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`${s.categoryCard} ${activeCategory === index ? s.active : ''}`}
                  onClick={() => setActiveCategory(index)}
                  style={{ '--category-color': category.color, '--delay': `${index * 0.1}s` }}
                >
                  <div className={s.categoryIcon}>
                    {category.icon}
                  </div>
                  <div className={s.categoryContent}>
                    <h3 className={s.categoryName}>{category.name}</h3>
                    <span className={s.categoryCount}>{category.count} services</span>
                  </div>
                  <div className={s.categoryBadge}>
                    {category.count}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button className={s.scrollBtn} onClick={scrollRight} aria-label="Scroll right">
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
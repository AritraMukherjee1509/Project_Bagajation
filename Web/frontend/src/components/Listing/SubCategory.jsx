// src/components/Listing/SubCategory.jsx
import React, { useState, useEffect, useRef } from 'react';
import s from '../../assets/css/components/Listing/SubCategory.module.css';
import { FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi';

export default function SubCategory({
  category,
  subCategories = {},
  onSubCategorySelect,
  onBack,
  selectedSubCategory = null
}) {
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setActiveSubCategory(selectedSubCategory);
  }, [selectedSubCategory]);

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

  const handleSubCategoryClick = (subCatName) => {
    const newActive = activeSubCategory === subCatName ? null : subCatName;
    setActiveSubCategory(newActive);

    if (onSubCategorySelect) {
      onSubCategorySelect(newActive);
    }
  };

  const subCategoryArray = Object.entries(subCategories).map(([name, data]) => ({
    name,
    ...data,
    count: data?.services?.length || 0
  }));

  return (
    <section ref={sectionRef} className={`section ${s.wrap}`}>
      <div className="container">
        <div className={`${s.header} ${isVisible ? s.visible : ''}`}>
          <button type="button" className={s.backBtn} onClick={onBack}>
            <FiArrowLeft />
            Back to Categories
          </button>
          <div className={s.titleGroup}>
            <h2 className={s.title}>{category}</h2>
            <p className={s.subtitle}>Select a type to view available services</p>
          </div>
        </div>

        <div className={`${s.subCategoryContainer} ${isVisible ? s.visible : ''}`}>
          <button
            type="button"
            className={s.scrollBtn}
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>

          <div className={s.subCategoriesWrapper} ref={scrollContainerRef}>
            <div className={s.subCategories}>
              {subCategoryArray.map((subCat, index) => {
                const IconComponent = subCat.icon;
                return (
                  <button
                    key={subCat.name + index}
                    type="button"
                    className={`${s.subCategoryCard} ${activeSubCategory === subCat.name ? s.active : ''}`}
                    onClick={() => handleSubCategoryClick(subCat.name)}
                    style={{ '--delay': `${index * 0.1}s` }}
                    aria-pressed={activeSubCategory === subCat.name}
                  >
                    <div className={s.subCategoryIcon}>
                      {IconComponent ? (
                        <IconComponent />
                      ) : (
                        // small inline fallback so UI won't break if icon missing
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                          <circle cx="12" cy="12" r="9" fill="currentColor" />
                        </svg>
                      )}
                    </div>
                    <div className={s.subCategoryContent}>
                      <h3 className={s.subCategoryName}>{subCat.name}</h3>
                      <span className={s.subCategoryCount}>
                        {subCat.count} service{subCat.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className={s.scrollBtn}
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import ListingHero from '../components/Listing/ListingHero';
import Category from '../components/Listing/Category';
import ServicesGrid from '../components/Listing/ServicesGrid';
import FilterSidebar from '../components/Listing/FilterSidebar';

export default function Listing() {
  return (
    <main>
      <ListingHero />
      <Category />
      <div className="listing-content">
        <div className="container">
          <div className="listing-layout">
            <FilterSidebar />
            <div className="services-content">
              <ServicesGrid title="Best Services" />
              <ServicesGrid title="Popular Near You" />
              <ServicesGrid title="Editor's Picks" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
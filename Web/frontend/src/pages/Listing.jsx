import React from 'react';
import Category from '../components/Listing/Category';
import ServicesGrid from '../components/Listing/ServicesGrid';

export default function Listing() {
  return (
    <main className="section">
      <Category />
      <ServicesGrid title="Best Services" />
      <ServicesGrid title="Popular Near You" />
      <ServicesGrid title="Editor’s Picks" />
    </main>
  );
}
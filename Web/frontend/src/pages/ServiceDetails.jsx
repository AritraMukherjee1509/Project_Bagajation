import React from 'react';
import Heading from '../components/ServiceDetails/Heading';
import Description from '../components/ServiceDetails/Description';
import AboutProvider from '../components/ServiceDetails/AboutProvider';
import Reviews from '../components/ServiceDetails/Reviews';

export default function ServiceDetails() {
  return (
    <main className="section">
      <div className="container">
        <Heading />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          <Description />
          <AboutProvider />
        </div>
        <Reviews />
      </div>
    </main>
  );
}
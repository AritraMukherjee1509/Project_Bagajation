import React from 'react';
import Heading from '../components/ServiceDetails/Heading';
import ServiceInfo from '../components/ServiceDetails/ServiceInfo';
import Description from '../components/ServiceDetails/Description';
import AboutProvider from '../components/ServiceDetails/AboutProvider';
import Reviews from '../components/ServiceDetails/Reviews';
import RelatedServices from '../components/ServiceDetails/RelatedServices';

export default function ServiceDetails() {
  return (
    <main>
      <div className="container">
        <Heading />
        <ServiceInfo />
        <div className="service-details-layout">
          <div className="main-content">
            <Description />
            <Reviews />
          </div>
          <div className="sidebar-content">
            <AboutProvider />
            <RelatedServices />
          </div>
        </div>
      </div>
    </main>
  );
}
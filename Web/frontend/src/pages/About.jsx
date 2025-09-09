import React from 'react';
import AboutHero from '../components/About/AboutHero';
import Mission from '../components/About/Mission';
import Vision from '../components/About/Vision';

export default function About() {
  return (
    <main className="section">
      <AboutHero />
      <Mission />
      <Vision />
    </main>
  );
}
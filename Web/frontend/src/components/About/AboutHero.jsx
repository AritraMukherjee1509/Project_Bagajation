import React from 'react';
import s from '../../assets/css/components/About/AboutHero.module.css';
import { FiShield, FiClock, FiCheckCircle, FiCalendar } from 'react-icons/fi';

export default function AboutHero() {
  return (
    <section id="about" className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.block}>
          <div className={s.text}>
            <h2 className="h2">About LG</h2>
            <p className="muted">Who We Are?</p>
            <p className="muted">
              We’re a team of verified professionals delivering reliable home services with transparent pricing and a satisfaction guarantee.
            </p>
          </div>
          <div className={s.image} />
        </div>
        <div className={s.features}>
          <span><FiCheckCircle /> Satisfaction Guarantee</span>
          <span><FiClock /> 24H Availability</span>
          <span><FiShield /> Professional Guarantee</span>
          <span><FiCalendar /> Flexible Appointments</span>
        </div>
      </div>
    </section>
  );
}
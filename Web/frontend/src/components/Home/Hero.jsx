import React from 'react';
import s from '../../assets/css/components/Home/Hero.module.css';
import { FiPhoneCall, FiCheckCircle, FiShield, FiClock } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.heroCard}>
          <div className={s.sideImgLeft} />
          <div className={s.sideImgRight} />
          <div className={s.center}>
            <span className="badge">Shiftings • Repairs • Installations</span>
            <h1 className={`h1 ${s.title}`}>Need shifting or repair of your AC? we can help!</h1>
            <div className={s.subRow}>
              <span><FiCheckCircle /> Free Quotes</span>
              <span><FiShield /> 100% Commitment‑Free</span>
            </div>
            <div className={s.ctaRow}>
              <a className="btn btn-primary" href="tel:+918594849303">
                Call Us Now <FiPhoneCall />
              </a>
            </div>
          </div>
          <div className={s.features}>
            <span><FiShield /> Satisfaction Guarantee</span>
            <span><FiClock /> 24H Availability</span>
            <span><FiShield /> Professional Guarantee</span>
            <span><FiClock /> Flexible Appointments</span>
          </div>
        </div>
      </div>
    </section>
  );
}
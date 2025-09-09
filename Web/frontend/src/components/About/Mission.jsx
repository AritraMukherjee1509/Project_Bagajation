import React from 'react';
import s from '../../assets/css/components/About/MissionVision.module.css';

export default function Mission() {
  return (
    <section className="section">
      <div className="container">
        <div className={`${s.row} ${s.rev}`}>
          <div className={s.img} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581578401680-985f2d1b0a7e?q=80&w=1200&auto=format&fit=crop')" }} />
          <div className={s.text}>
            <h2 className="h2">Our Mission</h2>
            <p className="muted">
              Deliver reliable, transparent, and affordable home services with exceptional customer care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

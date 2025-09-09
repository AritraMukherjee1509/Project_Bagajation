import React from 'react';
import s from '../../assets/css/components/About/MissionVision.module.css';

export default function Vision() {
  return (
    <section className="section">
      <div className="container">
        <div className={s.row}>
          <div className={s.text}>
            <h2 className="h2">Our Vision</h2>
            <p className="muted">
              To be the most trusted platform for home services—easy to access, fair in pricing, and consistently excellent in results.
            </p>
          </div>
          <div className={s.img} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573883431205-98b9fe7eeecf?q=80&w=1200&auto=format&fit=crop')" }} />
        </div>
      </div>
    </section>
  );
}
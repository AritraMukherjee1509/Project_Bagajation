import React from 'react';
import s from '../../assets/css/components/Home/Services.module.css';
import { FiTool } from 'react-icons/fi';

const items = Array.from({ length: 7 }).map((_, i) => ({
  title: 'AC Installation',
  text: 'Lorem ipsum dolor amet, consectetur adipiscing elit',
}));

export default function Services() {
  return (
    <section id="services" className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.header}>
          <h2 className="h2">Our Services</h2>
          <p className="muted">
            We cover installation, repairs, maintenance, and more with trusted professionals.
          </p>
        </div>

        <div className={s.grid}>
          {items.map((it, idx) => (
            <div key={idx} className={s.item}>
              <div className={s.icon}><FiTool /></div>
              <div>
                <h4>{it.title}</h4>
                <p className="muted">{it.text}</p>
              </div>
            </div>
          ))}
          <div className={s.moreCard}>
            <div>
              <h4>More service?</h4>
              <p className="muted">Tell us what you need and we can help!</p>
            </div>
            <a className="btn btn-primary" href="tel:+918594849303">Call Us Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}
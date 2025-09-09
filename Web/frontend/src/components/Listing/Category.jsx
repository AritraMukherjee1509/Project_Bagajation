import React from 'react';
import s from '../../assets/css/components/Listing/Category.module.css';

const cats = ['AC', 'Electrical', 'Plumbing', 'Cleaning', 'Security', 'Shifting'];

export default function Category() {
  return (
    <section className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.row}>
          {cats.map((c, i) => (
            <button className={s.cat} key={i}>{c}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
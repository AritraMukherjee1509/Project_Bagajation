import React from 'react';
import s from '../../assets/css/components/Listing/ServicesGrid.module.css';
import { FiStar } from 'react-icons/fi';

const cards = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: 'AC Installation Service',
  by: 'Subhajit Dey',
  price: 1050,
  oldPrice: 1200,
  rating: 4.5,
  photo: 'https://images.unsplash.com/photo-1599158150601-174f0c8f4b9d?q=80&w=1400&auto=format&fit=crop',
}));

export default function ServicesGrid({ title = 'Best Services' }) {
  return (
    <section className="section">
      <div className="container">
        <div className={s.head}>
          <h3 className="h3">{title}</h3>
          <a className={s.seeAll} href="#">See All →</a>
        </div>
        <div className={s.grid}>
          {cards.map((c) => (
            <a className={s.card} key={c.id} href={`/service/${c.id}`}>
              <div className={s.photo} style={{ backgroundImage: `url(${c.photo})` }} />
              <div className={s.body}>
                <div className={s.rating}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={i < Math.round(c.rating) ? s.starFill : ''} />
                  ))}
                  <span className="muted">(120 Reviews)</span>
                </div>
                <div className={s.title}>{c.title}</div>
                <div className={s.pricing}>
                  <span className={s.price}>{c.price} ₹</span>
                  <span className={s.old}>{c.oldPrice} ₹</span>
                </div>
                <div className={s.meta}>
                  <div className={s.avatar} aria-hidden="true">S</div>
                  <div>
                    <div className={s.name}>{c.by}</div>
                    <div className="muted" style={{fontSize:12}}>Service Provider</div>
                  </div>
                  <button className={s.add}>Add</button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import s from '../../assets/css/components/ServiceDetails/Reviews.module.css';
import { FiStar } from 'react-icons/fi';

const reviews = Array.from({ length: 3 }).map((_, i) => ({
  id: i,
  name: 'Subhajit Dey',
  date: '01 Aug 2025',
  rating: 5,
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}));

export default function Reviews() {
  return (
    <section className="section">
      <h3 className="h3">Reviews</h3>
      <div className={s.list}>
        {reviews.map((r) => (
          <div className={s.item} key={r.id}>
            <div className={s.top}>
              <div className={s.avatar}>S</div>
              <div className={s.info}>
                <div className={s.name}>{r.name}</div>
                <div className={s.stars}>
                  {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} className={s.star} />)}
                </div>
              </div>
              <div className="muted">{r.date}</div>
            </div>
            <p className="muted">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
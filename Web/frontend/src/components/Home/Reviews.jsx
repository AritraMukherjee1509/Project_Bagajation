import React, { useState } from 'react';
import s from '../../assets/css/components/Home/Reviews.module.css';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const data = [
  { name: 'Subhajit Dey', rating: 4, text: 'Great work and fast response. Highly recommend for AC repair!' },
  { name: 'Riya Sharma', rating: 5, text: 'Perfect installation and very professional.' },
  { name: 'Aarav Singh', rating: 4, text: 'Good value for money and friendly staff.' },
];

export default function Reviews() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % data.length);
  const prev = () => setIdx((i) => (i - 1 + data.length) % data.length);
  const item = data[idx];

  return (
    <section className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.inner}>
          <h2 className="h2">Here our original reviews from trusted platform</h2>
          <p className="muted">Real feedback from our happy customers.</p>

          <div className={s.slider}>
            <button className={s.nav} onClick={prev} aria-label="Previous"><FiChevronLeft /></button>

            <div className={s.slide}>
              <div className={s.avatar} aria-hidden="true">{item.name.charAt(0)}</div>
              <div>
                <div className={s.name}>{item.name}</div>
                <div className={s.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={i < item.rating ? s.filled : ''} />
                  ))}
                </div>
                <p className="muted">{item.text}</p>
              </div>
            </div>

            <button className={s.nav} onClick={next} aria-label="Next"><FiChevronRight /></button>
          </div>

          <div className={s.dots}>
            {data.map((_, i) => (
              <span key={i} className={`${s.dot} ${i === idx ? s.active : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
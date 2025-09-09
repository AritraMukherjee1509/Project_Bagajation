import React from 'react';
import s from '../../assets/css/components/Home/Professional.module.css';
import { FiCheck } from 'react-icons/fi';

const bullets = [
  'Repair and Installation',
  'Maintenance',
  'Home Security Services',
  'Shifting',
  'Budget‑friendly',
  'Eco‑friendly solutions',
];

export default function Professional() {
  return (
    <section className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.row}>
          <div className={s.left}>
            <h2 className="h2">Professional for your home services</h2>
            <p className="muted">
              We deliver fast, friendly, professional support for all home needs. On time,
              on budget, guaranteed.
            </p>

            <div className={s.list}>
              {bullets.map((b, i) => (
                <span key={i}><FiCheck /> {b}</span>
              ))}
            </div>

            <div className={s.note}>
              We already provide 24‑hour fast services. Contact us at <strong>(+91) 85948 49303</strong>
            </div>
          </div>

          <div className={s.right}>
            <div className={s.image} />
          </div>
        </div>
      </div>
    </section>
  );
}
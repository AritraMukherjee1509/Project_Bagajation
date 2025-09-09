import React from 'react';
import s from '../../assets/css/components/ServiceDetails/Description.module.css';
import { FiStar, FiPhoneCall } from 'react-icons/fi';

export default function Description() {
  return (
    <section className={s.wrap}>
      <div className={s.rating}>
        {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} className={s.star} />)}
        <span className="muted">(120 Reviews)</span>
      </div>
      <h3 className="h3">AC Installation Service</h3>
      <div className={s.priceRow}>
        <span className={s.price}>1050 ₹</span>
        <span className={s.old}>1200 ₹</span>
      </div>
      <button className="btn btn-primary">Book Service</button>

      <div className={s.quick}>
        <button className="btn btn-outline"><FiPhoneCall /> Call</button>
        <button className="btn btn-outline"><FiPhoneCall /> Call</button>
        <button className="btn btn-outline"><FiPhoneCall /> Call</button>
      </div>
    </section>
  );
}
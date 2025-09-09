import React from 'react';
import s from '../../assets/css/components/Contact/Map.module.css';

export default function Map() {
  return (
    <section className={s.wrap}>
      <div className="container">
        <div className={s.mapCard}>
          <iframe
            title="Map"
            className={s.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.545804629869!2d88.393!3d22.598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM1JzUyLjgiTiA4OMKwMjMnMzQuOCJF!5e0!3m2!1sen!2sin!4v1689099999999"
            loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
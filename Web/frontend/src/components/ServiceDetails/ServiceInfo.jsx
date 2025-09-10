import React, { useState } from 'react';
import s from '../../assets/css/components/ServiceDetails/ServiceInfo.module.css';
import { FiStar, FiMapPin, FiClock, FiShield, FiUsers } from 'react-icons/fi';

export default function ServiceInfo() {
  const [quantity, setQuantity] = useState(1);

  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <div className={s.titleSection}>
          <h1 className={s.title}>Professional AC Installation Service</h1>
          <div className={s.meta}>
            <div className={s.rating}>
              <div className={s.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className={s.star} />
                ))}
              </div>
              <span className={s.ratingText}>4.8</span>
              <span className={s.reviewCount}>(120 Reviews)</span>
            </div>
            
            <div className={s.location}>
              <FiMapPin />
              <span>Available in Kolkata</span>
            </div>
          </div>
        </div>

        <div className={s.priceSection}>
          <div className={s.pricing}>
            <span className={s.price}>₹1,050</span>
            <span className={s.oldPrice}>₹1,200</span>
            <span className={s.discount}>12% OFF</span>
          </div>
          <p className={s.priceNote}>*Inclusive of all taxes</p>
        </div>
      </div>

      <div className={s.features}>
        <div className={s.feature}>
          <FiShield />
          <span>1 Year Warranty</span>
        </div>
        <div className={s.feature}>
          <FiClock />
          <span>Same Day Service</span>
        </div>
        <div className={s.feature}>
          <FiUsers />
          <span>Expert Technicians</span>
        </div>
      </div>

      <div className={s.booking}>
        <div className={s.quantitySelector}>
          <label className={s.quantityLabel}>Quantity:</label>
          <div className={s.quantityControls}>
            <button 
              className={s.quantityBtn}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className={s.quantity}>{quantity}</span>
            <button 
              className={s.quantityBtn}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button className={s.bookBtn}>
          Book Service - ₹{(1050 * quantity).toLocaleString()}
        </button>
      </div>
    </section>
  );
}
import React, { useState } from 'react';
import s from '../../assets/css/components/ServiceDetails/Heading.module.css';
import { FiArrowLeft, FiShare2, FiHeart, FiPlay } from 'react-icons/fi';

export default function Heading() {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AC Installation Service',
        text: 'Check out this amazing service!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <section className={s.wrap}>
      <div className={s.navigation}>
        <button className={s.backBtn} onClick={() => window.history.back()}>
          <FiArrowLeft />
          Back to Services
        </button>
        
        <div className={s.actions}>
          <button 
            className={`${s.actionBtn} ${isFavorited ? s.favorited : ''}`}
            onClick={() => setIsFavorited(!isFavorited)}
            aria-label="Add to favorites"
          >
            <FiHeart />
          </button>
          <button 
            className={s.actionBtn}
            onClick={handleShare}
            aria-label="Share service"
          >
            <FiShare2 />
          </button>
        </div>
      </div>

      <div className={s.bannerContainer}>
        <div className={s.banner}>
          <div className={s.overlay}>
            <button className={s.playBtn} aria-label="Play video">
              <FiPlay />
            </button>
          </div>
        </div>
        
        <div className={s.badges}>
          <span className={s.badge}>
            Professional Service
          </span>
          <span className={s.badge}>
            Same Day Available
          </span>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import s from '../../assets/css/components/ServiceDetails/AboutProvider.module.css';
import { 
  FiStar, 
  FiMapPin, 
  FiClock, 
  FiShield, 
  FiPhone, 
  FiMessageCircle,
  FiAward
} from 'react-icons/fi';

export default function AboutProvider() {
  return (
    <section className={s.wrap}>
      <div className={s.providerCard}>
        <div className={s.providerHeader}>
          <div className={s.avatar}>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
              alt="Subhajit Dey"
              className={s.avatarImage}
            />
            <div className={s.verifiedBadge}>
              <FiShield />
            </div>
          </div>
          
          <div className={s.providerInfo}>
            <h3 className={s.providerName}>Subhajit Dey</h3>
            <p className={s.providerTitle}>AC Installation Specialist</p>
            
            <div className={s.rating}>
              <div className={s.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className={s.star} />
                ))}
              </div>
              <span className={s.ratingText}>4.9 (89 reviews)</span>
            </div>
          </div>
        </div>

        <div className={s.providerStats}>
          <div className={s.stat}>
            <FiAward className={s.statIcon} />
            <div className={s.statContent}>
              <span className={s.statNumber}>5+</span>
              <span className={s.statLabel}>Years Experience</span>
            </div>
          </div>
          
          <div className={s.stat}>
            <FiClock className={s.statIcon} />
            <div className={s.statContent}>
              <span className={s.statNumber}>200+</span>
              <span className={s.statLabel}>Jobs Completed</span>
            </div>
          </div>
          
          <div className={s.stat}>
            <FiMapPin className={s.statIcon} />
            <div className={s.statContent}>
              <span className={s.statNumber}>Kolkata</span>
              <span className={s.statLabel}>Service Area</span>
            </div>
          </div>
        </div>

        <div className={s.providerActions}>
          <button className={s.actionBtn}>
            <FiPhone />
            Call Now
          </button>
          <button className={s.actionBtn}>
            <FiMessageCircle />
            Message
          </button>
        </div>
      </div>

      <div className={s.aboutSection}>
                <h4 className={s.aboutTitle}>About the Provider</h4>
        <p className={s.aboutText}>
          Subhajit is a certified AC installation specialist with over 5 years of experience. 
          He specializes in residential and commercial AC installations, ensuring optimal 
          performance and energy efficiency. Known for his attention to detail and excellent 
          customer service.
        </p>
        
        <div className={s.certifications}>
          <h5 className={s.certificationsTitle}>Certifications & Skills</h5>
          <div className={s.certificationsList}>
            <span className={s.certification}>HVAC Certified</span>
            <span className={s.certification}>Electrical Licensed</span>
            <span className={s.certification}>Safety Trained</span>
            <span className={s.certification}>Brand Authorized</span>
          </div>
        </div>
      </div>
    </section>
  );
}
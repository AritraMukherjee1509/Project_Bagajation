import React from 'react';
import styles from '../assets/css/includes/Footer.module.css';
import { FiYoutube, FiInstagram, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className={styles.wrapper}>
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsInner}>
            <div>
              <h3 className="h3">Stay Connected with Our Newsletter</h3>
              <p className="muted">Subscribe to get updates, promos, and new services.</p>
            </div>
            <form className={styles.form} onSubmit={(e)=>e.preventDefault()}>
              <input className="input" type="email" placeholder="Enter email address" aria-label="Email" />
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <section className={`${styles.footerMain}`}>
        <div className="container">
          <div className={styles.cols}>
            <div className={styles.brandCol}>
              <div className={styles.brandRow}>
                <span className={styles.logoBadge}>LG</span>
                <span className={styles.brandText}>LG</span>
              </div>
              <p className="muted">LG is your destination for top‑notch smart home service and repair.</p>
              <div className={styles.socials}>
                <a href="#" aria-label="YouTube"><FiYoutube /></a>
                <a href="#" aria-label="Instagram"><FiInstagram /></a>
                <a href="#" aria-label="Facebook"><FiFacebook /></a>
                <a href="#" aria-label="Twitter"><FiTwitter /></a>
                <a href="mailto:hello@example.com" aria-label="Email"><FiMail /></a>
              </div>
            </div>

            <div>
              <h4 className={styles.colTitle}>Company</h4>
              <ul className={styles.links}>
                <li><a href="/about">About us</a></li>
                <li><a href="/listing">Services</a></li>
                <li><a href="#">Our Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.colTitle}>Legal</h4>
              <ul className={styles.links}>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">License</a></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.colTitle}>Support</h4>
              <ul className={styles.links}>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Help Center</a></li>
                <li><a href="#">Status</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.bottom}>
            <p className="muted">©2025 LG. All rights reserved.</p>
          </div>
        </div>
      </section>
    </footer>
  );
}
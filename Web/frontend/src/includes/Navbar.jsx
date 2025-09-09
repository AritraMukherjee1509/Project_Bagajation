import React, { useEffect, useState } from 'react';
import styles from '../assets/css/includes/Navbar.module.css';

const LINKS = [
  { href: '#about', label: 'About Us' },
  { href: '#services', label: 'Services' },
  { href: '#faq', label: 'Faq' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.wrapper}>
      <nav className={styles.nav}>
        {/* Brand */}
        <a className={styles.brand} href="/" aria-label="Go to homepage">
          <span className={styles.logoBadge}>LG</span>
          <span className={styles.brandText}>LG</span>
        </a>

        {/* Mobile burger */}
        <button
          className={styles.burger}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.link} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}

          <span className={styles.serviceTag}>
            <span className={styles.dot} aria-hidden="true" />
            24 Hour Services
          </span>

          <a href="#get-started" className={styles.cta} onClick={() => setMenuOpen(false)}>
            Get Started
            <span className={styles.arrowCircle} aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </span>
          </a>

          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
    </header>
  );
}
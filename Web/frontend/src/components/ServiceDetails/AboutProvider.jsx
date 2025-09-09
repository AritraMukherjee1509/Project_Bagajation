import React from 'react';
import s from '../../assets/css/components/ServiceDetails/AboutProvider.module.css';

export default function AboutProvider() {
  return (
    <section className={s.wrap}>
      <h3 className="h3">Description</h3>
      <p className="muted">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur.
      </p>

      <div className="hr" />

      <h4 className="h3">About Service Provider</h4>
      <div className={s.provider}>
        <div className={s.avatar}>S</div>
        <div>
          <div className={s.name}>Subhajit Dey</div>
          <div className="muted">Service Provider</div>
        </div>
      </div>
    </section>
  );
}
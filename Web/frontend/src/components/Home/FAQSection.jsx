import React, { useState } from 'react';
import s from '../../assets/css/components/Home/FAQSection.module.css';
import { FiChevronDown } from 'react-icons/fi';

const qs = [
  { q: 'What is LG?', a: 'LG connects you with reliable, vetted home service professionals for installations, repairs, and more.' },
  { q: 'Are the service providers on LG reliable and qualified?' , a: 'Yes, we verify experience and documents of each provider and monitor reviews.' },
  { q: 'What if I have an issue or complaint about a service provider?' , a: 'Reach us anytime — our support team will help coordinate a solution.' },
  { q: 'How are payments handled on LG?' , a: 'You can pay cash or digitally directly with the provider. More options are coming soon.' },
  { q: 'How do I leave a review for a service provider?' , a: 'After service completion, we send you a review link to rate your experience.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const toggle = (i) => setOpen(open === i ? -1 : i);

  return (
    <section id="faq" className={`section ${s.wrap}`}>
      <div className="container">
        <div className={s.grid}>
          <div>
            <h2 className="h2">Frequently Asked Questions</h2>
            <p className="muted">Still need help? <a href="/contact">Get Help Now</a></p>
          </div>
          <div className={s.faq}>
            {qs.map((item, i) => (
              <details key={i} open={open === i} className={`card ${s.item}`}>
                <summary onClick={(e)=>{e.preventDefault(); toggle(i);}} className={s.summary}>
                  {item.q}
                  <FiChevronDown className={`${s.chev} ${open === i ? s.up : ''}`} />
                </summary>
                <div className={s.answer}>{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
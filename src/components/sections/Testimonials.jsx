import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../../data.js';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const item = testimonials[active];

  return <section className="testimonial-section"><div className="container testimonial-grid">
    <div className="testimonial-intro">
      <div className="eyebrow light"><span /> CERITA JAMAAH</div>
      <h2>Setiap perjalanan<br /><em>punya cerita.</em></h2>
      <p>Pengalaman jamaah dapat membantu Anda memahami gambaran layanan. Hubungi tim untuk informasi yang sesuai dengan rencana Anda.</p>
    </div>
    <div className="testimonial-quote-wrap">
      <div className="quote-card">
        <div className="quote-mark">“</div>
        <div className="stars" aria-label="Testimoni pelanggan">{Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" />)}</div>
        <blockquote>{item.quote}</blockquote>
        <div className="quote-author"><span className="author-avatar">{item.name.charAt(0)}</span><span><strong>{item.name}</strong><small>{item.meta}</small></span></div>
      </div>
    </div>
    <div className="testimonial-controls">
      <button type="button" onClick={() => setActive((active + testimonials.length - 1) % testimonials.length)} aria-label="Testimoni sebelumnya">←</button>
      <button type="button" onClick={() => setActive((active + 1) % testimonials.length)} aria-label="Testimoni berikutnya">→</button>
      <span>0{active + 1} <i>/</i> 0{testimonials.length}</span>
    </div>
  </div></section>;
}

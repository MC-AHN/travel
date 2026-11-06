import React from 'react';
import { UsersRound } from 'lucide-react';
import { SectionHeading } from '../ui/common.jsx';

export default function About() {
  return <section className="about-section about-profile-section" id="tentang">
    <div className="container about-profile">
      <div className="about-profile-intro">
        <div className="about-profile-visual">
          <img
            src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=85"
            alt="Suasana Masjidil Haram sebagai tujuan perjalanan ibadah umrah"
            loading="lazy"
          />
          <span className="about-profile-image-label">JALAN PINTAS MENUJU BAITULLAH</span>
        </div>
        <div className="about-profile-copy">
          <SectionHeading
            eyebrow="TENTANG SAFAR WISATA MADINA"
            title={<>Perjalanan Ibadah yang<br /><em>Berawal dari Niat Dakwah.</em></>}
          />
          <p>Berlokasi di Pesawaran, Lampung, Safar Wisata Madina hadir sebagai wasilah masyarakat menuju Baitullah melalui pelayanan yang mudah, pendampingan, dan nilai dakwah.</p>
          <div className="about-profile-founder">
            <span className="about-profile-founder-mark" aria-hidden="true"><UsersRound size={18} /></span>
            <span><strong>Dr. (HC) Ikhwanul Mujahidin, Lc., M.Pd.</strong><small>Pendiri · Berpengalaman lebih dari 10 tahun sebagai muthawif</small></span>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

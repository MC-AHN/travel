import React from 'react';
import { UsersRound } from 'lucide-react';
import { SectionHeading } from '../ui/common.jsx';

export default function About() {
  return <section className="about-section about-profile-section" id="tentang">
    <div className="container about-profile">
      <div className="about-profile-intro">
        <div className="about-profile-visual about-profile-visual-poster">
          <img
            src="/assets/about/akreditasi-safar-wisata-madina-2026-square.jpeg"
            alt="Poster akreditasi A PT Safar Wisata Madina tahun 2026"
            loading="lazy"
            decoding="async"
          />
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

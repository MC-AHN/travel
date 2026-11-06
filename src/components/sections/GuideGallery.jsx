import React from 'react';
import { SectionHeading } from '../ui/common.jsx';

const guides = [
  { name: 'Ustadz Joni Eko Pranoto', role: 'Mutawif Andalan', image: '/assets/guides/mutawif-joni.webp' },
  { name: 'Ustadz Migdad', role: 'Mutawif Andalan', image: '/assets/guides/mutawif-migdad.webp' },
  { name: 'Ustadzah Syifa', role: 'Mutawifah Andalan', image: '/assets/guides/mutawifah-syifa.webp' }
];

export default function GuideGallery() {
  return <section className="guide-gallery-section" aria-label="Galeri mutawif Safar Wisata Madina">
    <div className="container">
      <SectionHeading
        eyebrow="MUTAWIF SAFAR WISATA MADINA"
        title={<>Para pendamping<br /><em>perjalanan ibadah.</em></>}
        text="Kenali beberapa mutawif yang mendampingi jamaah dalam perjalanan menuju Baitullah."
        center
      />
      <div className="guide-gallery-grid">
        {guides.map(({ name, role, image }) => <figure className="guide-gallery-card" key={name} tabIndex={0}>
          <div className="guide-gallery-frame">
            <img src={image} alt={`${name}, ${role}`} loading="lazy" decoding="async" />
          </div>
          <figcaption>
            <strong>{name}</strong>
            <span>{role}</span>
          </figcaption>
        </figure>)}
      </div>
      <p className="guide-gallery-note">Foto diambil dari video dokumentasi Safar Wisata Madina.</p>
    </div>
  </section>;
}

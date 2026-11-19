import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getGalleryHref } from '../ui/common.jsx';

const moments = [
  {
    className: 'destination-large',
    image: '/assets/destination/jamaah-madinah.webp',
    alt: 'Jamaah Safar Wisata Madina berjalan menuju Masjid Nabawi',
    number: '01',
    title: 'Jamaah',
    description: 'Bersama menuju Baitullah'
  },
  {
    className: 'destination-small',
    image: '/assets/destination/pendampingan-pembimbing.webp',
    alt: 'Pembimbing Safar Wisata Madina mendampingi jamaah',
    number: '02',
    title: 'Pendampingan',
    description: 'Menemani setiap langkah'
  },
  {
    className: 'destination-small destination-ibadah',
    image: '/assets/destination/kegiatan-ibadah.webp',
    alt: 'Jamaah berdoa bersama dalam kegiatan ibadah',
    number: '03',
    title: 'Momen ibadah',
    description: 'Perjalanan yang penuh makna'
  }
];

export default function DestinationMosaic() {
  return <section className="destination-section" id="destinasi">
    <div className="container destination-inner">
      <div className="destination-heading">
        <div className="eyebrow light"><span /> PERJALANAN BERSAMA SAFAR</div>
        <h2>Setiap Langkah Menuju <em>Baitullah, Ada Kami yang Mendampingi.</em></h2>
        <p>Lihat dokumentasi kebersamaan jamaah, pendampingan, dan momen ibadah dalam perjalanan bersama Safar Wisata Madina.</p>
        <a className="button button-gold" href={getGalleryHref()}>Lihat Galeri <ArrowRight size={16} /></a>
      </div>
      <div className="destination-collage">
        {moments.map(({ className, image, alt, number, title, description }) => <figure className={className} key={number}>
          <img src={image} alt={alt} loading="lazy" decoding="async" />
          <figcaption>
            <span>{number}</span>
            <strong>{title}</strong>
            <small>{description}</small>
          </figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}

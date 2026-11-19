import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Image, Play, X } from 'lucide-react';

const galleryItems = [
  {
    id: 'jamaah-madinah',
    type: 'photo',
    title: 'Kebersamaan jamaah',
    description: 'Momen kebersamaan jamaah dalam perjalanan umrah.',
    src: '/assets/destination/jamaah-madinah.webp',
    alt: 'Rombongan jamaah umrah'
  },
  {
    id: 'kegiatan-ibadah',
    type: 'photo',
    title: 'Kegiatan ibadah',
    description: 'Dokumentasi kegiatan ibadah selama perjalanan.',
    src: '/assets/destination/kegiatan-ibadah.webp',
    alt: 'Jamaah mengikuti kegiatan ibadah'
  },
  {
    id: 'pendampingan-pembimbing',
    type: 'photo',
    title: 'Pendampingan pembimbing',
    description: 'Pembimbing mendampingi jamaah selama perjalanan.',
    src: '/assets/destination/pendampingan-pembimbing.webp',
    alt: 'Pembimbing mendampingi jamaah'
  },
  {
    id: 'mutawif-joni',
    type: 'photo',
    title: 'Ustadz Joni Eko Pranoto',
    description: 'Mutawif Safar Wisata Madina.',
    src: '/assets/guides/mutawif-joni.webp',
    alt: 'Ustadz Joni Eko Pranoto'
  },
  {
    id: 'mutawif-migdad',
    type: 'photo',
    title: 'Ustadz Migdad',
    description: 'Mutawif Safar Wisata Madina.',
    src: '/assets/guides/mutawif-migdad.webp',
    alt: 'Ustadz Migdad'
  },
  {
    id: 'mutawifah-syifa',
    type: 'photo',
    title: 'Ustadzah Syifa',
    description: 'Mutawifah Safar Wisata Madina.',
    src: '/assets/guides/mutawifah-syifa.webp',
    alt: 'Ustadzah Syifa'
  },
  {
    id: 'hero-alus',
    type: 'video',
    title: 'Temu kangen alumni umrah',
    description: 'Silaturahmi bersama alumni Safar Wisata Madina.',
    src: '/assets/videos/hero-alus.mp4',
    poster: '/assets/videos/hero-alus-poster.webp'
  },
  {
    id: 'hero-pembimbing',
    type: 'video',
    title: 'Bersama pembimbing',
    description: 'Cuplikan perjalanan bersama pembimbing.',
    src: '/assets/videos/hero-pembimbing.mp4',
    poster: '/assets/videos/gallery-hero-pembimbing.webp'
  },
  {
    id: 'hero-jamaah',
    type: 'video',
    title: 'Perjalanan jamaah',
    description: 'Cuplikan perjalanan bersama jamaah.',
    src: '/assets/videos/hero-jamaah.mp4',
    poster: '/assets/videos/hero-jamaah-poster.webp'
  },
  {
    id: 'hero-ibadah',
    type: 'video',
    title: 'Suasana ibadah',
    description: 'Cuplikan kegiatan ibadah di Tanah Suci.',
    src: '/assets/videos/hero-ibadah.mp4',
    poster: '/assets/videos/hero-ibadah-poster.webp'
  },
  {
    id: 'hero-madinah',
    type: 'video',
    title: 'Perjalanan di Madinah',
    description: 'Cuplikan perjalanan menuju Madinah.',
    src: '/assets/videos/hero-madinah.mp4',
    poster: '/assets/videos/gallery-hero-madinah.webp'
  },
  {
    id: 'umrah-03-potret-pembimbing',
    type: 'video',
    title: 'Potret pembimbing',
    description: 'Dokumentasi pembimbing dalam perjalanan umrah.',
    src: '/assets/videos/umrah-03-potret-pembimbing.mp4',
    poster: '/assets/videos/gallery-umrah-03-potret-pembimbing.webp'
  },
  {
    id: 'umrah-04-pendampingan-jamaah',
    type: 'video',
    title: 'Pendampingan jamaah',
    description: 'Cuplikan pendampingan jamaah selama perjalanan.',
    src: '/assets/videos/umrah-04-pendampingan-jamaah.mp4',
    poster: '/assets/videos/gallery-umrah-04-pendampingan-jamaah.webp'
  },
  {
    id: 'umrah-05-menuju-masjid-nabawi',
    type: 'video',
    title: 'Menuju Masjid Nabawi',
    description: 'Cuplikan perjalanan menuju Masjid Nabawi.',
    src: '/assets/videos/umrah-05-menuju-masjid-nabawi.mp4',
    poster: '/assets/videos/gallery-umrah-05-menuju-masjid-nabawi.webp'
  },
  {
    id: 'whatsapp-pembimbing-migdad',
    type: 'video',
    title: 'Pesan dari Ustadz Migdad',
    description: 'Cuplikan dokumentasi bersama pembimbing.',
    src: '/assets/videos/whatsapp-2026-10-27-102806-pembimbing-migdad.mp4',
    poster: '/assets/videos/gallery-whatsapp-2026-10-27-102806-pembimbing-migdad.webp'
  },
  {
    id: 'whatsapp-kegiatan-masjid',
    type: 'video',
    title: 'Kegiatan di masjid',
    description: 'Cuplikan kegiatan jamaah di masjid.',
    src: '/assets/videos/whatsapp-2026-10-27-102808-kegiatan-di-masjid.mp4',
    poster: '/assets/videos/gallery-whatsapp-2026-10-27-102808-kegiatan-di-masjid.webp'
  },
  {
    id: 'whatsapp-kedatangan-jamaah',
    type: 'video',
    title: 'Kedatangan jamaah',
    description: 'Dokumentasi kedatangan rombongan jamaah.',
    src: '/assets/videos/whatsapp-2026-10-27-102813-kedatangan-jamaah.mp4',
    poster: '/assets/videos/gallery-whatsapp-2026-10-27-102813-kedatangan-jamaah.webp'
  },
  {
    id: 'whatsapp-perjalanan-jamaah',
    type: 'video',
    title: 'Perjalanan jamaah',
    description: 'Cuplikan perjalanan bersama rombongan.',
    src: '/assets/videos/whatsapp-2026-10-27-102815-perjalanan-jamaah.mp4',
    poster: '/assets/videos/gallery-whatsapp-2026-10-27-102815-perjalanan-jamaah.webp'
  }
];

function GalleryModal({ item, onClose, onVideoPlay }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll('button, video[controls]')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault();
        focusable[0].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [item, onClose]);

  return createPortal(<div className="gallery-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="gallery-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={`gallery-modal-title-${item.id}`} tabIndex={-1}>
      <button ref={closeRef} type="button" className="gallery-modal-close" onClick={onClose} aria-label="Tutup media"><X size={22} /></button>
      <div className="gallery-modal-media">
        {item.type === 'video'
          ? <video src={item.src} controls playsInline preload="metadata" poster={item.poster} onPlay={onVideoPlay} />
          : <img src={item.src} alt={item.alt} />}
      </div>
      <div className="gallery-modal-caption">
        <span>{item.type === 'video' ? 'VIDEO' : 'FOTO'}</span>
        <h2 id={`gallery-modal-title-${item.id}`}>{item.title}</h2>
        <p>{item.description}</p>
      </div>
    </section>
  </div>, document.body);
}

export default function GalleryPage({ onVideoPlay }) {
  const [filter, setFilter] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);
  const filters = ['Semua', 'Foto', 'Video'];
  const visibleItems = filter === 'Semua'
    ? galleryItems
    : galleryItems.filter(item => item.type === (filter === 'Foto' ? 'photo' : 'video'));
  const closeModal = useCallback(() => setSelectedItem(null), []);

  return <main className="gallery-page">
    <section className="gallery-page-hero">
      <div className="container">
        <div className="eyebrow light"><span /> GALERI SAFAR WISATA MADINA</div>
        <h1>Momen perjalanan<br /><em>menuju Baitullah.</em></h1>
        <p>Kenali kebersamaan, pendampingan, dan kegiatan jamaah melalui foto dan video perjalanan.</p>
      </div>
    </section>
    <section className="gallery-page-content">
      <div className="container">
        <div className="gallery-page-heading">
          <div>
            <span className="eyebrow"><span /> DOKUMENTASI PERJALANAN</span>
            <h2>Foto &amp; video kegiatan</h2>
          </div>
          <div className="gallery-filters" role="group" aria-label="Filter galeri">
            {filters.map(option => <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              className={filter === option ? 'is-active' : ''}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>)}
          </div>
        </div>
        <div className="gallery-grid" aria-live="polite">
          {visibleItems.map(item => <button
            className="gallery-card"
            type="button"
            key={item.id}
            onClick={() => setSelectedItem(item)}
            aria-label={`${item.type === 'video' ? 'Putar video' : 'Lihat foto'}: ${item.title}`}
          >
            <span className="gallery-card-media">
              <img src={item.type === 'video' ? item.poster : item.src} alt={item.type === 'photo' ? item.alt : ''} loading="lazy" decoding="async" />
              {item.type === 'video'
                ? <span className="gallery-card-play" aria-hidden="true"><Play size={21} fill="currentColor" /></span>
                : <span className="gallery-card-photo" aria-hidden="true"><Image size={17} /></span>}
            </span>
            <span className="gallery-card-copy">
              <small>{item.type === 'video' ? 'VIDEO' : 'FOTO'}</small>
              <strong>{item.title}</strong>
            </span>
          </button>)}
        </div>
      </div>
    </section>
    {selectedItem && <GalleryModal item={selectedItem} onClose={closeModal} onVideoPlay={onVideoPlay} />}
  </main>;
}

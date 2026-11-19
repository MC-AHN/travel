import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';
import { packages } from '../../data.js';

function PackageCard({ item, onSelect }) {
  return <article className="package-card">
    <button className="package-poster-button" type="button" onClick={() => onSelect(item)} aria-label={`Lihat informasi ${item.title}`}>
      <img src={item.image} alt={`Poster ${item.title}`} loading="lazy" />
    </button>
  </article>;
}

function PackageInfoModal({ item, onClose }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);
  return createPortal(<div className="detail-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="package-info-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={`package-info-title-${item.id}`} tabIndex={-1}>
      <button ref={closeRef} type="button" className="package-info-close" onClick={onClose} aria-label="Tutup informasi"><X size={22} /></button>
      <div className="package-info-content">
        <div className="eyebrow"><span />{item.category} · {item.tag}</div>
        <h2 id={`package-info-title-${item.id}`}>{item.title}</h2>
        {item.highlight && <p className="package-info-highlight">{item.highlight}</p>}
        <div className="package-info-facts">
          {[
            ['Keberangkatan', item.departure],
            item.date && ['Jadwal', item.date],
            item.period && ['Periode harga', item.period],
            item.duration && ['Durasi', item.duration],
            item.price && ['Harga paket', item.price],
            item.airline && ['Maskapai', item.airline],
            item.makkah && ['Hotel Makkah', item.makkah],
            item.madinah && ['Hotel Madinah', item.madinah]
          ].filter(Boolean).map(([label, value]) => <div className="package-info-fact" key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </div>)}
        </div>
        {item.hotelGroups && <div className="package-hotel-groups">
          {item.hotelGroups.map(group => <section className="package-hotel-group" key={group.city}>
            <h3>{group.city}</h3>
            <ul>
              {group.hotels.map(hotel => <li key={hotel.name}>
                <span>{hotel.name}</span>
                <strong>{hotel.rate}</strong>
                <small>{hotel.meal}</small>
              </li>)}
            </ul>
          </section>)}
        </div>}
        {item.services?.length > 0 && <section className="package-info-list">
          <h3>Layanan yang tercantum di poster</h3>
          <ul>{item.services.map(service => <li key={service}>{service}</li>)}</ul>
        </section>}
        {item.included?.length > 0 && <section className="package-info-list">
          <h3>Termasuk dalam paket</h3>
          <ul>{item.included.map(detail => <li key={detail}>{detail}</li>)}</ul>
        </section>}
        {item.excluded?.length > 0 && <section className="package-info-list">
          <h3>Belum termasuk</h3>
          <ul>{item.excluded.map(detail => <li key={detail}>{detail}</li>)}</ul>
        </section>}
        {item.note && <p className="package-info-note">{item.note}</p>}
        {item.contact && <p className="package-info-contact">Nomor info pada poster: <strong>{item.contact}</strong></p>}
        <WhatsAppLink
          className="button button-primary"
          message={`Assalamu’alaikum, saya ingin menanyakan ${item.category === 'Hotel' ? 'booking hotel' : 'detail paket'} ${item.title}.`}
        >
          Tanyakan ketersediaan
        </WhatsAppLink>
      </div>
    </section>
  </div>, document.body);
}

export default function Packages() {
  const [filter, setFilter] = useState('Semua');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const carouselRef = useRef(null);
  const loopAdjusting = useRef(false);
  const loopFrame = useRef(0);
  const filters = ['Semua', ...new Set(packages.map(item => item.category))];
  const visible = filter === 'Semua' ? packages : packages.filter(p => p.category === filter);
  const packageLayoutClass = visible.length === 1 ? ' has-one-package' : visible.length === 2 ? ' has-two-packages' : '';

  const getCycleWidth = (track, count) => {
    if (!track || count === 0 || track.children.length < count * 2) return 0;
    return track.children[count].offsetLeft - track.children[0].offsetLeft;
  };
  const updateCenteredCard = (track) => {
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + track.clientWidth / 2;
    let centeredCard = null;
    let closestDistance = Infinity;
    [...track.children].forEach(card => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - trackCenter);
      card.classList.toggle('is-near-center', rect.right > trackRect.left && rect.left < trackRect.right);
      if (distance < closestDistance) {
        closestDistance = distance;
        centeredCard = card;
      }
    });
    [...track.children].forEach(card => card.classList.toggle('is-centered', card === centeredCard));
  };
  const resetCarousel = () => {
    const track = carouselRef.current;
    if (!track || visible.length === 0) return;
    const cycleWidth = getCycleWidth(track, visible.length);
    if (cycleWidth > 0) {
      track.style.scrollBehavior = 'auto';
      const mobileCarousel = window.matchMedia('(max-width: 540px)').matches;
      if (mobileCarousel) {
        const card = track.children[visible.length * 3];
        if (card) {
          const trackRect = track.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          track.scrollLeft = cardRect.left - trackRect.left + track.scrollLeft - (track.clientWidth - cardRect.width) / 2;
        }
      } else {
        track.scrollLeft = cycleWidth * 3;
      }
      track.style.scrollBehavior = '';
      updateCenteredCard(track);
    }
  };
  const handleCarouselScroll = () => {
    const track = carouselRef.current;
    if (!track || visible.length === 0 || loopAdjusting.current || loopFrame.current) return;
    loopFrame.current = requestAnimationFrame(() => {
      loopFrame.current = 0;
      const currentTrack = carouselRef.current;
      if (!currentTrack) return;
      const cycleWidth = getCycleWidth(currentTrack, visible.length);
      if (!cycleWidth) {
        updateCenteredCard(currentTrack);
        return;
      }
      let nextScrollLeft = currentTrack.scrollLeft;
      while (nextScrollLeft < cycleWidth * 2) nextScrollLeft += cycleWidth;
      while (nextScrollLeft > cycleWidth * 4) nextScrollLeft -= cycleWidth;
      if (nextScrollLeft !== currentTrack.scrollLeft) {
        loopAdjusting.current = true;
        const previousScrollBehavior = currentTrack.style.scrollBehavior;
        currentTrack.style.scrollBehavior = 'auto';
        currentTrack.scrollLeft = nextScrollLeft;
        requestAnimationFrame(() => {
          currentTrack.style.scrollBehavior = previousScrollBehavior;
          loopAdjusting.current = false;
          updateCenteredCard(currentTrack);
        });
      } else {
        updateCenteredCard(currentTrack);
      }
    });
  };
  const movePackages = (direction) => {
    const track = carouselRef.current;
    if (!track) return;
    const card = track.querySelector('.package-card');
    if (!card) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '22') || 22;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  useEffect(() => {
    const frame = requestAnimationFrame(resetCarousel);
    return () => cancelAnimationFrame(frame);
  }, [filter, visible.length]);
  useEffect(() => {
    const track = carouselRef.current;
    if (!track) return;
    const onResize = () => resetCarousel();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (loopFrame.current) cancelAnimationFrame(loopFrame.current);
    };
  }, [filter, visible.length]);

  const renderCards = (copy) => visible.map(item => <PackageCard item={item} key={`${copy}-${item.id}`} onSelect={setSelectedPackage} />);
  return <section className={`section packages-section${packageLayoutClass}`} id="paket"><div className="container packages-container">
    <div className="packages-top"><SectionHeading eyebrow="PAKET & BOOKING HOTEL" title={<>Pilih paket atau hotel<br /><em>untuk perjalanan Anda.</em></>} text="Jelajahi paket umrah dan pilihan hotel di Makkah serta Madinah, lalu konsultasikan detailnya kepada tim kami." /><div className="packages-tools"><div className="filter-tabs" role="tablist" aria-label="Filter paket dan hotel">{filters.map(f => <button key={f} type="button" className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)} role="tab" aria-selected={filter === f}>{f}</button>)}</div></div></div>
    <div className="package-carousel" ref={carouselRef} onScroll={handleCarouselScroll} aria-label="Daftar paket perjalanan">
      {visible.length < 3 ? renderCards('actual') : Array.from({ length: 7 }, (_, copy) => renderCards(copy))}
    </div>
    <div className="package-arrows package-arrows-bottom"><button type="button" onClick={() => movePackages(-1)} aria-label="Paket sebelumnya">‹</button><button type="button" onClick={() => movePackages(1)} aria-label="Paket berikutnya">›</button></div>
    <div className="package-carousel-hint"><span>GESER UNTUK MELIHAT PAKET LAINNYA</span><span className="package-carousel-line" /></div>
    {selectedPackage && <PackageInfoModal item={selectedPackage} onClose={() => setSelectedPackage(null)} />}
    <p className="disclaimer">Informasi paket dan hotel dirangkum dari materi yang tersedia. Konfirmasikan jadwal, harga beserta mata uang dan satuannya, fasilitas, serta ketersediaan kepada tim Safar Wisata Madina sebelum mendaftar.</p>
  </div></section>;
}

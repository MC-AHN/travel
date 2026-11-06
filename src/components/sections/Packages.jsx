import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SectionHeading } from '../ui/common.jsx';
import { packages } from '../../data.js';

function PackageCard({ item, onSelect }) {
  return <article className="package-card">
    <button className="package-poster-button" type="button" onClick={() => onSelect(item)} aria-label={`Perbesar poster paket ${item.title}, keberangkatan ${item.departure}`}>
      <img src={item.image} alt={`Poster paket umrah ${item.duration}, keberangkatan ${item.departure}`} loading="lazy" />
    </button>
  </article>;
}

function PackagePosterModal({ item, onClose }) {
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
    <section className="package-poster-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label={`Poster paket ${item.title}, keberangkatan ${item.departure}`} tabIndex={-1}>
      <button ref={closeRef} type="button" className="package-poster-close" onClick={onClose} aria-label="Tutup poster"><X size={22} /></button>
      <img src={item.image} alt={`Poster paket umrah ${item.duration}, keberangkatan ${item.departure}`} />
    </section>
  </div>, document.body);
}

export default function Packages() {
  const [filter, setFilter] = useState('Semua');
  const [selectedPoster, setSelectedPoster] = useState(null);
  const carouselRef = useRef(null);
  const loopAdjusting = useRef(false);
  const loopFrame = useRef(0);
  const filters = ['Semua', ...new Set(packages.map(item => item.category))];
  const visible = filter === 'Semua' ? packages : packages.filter(p => p.category === filter);

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

  const renderCards = (copy) => visible.map(item => <PackageCard item={item} key={`${copy}-${item.id}`} onSelect={setSelectedPoster} />);
  return <section className={`section packages-section${visible.length < 3 ? ' has-two-packages' : ''}`} id="paket"><div className="container packages-container">
    <div className="packages-top"><SectionHeading eyebrow="PILIH PERJALANAN" title={<>Temukan paket yang<br /><em>sesuai rencana Anda.</em></>} text="Lihat pilihan perjalanan dan konsultasikan detail paket bersama tim Safar Wisata Madina." /><div className="packages-tools"><div className="filter-tabs" role="tablist" aria-label="Filter paket">{filters.map(f => <button key={f} type="button" className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)} role="tab" aria-selected={filter === f}>{f}</button>)}</div></div></div>
    <div className="package-carousel" ref={carouselRef} onScroll={handleCarouselScroll} aria-label="Daftar paket perjalanan">
      {visible.length < 3 ? renderCards('actual') : Array.from({ length: 7 }, (_, copy) => renderCards(copy))}
    </div>
    <div className="package-arrows package-arrows-bottom"><button type="button" onClick={() => movePackages(-1)} aria-label="Paket sebelumnya">‹</button><button type="button" onClick={() => movePackages(1)} aria-label="Paket berikutnya">›</button></div>
    <div className="package-carousel-hint"><span>GESER UNTUK MELIHAT PAKET LAINNYA</span><span className="package-carousel-line" /></div>
    {selectedPoster && <PackagePosterModal item={selectedPoster} onClose={() => setSelectedPoster(null)} />}
    <p className="disclaimer">Informasi dirangkum dari materi paket yang tersedia. Konfirmasikan kembali jadwal, harga, fasilitas, dan ketersediaan kepada tim Safar Wisata Madina sebelum mendaftar.</p>
  </div></section>;
}

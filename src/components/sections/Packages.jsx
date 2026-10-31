import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';
import { packages } from '../../data.js';
import { WA_NUMBER } from '../ui/common.jsx';

function PackageCard({ item, onDetails }) {
  return <article className="package-card">
    <div className="package-photo"><img src={item.image} alt="Ilustrasi destinasi perjalanan" loading="lazy" /><span className="package-tag">{item.tag}</span><span className="package-duration">{item.duration}</span></div>
    <div className="package-body"><div className="package-date"><Clock3 size={14} /> {item.date}</div><h3>{item.title}</h3>
      <div className="package-details"><div><MapPin size={15} /><span><small>Makkah</small>{item.makkah}</span></div><div><MapPin size={15} /><span><small>Madinah / destinasi</small>{item.madinah}</span></div><div><Plane size={15} /><span><small>Maskapai</small>{item.airline}</span></div></div>
      <div className="package-footer"><div><small>Harga mulai dari</small><strong>{item.price}</strong></div><button type="button" onClick={() => onDetails(item)} className="detail-button">Detail paket <ArrowRight size={15} /></button></div>
    </div>
  </article>;
}

function PackageDetail({ item, onClose }) {
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
  const included = item.included || ['Tiket pesawat sesuai program', 'Akomodasi hotel sesuai paket', 'Transportasi program', 'Visa sesuai ketentuan paket', 'Pendamping perjalanan sesuai program'];
  const excluded = item.excluded || ['Pembuatan paspor dan biaya pribadi', 'Vaksinasi yang diwajibkan', 'Kelebihan bagasi dan layanan di luar program'];
  const rooms = item.roomPrices || [{ type: 'Double', note: '2 orang per kamar', price: item.price }, { type: 'Triple', note: '3 orang per kamar', price: 'Konfirmasi ke admin' }, { type: 'Quad', note: '4 orang per kamar', price: 'Konfirmasi ke admin' }];
  return createPortal(<div className="detail-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="detail-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="detail-title" tabIndex={-1}>
      <button ref={closeRef} type="button" className="detail-close" onClick={onClose} aria-label="Tutup detail">×</button>
      <div className="detail-modal-shell">
        <div className="detail-modal-content">
          <div className="eyebrow"><span /> INFORMASI PAKET</div>
          <h2 id="detail-title">{item.title}</h2>
          <p className="detail-intro">Berikut ringkasan informasi paket. Pastikan tanggal, harga, hotel, dan ketersediaan terbaru dikonfirmasi kepada tim Alfajr sebelum mendaftar.</p>
          <div className="detail-facts"><div><small>Tanggal</small><strong>{item.date}</strong></div><div><small>Durasi</small><strong>{item.duration}</strong></div><div><small>Maskapai</small><strong>{item.airline}</strong></div><div><small>Bandara</small><strong>{item.airport || 'Konfirmasi saat pemesanan'}</strong></div><div><small>Hotel Makkah</small><strong>{item.makkah}</strong></div><div><small>Hotel Madinah / destinasi</small><strong>{item.madinah}</strong></div></div>
          <h3>Pilihan harga kamar</h3>
          <div className="room-price-list">{rooms.map(room => <div className="room-price" key={room.type}><span><strong>{room.type}</strong><small>{room.note}</small></span><b>{room.price}</b></div>)}</div>
          <div className="detail-inclusions"><div><h3>Harga termasuk</h3><ul>{included.map(x => <li key={x}><Check size={15}/>{x}</li>)}</ul></div><div><h3>Harga tidak termasuk</h3><ul>{excluded.map(x => <li key={x}><span className="exclude-mark">−</span>{x}</li>)}</ul></div></div>
          {item.itinerary && <><h3>Gambaran itinerary</h3><ol className="itinerary-list">{item.itinerary.map((x, i) => <li key={x}><span>Hari {i+1}</span>{x}</li>)}</ol></>}
          <a className="button button-primary detail-contact" href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Assalamu’alaikum, saya ingin konfirmasi detail paket: ' + item.title)}`} target="_blank" rel="noreferrer">Konfirmasi paket via WhatsApp <ArrowRight size={16}/></a>
        </div>
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
  const filters = ['Semua', 'Umrah', 'Wisata'];
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

  const renderCards = (copy) => visible.map(item => <PackageCard item={item} key={`${copy}-${item.id}`} onDetails={setSelectedPackage} />);
  return <section className="section packages-section" id="paket"><div className="container packages-container">
    <div className="packages-top"><SectionHeading eyebrow="PILIH PERJALANAN" title={<>Temukan paket yang<br /><em>sesuai rencana Anda.</em></>} text="Lihat pilihan perjalanan dan konsultasikan detail paket bersama tim Alfajr." /><div className="packages-tools"><div className="filter-tabs" role="tablist" aria-label="Filter paket">{filters.map(f => <button key={f} type="button" className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)} role="tab" aria-selected={filter === f}>{f}</button>)}</div></div></div>
    <div className="package-carousel" ref={carouselRef} onScroll={handleCarouselScroll} aria-label="Daftar paket perjalanan">
      {Array.from({ length: 7 }, (_, copy) => renderCards(copy))}
    </div>
    <div className="package-arrows package-arrows-bottom"><button type="button" onClick={() => movePackages(-1)} aria-label="Paket sebelumnya">‹</button><button type="button" onClick={() => movePackages(1)} aria-label="Paket berikutnya">›</button></div>
    <div className="package-carousel-hint"><span>GESER UNTUK MELIHAT PAKET LAINNYA</span><span className="package-carousel-line" /></div>
    {selectedPackage && <PackageDetail item={selectedPackage} onClose={() => setSelectedPackage(null)} />}
    <p className="disclaimer">Jadwal, harga, fasilitas, dan ketersediaan dapat berubah. Konfirmasikan informasi terbaru kepada tim Alfajr sebelum mendaftar.</p>
  </div></section>;
}

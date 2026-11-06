import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';

const heroVideos = [
  ['hero-pembimbing', 'hero-pembimbing-poster'],
  ['hero-jamaah', 'hero-jamaah-poster'],
  ['hero-ibadah', 'hero-ibadah-poster'],
  ['hero-madinah', 'hero-madinah-poster']
];

function getVisibleVideoCount(width) {
  if (width < 761) return 1;
  if (width < 1024) return 2;
  if (width < 1600) return 3;
  return 4;
}

export default function Hero() {
  const videoRefs = useRef([]);
  const [visibleVideoCount, setVisibleVideoCount] = useState(() => getVisibleVideoCount(window.innerWidth));

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    if (!videos.length) return;

    let resumeTimer;
    const syncPlayback = () => {
      window.clearTimeout(resumeTimer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || (window.innerWidth < 761 && window.scrollY > 0)) {
        videos.forEach(video => video.pause());
        return;
      }

      videos.forEach(video => {
        if (video.paused) {
          video.play().catch(error => {
            if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
              console.error('Unable to play the hero video:', error);
            }
          });
        }
      });
    };

    const updateVisibleVideoCount = () => {
      setVisibleVideoCount(getVisibleVideoCount(window.innerWidth));
    };

    const handleScroll = () => {
      if (window.innerWidth >= 761) return;
      videos.forEach(video => video.pause());
      window.clearTimeout(resumeTimer);
      if (window.scrollY === 0) {
        resumeTimer = window.setTimeout(syncPlayback, 180);
      }
    };

    syncPlayback();
    window.addEventListener('resize', updateVisibleVideoCount);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionPreference.addEventListener('change', syncPlayback);
    return () => {
      window.clearTimeout(resumeTimer);
      window.removeEventListener('resize', updateVisibleVideoCount);
      window.removeEventListener('scroll', handleScroll);
      motionPreference.removeEventListener('change', syncPlayback);
    };
  }, [visibleVideoCount]);

  return <section className="hero" id="beranda">
    <div className="hero-video-wall" aria-hidden="true">
      {heroVideos.slice(0, visibleVideoCount).map(([video, poster], index) => <video
        key={video}
        ref={element => { videoRefs.current[index] = element; }}
        className="hero-video"
        muted
        loop
        playsInline
        preload="none"
        poster={`/assets/videos/${poster}.webp`}
        tabIndex={-1}>
        <source src={`/assets/videos/${video}.mp4`} type="video/mp4" />
      </video>)}
    </div>
    <div className="hero-shade" />
    <div className="hero-content container">
      <div className="eyebrow light"><span /> TEMAN PERJALANAN IBADAH ANDA</div>
      <h1>Umroh mudah,<br /><em>hati lebih tenang.</em></h1>
      <p>Persiapkan perjalanan menuju Tanah Suci bersama tim yang mendampingi Anda dari proses pendaftaran hingga kembali ke rumah.</p>
      <div className="hero-actions"><a className="button button-gold" href="#paket">Jelajahi Paket <ArrowRight size={17} /></a><a className="text-link light-link" href="#tentang">Kenali Safar Wisata Madina <ArrowDown size={16} /></a></div>
      <div className="hero-note"><span className="hero-note-icon"><ShieldCheck size={19} /></span><span><strong>Mendampingi setiap langkah</strong><small>Informasi jelas, layanan terarah</small></span></div>
    </div>
    <div className="hero-bottom container"><span>PERJALANAN PENUH MAKNA</span><span>MAKKAH · MADINAH · DUNIA</span></div>
  </section>;
}

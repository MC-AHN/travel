import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';

export default function Hero() {
  return <section className="hero" id="beranda">
    <video className="hero-video" autoPlay muted loop playsInline preload="metadata"
      poster="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=2200&q=85"
      aria-hidden="true" tabIndex={-1}>
      <source src="https://videos.pexels.com/video-files/35110881/14874909_3840_2160_60fps.mp4" type="video/mp4" />
    </video>
    <div className="hero-shade" />
    <div className="hero-content container">
      <div className="eyebrow light"><span /> TEMAN PERJALANAN IBADAH ANDA</div>
      <h1>Umroh mudah,<br /><em>hati lebih tenang.</em></h1>
      <p>Persiapkan perjalanan menuju Tanah Suci bersama tim yang mendampingi Anda dari proses pendaftaran hingga kembali ke rumah.</p>
      <div className="hero-actions"><a className="button button-gold" href="#paket">Jelajahi Paket <ArrowRight size={17} /></a><a className="text-link light-link" href="#tentang">Kenali Alfajr <ArrowDown size={16} /></a></div>
      <div className="hero-note"><span className="hero-note-icon"><ShieldCheck size={19} /></span><span><strong>Mendampingi setiap langkah</strong><small>Informasi jelas, layanan terarah</small></span></div>
    </div>
    <div className="hero-bottom container"><span>PERJALANAN PENUH MAKNA</span><span>MAKKAH · MADINAH · DUNIA</span></div>
  </section>;
}

import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Check, ChevronDown, Clock3, Compass, Headset, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { getGalleryHref, getSectionHref, SectionHeading, WhatsAppLink } from '../ui/common.jsx';

export default function Footer() {
  return <footer className="footer" id="kontak">
    <div className="container footer-main">
      <div className="footer-brand">
        <a className="brand brand-light" href={getSectionHref('beranda')} aria-label="Safar Wisata Madina beranda">
          <img className="brand-symbol" src="/assets/brand/safar-wisata-madina-icon-blue.png" alt="" />
          <span className="brand-text"><strong>SAFAR</strong><small>WISATA MADINA</small></span>
        </a>
        <p>Safar Wisata Madina, teman perjalanan ibadah dan wisata Anda.</p>
        <WhatsAppLink className="footer-wa">Hubungi tim kami</WhatsAppLink>
      </div>
      <div className="footer-col">
        <h4>Jelajahi</h4>
        <a href={getSectionHref('paket')}>Paket Umrah</a>
        <a href={getSectionHref('paket')}>Paket Haji</a>
        <a href={getSectionHref('paket')}>Paket Wisata</a>
        <a href={getSectionHref('tentang')}>Tentang Kami</a>
        <a href={getGalleryHref()}>Galeri</a>
      </div>
      <div className="footer-col">
        <h4>Informasi</h4>
        <a href={getSectionHref('konsultasi')}>Hubungi Kami</a>
        <a href={getSectionHref('paket')}>Katalog Paket</a>
      </div>
      <div className="footer-col footer-contact">
        <h4>Kontak</h4>
        <p><MapPin size={16}/> Jl. Ganjaran No.51, Bernung, Kec. Gedong Tataan, Kabupaten Pesawaran, Lampung 35312, Indonesia</p>
        <p><Headset size={16}/><a href="tel:+6282375101979">+62 823-7510-1979</a></p>
        <p><Clock3 size={16}/> Senin–Sabtu, 07.00–17.00; Minggu tutup</p>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© {new Date().getFullYear()} Safar Wisata Madina</span>
      <span>Konsep rekonstruksi frontend untuk evaluasi desain.</span>
      <a href={getSectionHref('beranda')}>Kembali ke atas ↑</a>
    </div>
  </footer>;
}

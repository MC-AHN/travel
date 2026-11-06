import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const links = [['Beranda', '#beranda'], ['Layanan', '#layanan'], ['Paket', '#paket'], ['Panduan', '#panduan'], ['Tentang', '#tentang'], ['Artikel', '#artikel']];
  useEffect(() => {
    const update = () => setShowSticky(window.scrollY > 90);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  useEffect(() => { setOpen(false); }, [showSticky]);
  const renderNav = (className, active) => <nav className={`${className}${open && active ? ' is-open' : ''}`}>
    {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
    <a className="nav-cta" href="#konsultasi" onClick={() => setOpen(false)}>Konsultasi Gratis <ArrowRight size={16} /></a>
  </nav>;
  const brand = <a className="brand" href="#beranda" aria-label="Safar Wisata Madina beranda"><img className="navbar-logo" src="/assets/brand/safar-wisata-madina-logo.png" alt="Safar Wisata Madina" /></a>;
  return <>
    <header className="site-header hero-header" inert={showSticky}>
      {brand}
      <button className="mobile-menu" type="button" aria-label={open && !showSticky ? 'Tutup menu' : 'Buka menu'} aria-expanded={open && !showSticky} onClick={() => setOpen(v => !v)}>{open && !showSticky ? <X /> : <Menu />}</button>
      {renderNav('nav-links', !showSticky)}
    </header>
    <header className={`site-header sticky-header${showSticky ? ' is-visible' : ''}`} aria-hidden={!showSticky} inert={!showSticky}>
      {brand}
      <button className="mobile-menu" type="button" aria-label={open && showSticky ? 'Tutup menu' : 'Buka menu'} aria-expanded={open && showSticky} onClick={() => setOpen(v => !v)}>{open && showSticky ? <X /> : <Menu />}</button>
      {renderNav('nav-links', showSticky)}
    </header>
  </>;
}

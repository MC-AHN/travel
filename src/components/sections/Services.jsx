import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';

export default function ServiceJourney() {
  const services = [
    { n:'01', title:'Umrah', desc:'Pilihan perjalanan dengan durasi, hotel, dan fasilitas yang dapat dibandingkan.', image:'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=85', label:'IBADAH DI TANAH SUCI', href:'#paket' },
    { n:'02', title:'Haji khusus', desc:'Kenali gambaran program, proses konsultasi, dan dokumen yang perlu dipersiapkan.', image:'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=85', label:'PERJALANAN IBADAH', href:'#persiapan' },
    { n:'03', title:'Wisata halal', desc:'Perjalanan ke destinasi bersejarah dan budaya dengan agenda yang tertata.', image:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=85', label:'JELAJAH DUNIA', href:'#destinasi' },
    { n:'04', title:'Badal & layanan lain', desc:'Pelajari pilihan layanan tambahan dan konsultasikan kebutuhan secara langsung.', image:'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1000&q=85', label:'LAYANAN TAMBAHAN', href:'#konsultasi' }
  ];
  return <section className="section journey-section" id="layanan"><div className="container"><div className="section-heading journey-heading"><div><div className="eyebrow"><span/> JELAJAHI LAYANAN</div><h2>Satu tempat untuk<br/><em>merencanakan perjalanan.</em></h2><p>Mulai dari menentukan jenis perjalanan hingga memahami fasilitasnya. Temukan informasi awal yang membantu Anda memilih dengan lebih percaya diri.</p></div></div><div className="journey-grid">{services.map(s=><a href={s.href} className="journey-card" key={s.n}><div className="journey-image"><img src={s.image} alt={s.title} loading="lazy"/><span>{s.label}</span><b>{s.n}</b></div><div className="journey-card-copy"><h3>{s.title}</h3><p>{s.desc}</p><span className="journey-more">Jelajahi layanan <ArrowRight size={15}/></span></div></a>)}</div></div></section>;
}

import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';

function BusIcon(){ return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 10h16M8 19v2m8-2v2M8 6h.01M16 6h.01M7 14h.01M17 14h.01"/></svg> }

export default function InformationTiles() {
  const tiles = [
    {icon:<PlaneTakeoff/>,title:'Penerbangan',desc:'Periksa maskapai, rute, bandara keberangkatan, dan ketentuan bagasi.'},
    {icon:<Hotel/>,title:'Hotel dan kamar',desc:'Cari tahu nama hotel, jarak dari masjid, serta tipe kamar yang dipilih.'},
    {icon:<BusIcon/>,title:'Transportasi',desc:'Pastikan transportasi bandara, antarkota, dan selama ziarah tercantum.'},
    {icon:<HeartHandshake/>,title:'Pendampingan',desc:'Tanyakan pendamping perjalanan dan pembimbing ibadah dalam program.'},
    {icon:<FileText/>,title:'Dokumen',desc:'Konfirmasi persyaratan visa dan dokumen yang perlu disiapkan.'},
    {icon:<Wallet/>,title:'Rincian biaya',desc:'Bandingkan harga per tipe kamar, fasilitas yang termasuk, dan biaya tambahan.'}
  ];
  return <section className="section info-tiles-section" id="fasilitas"><div className="container"><div className="info-tiles-head"><div className="section-heading"><div className="eyebrow"><span/> SEBELUM MEMILIH PAKET</div><h2>Periksa detail sebelum<br/><em>menentukan pilihan.</em></h2><p>Bandingkan fasilitas, dokumen, dan biaya agar Anda tahu apa saja yang termasuk dalam setiap paket.</p></div></div><div className="info-tiles-grid">{tiles.map((t,i)=><article className="info-tile" key={t.title}><span className="info-tile-icon">{t.icon}</span><span className="info-tile-num">0{i+1}</span><h3>{t.title}</h3><p>{t.desc}</p></article>)}</div></div></section>;
}

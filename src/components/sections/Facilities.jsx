import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';

export default function Facilities() {
  const facilities = [ ['01', 'Tiket pesawat', 'Informasi penerbangan sesuai paket'], ['02', 'Hotel penginapan', 'Detail akomodasi di destinasi'], ['03', 'Visa perjalanan', 'Informasi pengurusan dokumen'], ['04', 'Transportasi', 'Rincian transportasi dalam program'], ['05', 'Konsumsi', 'Informasi layanan konsumsi'], ['06', 'Tour leader & muthawif', 'Pendampingan selama perjalanan'] ];
  return <section className="section facilities-section"><div className="container"><SectionHeading eyebrow="LAYANAN PERJALANAN" title={<>Kebutuhan perjalanan,<br /><em>dibahas sejak awal.</em></>} text="Rincian fasilitas berbeda menurut paket. Pastikan semua komponen dikonfirmasi sebelum melakukan pendaftaran."/><div className="facility-grid">{facilities.map(([n, title, desc]) => <div className="facility-card" key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>;
}

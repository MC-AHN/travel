import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';

export default function Benefits() {
  const benefits = [ ['01', 'Harga transparan', 'Diskusikan detail biaya dan fasilitas sebelum memilih paket.'], ['02', 'Bantuan persiapan', 'Dapatkan informasi dokumen dan kebutuhan perjalanan.'], ['03', 'Pendampingan jamaah', 'Tim perjalanan membantu mengarahkan agenda selama perjalanan.'] ];
  return <section className="benefits-section"><div className="container benefits-layout"><SectionHeading eyebrow="MENGAPA ALFAJR" title={<>Perjalanan yang direncanakan<br /><em>dengan lebih baik.</em></>} text="Kami percaya pengalaman perjalanan dimulai dari komunikasi yang baik sejak awal."/><div className="benefit-list">{benefits.map(([num, title, desc]) => <div className="benefit-row" key={num}><span className="benefit-number">{num}</span><div><h3>{title}</h3><p>{desc}</p></div><ArrowRight className="benefit-arrow" size={19} /></div>)}</div></div></section>;
}

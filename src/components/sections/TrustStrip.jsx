import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';

export default function TrustStrip() {
  const items = [
    [<ShieldCheck />, 'Legalitas Terverifikasi', 'Nomor izin PPIU: 07032300544950005.'],
    [<BookOpen />, 'Pembimbing Berpengalaman', 'Didampingi pembimbing dalam persiapan dan pelaksanaan ibadah.'],
    [<HeartHandshake />, 'Pelayanan Bersahabat', 'Pelayanan dan pendampingan yang mengutamakan kebutuhan jamaah.'],
    [<Headphones />, 'Pendampingan Menyeluruh', 'Informasi dan bantuan sejak persiapan hingga perjalanan selesai.']
  ];
  return <section className="trust-strip"><div className="container trust-grid">{items.map(([icon, title, desc]) => <div className="trust-item" key={title}><span className="trust-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span></div>)}</div></section>;
}

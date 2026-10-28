import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';

export default function TrustStrip() {
  const items = [ [<ShieldCheck />, 'Travel resmi', 'Informasi legalitas transparan'], [<Headphones />, 'Layanan terarah', 'Dibantu sebelum berangkat'], [<Compass />, 'Pilihan perjalanan', 'Paket sesuai kebutuhan'], [<Users />, 'Pendamping jamaah', 'Tim selama perjalanan'] ];
  return <section className="trust-strip"><div className="container trust-grid">{items.map(([icon, title, desc]) => <div className="trust-item" key={title}><span className="trust-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span></div>)}</div></section>;
}

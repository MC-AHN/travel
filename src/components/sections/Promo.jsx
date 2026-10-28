import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';
import { WA_NUMBER } from '../ui/common.jsx';

export default function Promo() {
  return <section className="promo-section"><div className="container promo-card"><div className="promo-image"/><div className="promo-content"><div className="eyebrow light"><span /> MULAI RENCANAKAN PERJALANAN</div><h2>Niat baik Anda,<br /><em>langkah pertama dimulai hari ini.</em></h2><p>Konsultasikan jadwal, fasilitas, dan pilihan paket bersama tim Alfajr.</p><WhatsAppLink className="button button-gold">Tanya pilihan paket</WhatsAppLink></div></div></section>;
}

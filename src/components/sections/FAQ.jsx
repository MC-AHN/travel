import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Headphones, MapPin, Menu, Plane, ShieldCheck, Star, Users, X, CalendarDays, BookOpen, Building2, CircleHelp, Globe2, HeartHandshake, Hotel, Luggage, MessageCircle, PlaneTakeoff, Wallet, MapPinned, BadgeCheck, ChevronRight, FileText, Landmark, CircleCheck, Info, Plus, Minus } from 'lucide-react';
import { SectionHeading, WhatsAppLink } from '../ui/common.jsx';
import { WA_NUMBER } from '../ui/common.jsx';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    ['Apa yang perlu dibandingkan saat memilih paket umrah?','Perhatikan tanggal keberangkatan, durasi, maskapai, hotel, konfigurasi kamar, fasilitas yang termasuk, biaya di luar paket, serta ketentuan pembayaran dan pembatalan.'],
    ['Apa perbedaan harga Double, Triple, dan Quad?','Kategori ini menjelaskan jumlah orang dalam satu kamar. Harga per orang dapat berbeda menurut paket dan ketersediaan; mintalah rincian tertulis sebelum mendaftar.'],
    ['Apakah semua fasilitas berlaku untuk setiap paket?','Tidak selalu. Fasilitas perlu dibaca berdasarkan rincian paket tertentu, bukan hanya daftar fasilitas umum di website.'],
    ['Kapan sebaiknya mulai menyiapkan dokumen?','Mulailah setelah memperoleh panduan persyaratan dari penyelenggara dan otoritas terkait. Jadwal serta dokumen yang dibutuhkan harus dikonfirmasi untuk perjalanan yang dipilih.'],
    ['Bagaimana cara memastikan informasi paket terbaru?','Hubungi tim resmi dan minta konfirmasi tertulis mengenai harga, tanggal, hotel, maskapai, ketersediaan kursi, fasilitas, dan ketentuan perubahan.']
  ];
  return <section className="section faq-section" id="faq"><div className="container faq-layout"><div className="faq-aside"><div className="eyebrow"><span/> PERTANYAAN UMUM</div><h2>Hal yang sering<br/><em>ingin diketahui.</em></h2><p>Jawaban ringkas untuk membantu calon jamaah memulai pencarian informasi.</p><div className="faq-help"><span><CircleHelp size={21}/></span><div><strong>Masih ada pertanyaan?</strong><small>Tim kami dapat membantu menjelaskan pilihan paket.</small><WhatsAppLink className="faq-wa">Tanya melalui WhatsApp <ArrowRight size={14}/></WhatsAppLink></div></div></div><div className="faq-list">{items.map(([q,a],i)=><div className={`faq-item ${open===i?'is-open':''}`} key={q}><button className="faq-question" onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span><small>0{i+1}</small>{q}</span>{open===i?<Minus size={18}/>:<Plus size={18}/>}</button>{open===i&&<div className="faq-answer"><p>{a}</p></div>}</div>)}</div></div></section>;
}

import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function Preparation() {
  const steps = [
    ['01', 'Konsultasi', 'Sampaikan rencana perjalanan, kebutuhan, dan anggaran agar tim dapat membantu menemukan program yang sesuai.'],
    ['02', 'Pilih Paket Umrah', 'Tentukan paket berdasarkan jadwal keberangkatan, fasilitas, hotel, maskapai, dan tipe kamar.'],
    ['03', 'Lengkapi Persyaratan', 'Siapkan dokumen perjalanan sesuai persyaratan dan ikuti arahan tim untuk proses administrasi.'],
    ['04', 'Manasik dan Persiapan', 'Ikuti bimbingan manasik serta pengarahan mengenai tata cara ibadah dan teknis perjalanan sebelum keberangkatan.'],
    ['05', 'Keberangkatan', 'Ikuti arahan tim pendamping dan koordinator selama proses keberangkatan menuju Tanah Suci.']
  ];
  return <section className="section preparation-section" id="persiapan"><div className="container prep-layout"><div className="prep-copy"><div className="eyebrow"><span/> LANGKAH PENDAFTARAN</div><h2>Setiap perjalanan dimulai dengan <em>persiapan yang terarah.</em></h2><p>Dari konsultasi awal hingga waktu keberangkatan, tim Safar Wisata Madina siap membantu jamaah memahami setiap tahapan perjalanan.</p><div className="prep-image"><img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1100&q=85" alt="Perjalanan dengan pesawat" loading="lazy"/><span><BookOpen size={17}/> Tahapan menuju keberangkatan</span></div></div><div className="prep-steps">{steps.map(([n,t,d])=><div className="prep-step" key={n}><div className="prep-step-num">{n}</div><div><h3>{t}</h3><p>{d}</p></div><ChevronRight size={18}/></div>)}</div></div></section>;
}

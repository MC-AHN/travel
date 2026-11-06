import React, { useRef, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Check, Hotel, Wallet } from 'lucide-react';

export default function PackageGuide() {
  const [active, setActive] = useState('budget');
  const tabsRef = useRef(null);
  const tabs = [['budget', 'Anggaran'], ['comfort', 'Kenyamanan'], ['schedule', 'Jadwal']];
  const guides = {
    budget: {
      points: [
        'Bandingkan harga berdasarkan tipe kamar yang tersedia, seperti quad, triple, atau double, serta nama hotelnya.',
        'Periksa fasilitas yang sudah termasuk dan biaya tambahan seperti paspor, vaksin, atau kelebihan bagasi.',
        'Pastikan rincian uang muka, jadwal pembayaran, pelunasan, dan ketentuan pembatalan.'
      ],
      icon: <Wallet />
    },
    comfort: {
      points: [
        'Periksa maskapai, rute, bandara keberangkatan, dan ketentuan bagasi.',
        'Cari tahu lokasi hotel, jarak atau waktu tempuh ke masjid, serta tipe kamar yang dipilih.',
        'Pastikan transportasi bandara, antarkota, dan ziarah, juga pendamping perjalanan serta pembimbing ibadah.',
        'Sesuaikan durasi perjalanan dan ritme kegiatan dengan kebutuhan jamaah.'
      ],
      icon: <Hotel />
    },
    schedule: {
      points: [
        'Konfirmasi persyaratan visa dan dokumen, lalu siapkan waktu untuk proses administrasinya.',
        'Cocokkan tanggal keberangkatan dan kepulangan dengan jadwal cuti serta waktu persiapan.',
        'Atur kebutuhan keluarga dan pastikan rencana perjalanan siap bagi semua yang terdampak.'
      ],
      icon: <CalendarDays />
    }
  };
  const item = guides[active];
  const handleTabKeyDown = (event) => {
    const currentIndex = tabs.findIndex(([id]) => id === active);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    const [nextId] = tabs[nextIndex];
    setActive(nextId);
    tabsRef.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };
  return <section className="section guide-section" id="panduan"><div className="container"><div className="guide-layout"><div className="guide-visual"><img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1300&q=85" alt="Suasana Masjid Nabawi" loading="lazy"/><div className="guide-note"><span className="guide-note-icon"><BookOpen size={20}/></span><span><strong>Panduan memilih paket</strong><small>3 hal yang layak dibandingkan</small></span></div><div className="guide-vertical">PERSIAPAN YANG LEBIH TERARAH</div></div><div className="guide-content"><div className="eyebrow"><span/> BANTUAN MEMILIH</div><h2>Paket yang tepat bukan hanya soal harga.</h2><p className="guide-lead">Gunakan panduan ini untuk menentukan prioritas, lalu bandingkan fasilitas, dokumen, dan biaya yang termasuk dalam setiap paket.</p><div className="guide-tabs" ref={tabsRef} role="tablist" aria-label="Panduan memilih paket" onKeyDown={handleTabKeyDown}>{tabs.map(([id,label])=><button key={id} id={`guide-tab-${id}`} type="button" role="tab" aria-selected={active===id} aria-controls="guide-tab-panel" tabIndex={active===id?0:-1} onClick={()=>setActive(id)} className={active===id?'guide-tab active':'guide-tab'}>{label}</button>)}</div><div className="guide-detail" id="guide-tab-panel" role="tabpanel" aria-labelledby={`guide-tab-${active}`} key={active}><div className="guide-detail-icon" aria-hidden="true">{item.icon}</div><ul>{item.points.map(p=><li key={p}><Check size={16}/>{p}</li>)}</ul></div><a className="button button-primary" href="#konsultasi">Diskusikan kebutuhan <ArrowRight size={16}/></a></div></div></div></section>;
}

import React from 'react';
import { SectionHeading } from '../ui/common.jsx';

export default function Facilities() {
  const facilities = [
    ['01', 'Akomodasi', 'Hotel di Makkah dan Madinah tercantum dalam paket. Nama hotel dan ketentuannya mengikuti program yang dipilih.'],
    ['02', 'Konsumsi', 'Rincian makan dan minum belum tercantum pada data paket yang tersedia. Pastikan detailnya kepada tim sebelum mendaftar.'],
    ['03', 'Transportasi', 'Bus dan city tour tercantum dalam paket. Rute dan jadwal mengikuti itinerary masing-masing program.'],
    ['04', 'Pembimbing', 'Tour leader dan mutawif tercantum sebagai bagian dari paket perjalanan.'],
    ['05', 'Administrasi', 'Visa termasuk dalam paket. Paspor dan vaksin tercantum sebagai biaya yang tidak termasuk.'],
    ['06', 'Perlengkapan', 'Perlengkapan umrah dan asuransi tercantum dalam fasilitas paket.']
  ];
  return <section className="section facilities-section"><div className="container"><SectionHeading eyebrow="RINGKASAN FASILITAS" title={<>Fasilitas dan Layanan<br /><em>Jamaah.</em></>} text="Ringkasan ini mengacu pada poster paket yang tersedia. Fasilitas dan ketentuan dapat berbeda; cocokkan kembali dengan paket pilihan sebelum mendaftar."/><div className="facility-grid">{facilities.map(([n, title, desc]) => <div className="facility-card" key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>;
}

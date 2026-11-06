import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/common.jsx';

export default function Benefits() {
  const benefits = [
    ['01', 'Amanah', 'Informasi layanan dan biaya disampaikan dengan jelas untuk membantu jamaah mengambil keputusan.'],
    ['02', 'Pendampingan', 'Jamaah didampingi sejak persiapan, keberangkatan, hingga perjalanan ibadah selesai.'],
    ['03', 'Pembimbing berpengalaman', 'Bimbingan ibadah diberikan oleh pembimbing yang berpengalaman mendampingi jamaah.'],
    ['04', 'Kemudahan', 'Informasi dan bantuan perjalanan disiapkan agar proses umrah terasa lebih mudah.']
  ];
  return <section className="benefits-section"><div className="container benefits-layout"><SectionHeading eyebrow="KEUNGGULAN SAFAR WISATA MADINA" title={<>Menemani perjalanan ibadah<br /><em>dengan sepenuh hati.</em></>} text="Amanah, pendampingan, pembimbing, dan kemudahan menjadi bagian dari layanan kami untuk jamaah."/><div className="benefit-list">{benefits.map(([num, title, desc]) => <div className="benefit-row" key={num}><span className="benefit-number">{num}</span><div><h3>{title}</h3><p>{desc}</p></div><ArrowRight className="benefit-arrow" size={19} /></div>)}</div></div></section>;
}

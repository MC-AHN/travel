import React from 'react';
import { ArrowRight } from 'lucide-react';

export const WA_NUMBER = '6282328749564'; // Ganti jika nomor layanan yang digunakan berbeda.

export function WhatsAppLink({ children = 'Konsultasi via WhatsApp', className = 'button button-primary', showArrow = true }) {
  const message = encodeURIComponent('Assalamu’alaikum, saya ingin bertanya tentang paket perjalanan Alfajr.');
  return <a className={className} href={`https://wa.me/${WA_NUMBER}?text=${message}`} target="_blank" rel="noreferrer">{children}{showArrow && <ArrowRight size={17} />}</a>;
}

export function SectionHeading({ eyebrow, title, text, center = false }) {
  return <div className={`section-heading ${center ? 'center' : ''}`}><div className="eyebrow"><span />{eyebrow}</div><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

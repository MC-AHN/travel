import React from 'react';
import { ArrowRight } from 'lucide-react';

export const WA_NUMBER = '6282375101979';

export function isGalleryPage() {
  return /\/galeri\/?$/.test(window.location.pathname)
    || new URLSearchParams(window.location.search).get('page') === 'galeri';
}

export function getSiteBasePath() {
  const pathname = window.location.pathname;
  const galleryPath = pathname.match(/^(.*\/)galeri\/?$/);
  if (galleryPath) return galleryPath[1] || '/';
  if (pathname.endsWith('/index.html')) return pathname.slice(0, -'index.html'.length) || '/';
  if (pathname.endsWith('/')) return pathname;
  return pathname.slice(0, pathname.lastIndexOf('/') + 1) || '/';
}

export function getGalleryHref() {
  return `${getSiteBasePath()}galeri`;
}

export function getSectionHref(section) {
  return `${isGalleryPage() ? getSiteBasePath() : ''}#${section}`;
}

export function WhatsAppLink({ children = 'Konsultasi via WhatsApp', className = 'button button-primary', showArrow = true, message = 'Assalamu’alaikum, saya ingin bertanya tentang paket perjalanan Safar Wisata Madina.' }) {
  const encodedMessage = encodeURIComponent(message);
  return <a className={className} href={`https://wa.me/${WA_NUMBER}?text=${encodedMessage}`} target="_blank" rel="noreferrer">{children}{showArrow && <ArrowRight size={17} />}</a>;
}

export function SectionHeading({ eyebrow, title, text, center = false }) {
  return <div className={`section-heading ${center ? 'center' : ''}`}><div className="eyebrow"><span />{eyebrow}</div><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

const articles = [
  {
    tag: 'PERSIAPAN',
    title: 'Checklist persiapan sebelum berangkat umrah',
    desc: 'Susun kebutuhan perjalanan dengan urutan yang mudah dipahami.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    time: '6 menit baca',
    introduction: 'Persiapan yang teratur membantu Anda berangkat dengan lebih tenang. Mulailah dari hal yang perlu dikonfirmasi, lalu siapkan kebutuhan pribadi sesuai program perjalanan.',
    sections: [
      {
        heading: 'Pastikan informasi perjalanan',
        paragraphs: ['Simpan jadwal keberangkatan, tiket atau informasi penerbangan, alamat hotel, dan nomor kontak pendamping dalam satu tempat yang mudah diakses. Tanyakan kepada penyelenggara bila ada informasi yang belum jelas atau berubah.']
      },
      {
        heading: 'Siapkan dokumen dan kebutuhan pribadi',
        paragraphs: ['Periksa dokumen perjalanan dan persyaratan yang disampaikan penyelenggara. Siapkan juga obat pribadi, pakaian dan perlengkapan ibadah, serta barang penting lain sesuai kebutuhan Anda.'],
        points: ['Gunakan daftar periksa agar tidak ada kebutuhan penting yang tertinggal.', 'Simpan dokumen penting secara aman dan siapkan salinan bila disarankan penyelenggara.', 'Tanyakan ketentuan bagasi serta barang yang boleh dibawa sebelum berkemas.']
      },
      {
        heading: 'Konfirmasi sebelum hari keberangkatan',
        paragraphs: ['Beberapa hari sebelum berangkat, pastikan kembali waktu berkumpul, lokasi keberangkatan, pembagian kamar, dan kontak yang dapat dihubungi. Ikuti informasi terbaru dari penyelenggara perjalanan Anda.']
      }
    ]
  },
  {
    tag: 'PANDUAN PAKET',
    title: 'Memahami rincian harga dan fasilitas perjalanan',
    desc: 'Hal-hal yang perlu dibaca sebelum membandingkan dua paket.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    time: '4 menit baca',
    introduction: 'Harga saja belum cukup untuk membandingkan paket. Periksa rincian program secara menyeluruh agar Anda memahami layanan yang didapat dan hal-hal yang perlu dipersiapkan sendiri.',
    sections: [
      {
        heading: 'Bandingkan fasilitas secara tertulis',
        paragraphs: ['Periksa informasi penerbangan, transportasi, hotel, konsumsi, pendampingan, dan agenda perjalanan yang tercantum. Pastikan rincian tersebut berlaku untuk tanggal dan program yang sedang Anda pertimbangkan.']
      },
      {
        heading: 'Perhatikan tipe kamar dan biaya tambahan',
        paragraphs: ['Harga dapat berbeda berdasarkan tipe kamar atau ketentuan program. Tanyakan apa saja yang sudah termasuk, biaya yang dibayar terpisah, jadwal pembayaran, serta ketentuan perubahan dan pembatalan.']
      },
      {
        heading: 'Minta penjelasan bila ada yang belum jelas',
        paragraphs: ['Sebelum mengambil keputusan, mintalah rincian terbaru dalam bentuk tertulis dan bandingkan hal yang sama antarpaket. Informasi harga, fasilitas, dan ketersediaan dapat berubah, jadi konfirmasikan langsung kepada penyelenggara.']
      }
    ]
  },
  {
    tag: 'DESTINASI',
    title: 'Mengenal tempat penting di Makkah dan Madinah',
    desc: 'Gambaran awal destinasi untuk membantu merencanakan perjalanan.',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    time: '7 menit baca',
    introduction: 'Makkah dan Madinah memiliki suasana serta rangkaian kunjungan yang berbeda. Memahami gambaran perjalanan sejak awal dapat membantu Anda menyiapkan waktu, tenaga, dan kebutuhan pribadi.',
    sections: [
      {
        heading: 'Pahami susunan perjalanan',
        paragraphs: ['Baca itinerary untuk mengetahui urutan kota, waktu perjalanan, dan agenda yang direncanakan. Jadwal dan lokasi kunjungan dapat berbeda menurut paket, kondisi setempat, serta kebijakan yang berlaku.']
      },
      {
        heading: 'Siapkan diri untuk aktivitas perjalanan',
        paragraphs: ['Diskusikan kebutuhan khusus, kondisi kesehatan, atau keterbatasan mobilitas dengan penyelenggara sebelum berangkat. Tanyakan juga durasi kegiatan, transportasi yang tersedia, dan perlengkapan yang disarankan.']
      },
      {
        heading: 'Ikuti arahan pendamping dan aturan setempat',
        paragraphs: ['Selama perjalanan, ikuti informasi dari pendamping dan patuhi aturan di setiap lokasi. Untuk detail terbaru mengenai akses, ketentuan kunjungan, atau tata cara ibadah, mintalah arahan dari pembimbing dan pihak berwenang.']
      }
    ]
  }
];

function ArticleDetail({ article, onClose }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault();
        focusable[0].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return <div className="article-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <article className="article-detail-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="article-detail-title" tabIndex={-1}>
      <button ref={closeRef} type="button" className="article-detail-close" onClick={onClose} aria-label="Tutup artikel">×</button>
      <div className="article-detail-media"><img className="article-detail-image" src={article.image} alt="" /></div>
      <div className="article-detail-content">
        <div className="eyebrow"><span />{article.tag}</div>
        <h2 id="article-detail-title">{article.title}</h2>
        <div className="article-detail-meta"><BookOpen size={15} />{article.time}</div>
        <p className="article-detail-intro">{article.introduction}</p>
        {article.sections.map(section => <section className="article-detail-section" key={section.heading}>
          <h3>{section.heading}</h3>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
        </section>)}
        <p className="article-detail-note">Informasi program dapat berubah. Konfirmasikan rincian terbaru kepada penyelenggara perjalanan sebelum mendaftar.</p>
        <a className="button button-primary" href="#konsultasi" onClick={onClose}>Tanyakan kepada tim Alfajr <ArrowRight size={16} /></a>
      </div>
    </article>
  </div>;
}

export default function Editorial() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const closeArticle = () => setSelectedArticle(null);

  return <section className="section editorial-section" id="artikel"><div className="container">
    <div className="editorial-head">
      <div className="section-heading">
        <div className="eyebrow"><span/> JURNAL PERJALANAN</div>
        <h2>Bekal informasi sebelum<br/><em>melangkah lebih jauh.</em></h2>
        <p>Panduan praktis untuk membantu Anda menyiapkan perjalanan dan memahami pilihan paket.</p>
      </div>
      <a className="text-link" href="#konsultasi">Minta panduan dari tim <ArrowRight size={16}/></a>
    </div>
    <div className="editorial-grid">{articles.map((article, index) => <article className="article-card" key={article.title}>
      <button type="button" className="article-image" onClick={() => setSelectedArticle(article)} aria-label={`Baca artikel: ${article.title}`}>
        <img src={article.image} alt="" loading="lazy"/><span>{article.tag}</span><b>0{index + 1}</b>
      </button>
      <div className="article-copy">
        <div className="article-meta"><span><BookOpen size={13}/>{article.time}</span><span>Alfajr Journal</span></div>
        <h3><button type="button" className="article-title-button" onClick={() => setSelectedArticle(article)}>{article.title}</button></h3>
        <p>{article.desc}</p>
        <button type="button" className="article-more" onClick={() => setSelectedArticle(article)}>Baca artikel <ArrowRight size={15}/></button>
      </div>
    </article>)}</div>
    {selectedArticle && <ArticleDetail article={selectedArticle} onClose={closeArticle} />}
  </div></section>;
}


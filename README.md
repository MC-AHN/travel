# Alfajr × Jejak Imani × Ghufran — Homepage Design Prototype

Frontend prototype using React + Vite + CSS. The direction combines a premium, photo-led travel design with clear, structured package information and an editorial style that balances text, imagery, timelines, comparison cards, FAQs, and practical guidance.

This is a design prototype/reconstruction, not the original source code of the referenced websites and not affiliated with them. It uses dummy/sample content for layout exploration.

## Run locally

Requirements: Node.js 18+ recommended.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Main files

- `src/App.jsx` — homepage sections and interactions: mobile navigation, package filtering/detail modal, interactive package-selection guide, itinerary, FAQ, and WhatsApp CTAs.
- `src/styles.css` — responsive design, layouts, image-led sections, cards, timelines, and mobile styles.
- `src/data.js` — sample package and testimonial data.
- `index.html` — document metadata and fonts.

## Included homepage sections

1. Sticky navigation and visual hero
2. Trust strip
3. Service categories
4. Filterable package catalogue with detail modal
5. Destination photo collage
6. Company profile and service benefits
7. Interactive guide for choosing a package
8. Quick visual tiles for flight, hotel, transport, documents, and costs
9. Visual itinerary timeline
10. Facilities overview
11. Preparation steps
12. Testimonials carousel
13. Editorial/article cards
14. Interactive FAQ
15. Consultation CTA and footer

## Before publishing

- Replace all dummy package information, prices, dates, hotel/airline details, itinerary, seat counts, and sample testimonials with verified and approved data.
- Verify the WhatsApp number in `src/App.jsx` and change `WA_NUMBER` if needed.
- Replace remote Unsplash images with approved company-owned/licensed assets.
- Add separate routes and backend integrations if needed. This prototype is primarily a homepage design, not a booking/payment system.

The prototype uses external image URLs and Google Fonts, so those assets require an internet connection.

## Deploy to GitHub Pages

The `main` branch is deployed automatically with GitHub Actions. Vite uses relative asset paths so the same build works on GitHub Pages at `/travel/` and on root-domain hosts such as Vercel. The workflow builds the site into `dist/` and publishes that directory.

## Revisi V4 — fondasi tipografi dan cerita jamaah
- Menambah skala tipografi yang lebih mudah dibaca pada navigasi, paragraf, kartu informasi, detail paket, FAQ, artikel, dan tombol.
- Menstabilkan tinggi section Cerita Jamaah dan kotak kutipan agar perpindahan testimoni tidak membuat latar hijau berubah tinggi.
- Kutipan panjang dibatasi hingga lima baris pada kartu untuk menjaga konsistensi layout.
- Hero masih menggunakan gambar pada V4. Penggantian menjadi video latar penuh akan dikerjakan pada tahap berikutnya setelah evaluasi revisi ini.
- Build belum diverifikasi karena dependensi proyek belum terpasang di lingkungan ini. Arsip ZIP telah diuji integritasnya.

## Revisi V5 — video hero dan tipografi
- Hero sekarang memakai video latar lebar penuh dengan teks dan CTA di atasnya.
- Video berjalan tanpa suara, berulang, dan memiliki tombol jeda/putar.
- Poster gambar digunakan sebagai fallback visual; preferensi `prefers-reduced-motion` juga dihormati.
- Skala tipografi dinaikkan agar isi, navigasi, tombol, dan kartu lebih mudah dibaca pada desktop maupun mobile.
- Footage contoh berasal dari Pexels: https://www.pexels.com/video/aerial-view-of-kaaba-and-grand-mosque-in-mecca-35110881/ . Untuk produksi, sebaiknya unduh/siapkan versi MP4 1080p terkompresi dan host di folder `public/videos/` agar performa lebih terkontrol.

## Revisi V10
- Background halaman mengikuti ritme visual yang konsisten: foto/video, hijau tua, lalu abu-abu hangat, berulang pada section utama.
- Background foto pada bagian paket berada di dalam section dan bergerak normal bersama halaman (bukan `background-attachment: fixed`).
- Warna teks dan kartu pada section hijau tua disesuaikan agar kontras tetap jelas.


## Struktur komponen modular (V16)

Setiap section halaman kini berada pada file JSX tersendiri di `src/components/sections/`, sedangkan navigasi dan footer berada di `src/components/layout/`. Komponen bersama `WhatsAppLink`, `SectionHeading`, dan konstanta nomor WhatsApp berada di `src/components/ui/common.jsx`. `src/App.jsx` hanya menyusun urutan komponen halaman.

CSS asli tetap berada di `src/styles.css` dan diimpor melalui entry point yang sudah ada, agar pemisahan struktur React tidak mengubah tampilan atau cascade styling. Data contoh tetap berada di `src/data.js`.

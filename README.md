# Alfajr × Jejak Imani × Ghufran — Homepage Design Prototype

Frontend prototype using React + Vite + CSS. The direction combines a premium, photo-led travel design with clear, structured package information and an editorial style that balances text, imagery, timelines, comparison cards, FAQs, and practical guidance.

This is a design prototype/reconstruction, not the original source code of the referenced websites and not affiliated with them. It uses dummy/sample content for layout exploration.

## Run locally

Requirements: Node.js 22.12+ (Node 22 LTS).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Local API scaffold

The Node.js API uses MySQL/MariaDB. Create a local database, copy `.env.example` to `.env`, and set the database connection values. Apply the migrations in order:

```bash
mysql -h 127.0.0.1 -u safar_app -p safar_registration < server/migrations/001_create_registration_drafts.sql
mysql -h 127.0.0.1 -u safar_app -p safar_registration < server/migrations/002_create_registration_payments.sql
```

For frontend hot reload during development, start the API and frontend in separate terminals:

```bash
npm run dev:api
npm run dev
```

Vite proxies `/api` requests to the local API server. The API supports saving and restoring a registration draft with a 24-hour, HttpOnly cookie, creating DOKU Checkout sessions, and applying signed successful-payment notifications idempotently. Enable persistence in a local `.env` with `VITE_REGISTRATION_API_ENABLED=true` to test the form.

To test the complete site locally on a single server, set `VITE_REGISTRATION_API_ENABLED=true` in `.env`, then run:

```bash
npm start
```

`npm start` automatically builds the frontend, sets production mode, and starts one Node.js server that serves both `dist/` and `/api` from the same origin. Open the URL printed by the server (by default `http://localhost:3001/`). On the Node.js host, configure the same production environment and use `server/index.js` as the startup file.

Set DOKU credentials only in the server environment. `DOKU_MODE` defaults to `sandbox`; leave `PUBLIC_APP_URL` empty during local draft/database work. DOKU payments stay disabled until it is set to the public HTTPS site origin. An invalid or missing URL does not prevent the local draft API from starting. DOKU checkout is restricted to bank Virtual Accounts only; cards, e-wallets, QRIS, and minimarket channels are excluded. The default list contains the documented bank VA methods. If DOKU has activated only some channels for the merchant account, set `DOKU_PAYMENT_METHOD_TYPES` to a comma-separated subset of those bank VA codes. Configure the DOKU Back Office notification URL as `https://<your-domain>/api/webhooks/doku` after the API is publicly deployed. Full payment can be enabled before the DP rule is decided; DP checkout remains unavailable until both `PAYMENT_DP_POLICY` (`percentage` or `fixed_per_traveler`) and `PAYMENT_DP_VALUE` are set. No payment setup is enabled by the example environment.

Payment endpoints are now available, but the live MySQL schema, DOKU merchant account, and real sandbox-to-production flow still need testing. Admin notifications and the admin dashboard are not implemented yet.

## Deploy to Vercel

The `vercel.json` configuration builds the Vite frontend into `dist/` and rewrites the `/daftar` and `/galeri` routes to the single-page app entry point. The `api/` directory contains a Vercel health-check function. The MySQL registration API currently runs in `server/` for the planned all-in-one JetOrbit deployment.

To deploy the frontend to Vercel, import this Git repository and use the repository root as the project root. Vercel will use `npm run build` and `dist/` from `vercel.json`. The existing GitHub Pages workflow remains unchanged. The MySQL registration and payment API in `server/` is intended for the planned all-in-one JetOrbit deployment; the current Vercel config does not deploy that API.

## Main files

- `src/App.jsx` — homepage sections and interactions: mobile navigation, package filtering/detail modal, interactive package-selection guide, itinerary, FAQ, and WhatsApp CTAs.
- `src/styles.css` — responsive design, layouts, image-led sections, cards, timelines, and mobile styles.
- `src/data.js` — package details transcribed from the promotional artwork in `public/assets/packages/`, plus testimonial content.
- `index.html` — document metadata and fonts.

## Included homepage sections

1. Sticky navigation and visual hero
2. Trust strip
3. Service categories
4. Filterable package catalogue with detail modal
5. Safar Wisata Madina journey editorial with original jamaah documentation
6. Safar Wisata Madina company profile
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

- Confirm package dates, prices, hotels, inclusions, and exclusions against current company-approved materials before publishing.
- Replace sample testimonials with verified and approved jamaah feedback.
- Confirm the editorial vision wording and verify the PPIU licensing timeline against company-approved documents before publishing.
- Verify the WhatsApp number in `src/App.jsx` and change `WA_NUMBER` if needed.
- Replace remaining remote Unsplash images with approved company-owned/licensed assets.
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

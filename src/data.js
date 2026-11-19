// Package and hotel information transcribed from the promotional artwork in public/assets/packages.
export const packages = [
  {
    id: 1,
    category: 'Umrah',
    tag: 'Start Palembang',
    title: 'Umrah Awal Tahun + City Tour Malaysia',
    date: '30 Desember 2026',
    duration: '10 hari',
    departure: 'Palembang',
    makkah: 'Waha Deafa*** / setaraf',
    madinah: 'Arkan Golden*** / setaraf',
    airline: 'AirAsia',
    price: 'Rp29.000.000',
    image: '/assets/packages/umrah-malaysia-palembang-2026-12-30-10-hari-rp29-juta.jpeg',
    highlight: 'Gratis Al Baik & Museum Wahyu',
    included: ['Tiket pesawat pulang-pergi', 'Hotel Makkah dan Madinah', 'Visa dan bus', 'City tour Makkah dan Madinah', 'City tour Malaysia', 'Tour leader dan mutawif', 'Perlengkapan', 'Asuransi'],
    excluded: ['Paspor', 'Vaksin', 'Kelebihan bagasi']
  },
  {
    id: 2,
    category: 'Umrah',
    tag: 'Start Lampung',
    title: 'Umrah Awal Tahun + City Tour Malaysia',
    date: '29 Desember 2026',
    duration: '11 hari',
    departure: 'Lampung',
    makkah: 'Waha Deafa*** / setaraf',
    madinah: 'Arkan Golden*** / setaraf',
    airline: 'AirAsia',
    price: 'Rp29.500.000',
    image: '/assets/packages/umrah-malaysia-lampung-2026-12-29-11-hari-rp29-5-juta.jpeg',
    highlight: 'Gratis Al Baik & Museum Wahyu',
    included: ['Tiket pesawat pulang-pergi', 'Hotel Makkah, Madinah, dan Palembang', 'Visa dan bus', 'City tour Makkah dan Madinah', 'City tour Malaysia', 'Tour leader dan mutawif', 'Perlengkapan', 'Asuransi'],
    excluded: ['Paspor', 'Vaksin', 'Kelebihan bagasi']
  },
  {
    id: 3,
    category: 'Umrah',
    tag: 'Ramadhan 1448 H',
    title: 'Umrah Full Ramadan',
    date: '10 Februari - 16 Maret 2027',
    duration: '30 hari',
    departure: 'Lampung',
    makkah: 'Jawharat Al Hashimiah (shuttle) / setara',
    madinah: 'Riwa Al Fakhama / setara',
    airline: 'Oman Air / Saudia / AirAsia / IndiGo',
    price: 'Rp39.000.000',
    image: '/assets/packages/umrah-full-ramadhan-lampung-2027-30-hari-rp39-juta.jpeg',
    highlight: 'Bonus Syawal',
    included: ['Tiket pesawat domestik dan internasional', 'Hotel tipe quad/quin', 'City tour Makkah dan Madinah', 'Visa, tasreh, dan Siskopatuh', 'Sahur dan berbuka', 'Tour leader dan mutawif', 'Air Zamzam 5 liter', 'Handling', 'Perlengkapan', 'Asuransi perjalanan'],
    excluded: []
  },
  {
    id: 4,
    category: 'Hotel',
    tag: 'Hotel Umrah',
    title: 'Booking Hotel Makkah & Madinah',
    period: 'November - Januari (tahun tidak tercantum)',
    departure: 'Makkah & Madinah',
    image: '/assets/packages/hotel-allotment-umrah-makkah-madinah.jpeg',
    highlight: 'Pilihan hotel allotment sesuai daftar pada poster.',
    hotelGroups: [
      {
        city: 'Makkah',
        hotels: [
          { name: 'Olayan Al Haram', rate: '460', meal: 'Meal 45' },
          { name: 'Diyafa Mubarak', rate: '440', meal: 'Meal 40' },
          { name: 'Nada Deafa', rate: '440', meal: 'Meal 40' },
          { name: 'Rawabi Zamzam', rate: '320', meal: 'Meal 40' },
          { name: 'Sunrise', rate: '320', meal: 'Meal 40' },
          { name: 'Snood', rate: '470', meal: 'Meal 45' },
          { name: 'Barokah Mawaddah / Etaf Deamon', rate: '440', meal: 'Meal 40' },
          { name: 'Waha Deaafah', rate: '240 (room only)', meal: 'Meal 35' },
          { name: 'Risalah Hotel', rate: '215', meal: 'Meal 35' },
          { name: 'Villa Hilton', rate: '165 / bed', meal: 'Bed only' },
          { name: 'Safwa', rate: '985', meal: 'Double BB' },
          { name: 'Hotel Dhuyuf Samping Sohada', rate: '395', meal: 'Meal 40' },
          { name: 'Orient Aziziyah', rate: '72', meal: 'Meal 30' }
        ]
      },
      {
        city: 'Madinah',
        hotels: [
          { name: 'Royal Medinah', rate: '420', meal: 'Meal 40' },
          { name: 'Arkan Golden Room', rate: '420', meal: 'Meal 40' },
          { name: 'Arkan Golden Suite', rate: '350', meal: 'Meal 40' },
          { name: 'Royal Andlaus', rate: '470', meal: 'Meal 45' },
          { name: 'Taiba Suite', rate: '170 / bed', meal: 'Full board' },
          { name: 'Jauharat Rasyid', rate: '420', meal: 'Meal 40' },
          { name: 'Grand Plaza', rate: '620', meal: 'Meal 65' },
          { name: 'Dallah Taiba', rate: '890 (quad)', meal: 'Meal 80' }
        ]
      }
    ],
    services: ['Hotel', 'Visa', 'Transportasi', 'Makanan', 'Handling Makkah-Madinah'],
    contact: '0823-7510-1979',
    note: 'Poster menyebut harga setelah naik 30%. Mata uang dan satuan harga tidak tercantum. Poster juga menyebut 20 hotel, sementara daftar rinci berisi 13 hotel Makkah dan 8 hotel Madinah. Konfirmasikan harga serta ketersediaan terbaru sebelum booking.'
  }
];

export const testimonials = [
  { quote: 'Dari proses pendaftaran sampai keberangkatan sangat dimudahkan. Tour leader dan muthawif membantu perjalanan terasa nyaman.', name: 'Betty A.', meta: 'Jamaah umrah' },
  { quote: 'Pelayanan ramah, informasi mudah dipahami, dan pendampingan selama perjalanan sangat membantu.', name: 'Hanik R.', meta: 'Jamaah umrah' },
  { quote: 'Perjalanan berkesan dengan pendamping yang sabar dan perhatian terhadap kebutuhan jamaah.', name: 'Lathifah S.', meta: 'Jamaah umrah' }
];

// NusaData — data statistik Indonesia.
// Angka di bawah ini angka nyata dari publikasi resmi, masing-masing diberi
// sumber dan tahun. Sumber utama: BPS — Statistics Indonesia (bps.go.id) dan
// World Bank (data.worldbank.org). Nilai dibulatkan ke satu desimal agar
// terbaca; nilai mentah lengkap ada di catatan metodologi.

export const META = {
  country: "Indonesia",
  updated: "26 November 2026",
  currency: "Rp",
};

export const KEY_INDICATORS = [
  { id: "populasi", label: "Penduduk", value: "281,6 jt", change: "+0,97% / thn", year: 2024, source: "BPS, Proyeksi Penduduk 2024" },
  { id: "pdb", label: "PDB nominal", value: "US$ 1.396 M", change: "+5,03% (riil)", year: 2024, source: "World Bank, 2024" },
  { id: "pdb-kapita", label: "PDB per kapita", value: "US$ 4.925", change: "+4,03%", year: 2024, source: "World Bank, 2024" },
  { id: "inflasi", label: "Inflasi (yoy)", value: "1,57%", change: "target 2,5% ±1", year: 2024, source: "BPS, 2024" },
  { id: "pengangguran", label: "Pengangguran terbuka", value: "4,91%", change: "Agustus 2024", year: 2024, source: "BPS, Sakernas Agt 2024" },
  { id: "kemiskinan", label: "Penduduk miskin", value: "8,57%", change: "24,06 jt jiwa", year: 2024, source: "BPS, Sep 2024" },
  { id: "ipm", label: "Indeks Pembangunan Manusia", value: "75,02", change: "kategori tinggi", year: 2024, source: "BPS, 2024" },
  { id: "harapan-hidup", label: "Harapan hidup", value: "74,1 thn", change: "+0,2 thn", year: 2024, source: "BPS, 2024" },
];

// Penduduk pertengahan tahun, juta jiwa (BPS).
export const POPULATION_SERIES = [
  { year: 2015, value: 255.59 }, { year: 2016, value: 258.71 },
  { year: 2017, value: 261.89 }, { year: 2018, value: 265.02 },
  { year: 2019, value: 268.07 }, { year: 2020, value: 270.20 },
  { year: 2021, value: 272.68 }, { year: 2022, value: 275.77 },
  { year: 2023, value: 278.69 }, { year: 2024, value: 281.60 },
];

// Pertumbuhan ekonomi, % yoy (BPS).
export const GDP_GROWTH = [
  { year: 2015, value: 4.88 }, { year: 2016, value: 5.03 },
  { year: 2017, value: 5.07 }, { year: 2018, value: 5.17 },
  { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 },
  { year: 2021, value: 3.70 }, { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 }, { year: 2024, value: 5.03 },
];

// Inflasi tahunan, % yoy (BPS).
export const INFLATION = [
  { year: 2015, value: 3.35 }, { year: 2016, value: 3.02 },
  { year: 2017, value: 3.61 }, { year: 2018, value: 3.13 },
  { year: 2019, value: 2.72 }, { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 }, { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 }, { year: 2024, value: 1.57 },
];

// Tingkat pengangguran terbuka, % (BPS, Sakernas Agustus).
export const UNEMPLOYMENT = [
  { year: 2015, value: 6.18 }, { year: 2016, value: 5.61 },
  { year: 2017, value: 5.50 }, { year: 2018, value: 5.34 },
  { year: 2019, value: 5.28 }, { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 }, { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 }, { year: 2024, value: 4.91 },
];

// Penduduk miskin, % (BPS, September).
export const POVERTY = [
  { year: 2015, value: 11.13 }, { year: 2016, value: 10.86 },
  { year: 2017, value: 10.12 }, { year: 2018, value: 9.66 },
  { year: 2019, value: 9.22 }, { year: 2020, value: 9.78 },
  { year: 2021, value: 9.71 }, { year: 2022, value: 9.57 },
  { year: 2023, value: 9.36 }, { year: 2024, value: 8.57 },
];

// Struktur umur 2024, % dari penduduk (BPS).
export const AGE_STRUCTURE = [
  { group: "0–14 tahun", value: 24.99, note: "anak" },
  { group: "15–64 tahun", value: 68.91, note: "usia produktif" },
  { group: "65+ tahun", value: 6.10, note: "lansia" },
];

// 15 provinsi terbesar, penduduk 2024 juta jiwa (BPS). Pangsa = % dari nasional.
export const PROVINCES = [
  { name: "Jawa Barat", pop: 50.35, capital: "Bandung" },
  { name: "Jawa Timur", pop: 41.81, capital: "Surabaya" },
  { name: "Jawa Tengah", pop: 37.89, capital: "Semarang" },
  { name: "Sumatera Utara", pop: 15.59, capital: "Medan" },
  { name: "Banten", pop: 12.43, capital: "Serang" },
  { name: "DKI Jakarta", pop: 10.56, capital: "Jakarta" },
  { name: "Sulawesi Selatan", pop: 9.46, capital: "Makassar" },
  { name: "Lampung", pop: 9.28, capital: "Bandar Lampung" },
  { name: "Sumatera Selatan", pop: 8.84, capital: "Palembang" },
  { name: "Riau", pop: 6.94, capital: "Pekanbaru" },
  { name: "Kalimantan Barat", pop: 5.78, capital: "Pontianak" },
  { name: "Sumatera Barat", pop: 5.76, capital: "Padang" },
  { name: "Nusa Tenggara Timur", pop: 5.66, capital: "Kupang" },
  { name: "Nusa Tenggara Barat", pop: 5.64, capital: "Mataram" },
  { name: "Aceh", pop: 5.55, capital: "Banda Aceh" },
];

// Perdagangan luar negeri 2024, miliar US$ (BPS).
export const TRADE_2024 = {
  exports: 264.70, imports: 233.66, surplus: 31.04,
  topExports: ["Batu bara", "Minyak sawit mentah (CPO)", "Besi dan baja", "Nikel", "Karet"],
};

// Fakta dasar negara (BPS / Kemendagri / World Bank).
export const COUNTRY_FACTS = [
  { label: "Luas wilayah", value: "1.904.569 km²", source: "BPS, 2024" },
  { label: "Jumlah pulau", value: "17.508", source: "Kemendagri, 2024" },
  { label: "Provinsi", value: "38", source: "Kemendagri, 2024" },
  { label: "Kabupaten / kota", value: "514", source: "Kemendagri, 2024" },
  { label: "Kepadatan penduduk", value: "148 jiwa/km²", source: "BPS, 2024" },
  { label: "Ibu kota", value: "Jakarta (Ibu Kota Nusantara dalam transisi)", source: "UU IKN, 2022" },
  { label: "Mata uang", value: "Rupiah (IDR)", source: "Bank Indonesia" },
  { label: "Zona waktu", value: "WIB, WITA, WIT (UTC+7 s.d. +9)", source: "Kepres 41/1987" },
];

export function totalPopulation() {
  return POPULATION_SERIES[POPULATION_SERIES.length - 1].value;
}

export function shareOfNational(pop) {
  return (pop / totalPopulation()) * 100;
}

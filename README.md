# NusaData — Portal Statistik Indonesia

<!-- SPDX-License-Identifier: MIT -->

Portal statistik nasional Indonesia: penduduk, ekonomi, wilayah, dan
kesejahteraan — angka resmi terbaru dari BPS dan Bank Dunia, lengkap dengan
sumber dan tahunnya. Situs statis murni (HTML + CSS + JavaScript tanpa
library), berjalan di browser desktop dan HP tanpa satu pun permintaan
jaringan.

## Isi situs

- **Beranda** — 8 indikator kunci, grafik penduduk 2015–2024, pertumbuhan PDB, 5 provinsi terpadat, fakta dasar negara.
- **Penduduk** — grafik garis penduduk, struktur umur 2024, tabel 15 provinsi terbesar dengan pencarian dan pengurutan.
- **Ekonomi** — pengalih metrik (pertumbuhan PDB, inflasi, pengangguran, kemiskinan), perdagangan luar negeri 2024.
- **Wilayah** — bandingkan dua provinsi, tabel provinsi dengan pencarian.
- **Pendidikan & Kesehatan** — kemiskinan, pengangguran, IPM, harapan hidup, melek huruf.
- **Metodologi** — sumber data, catatan pembulatan, unduh data penduduk (CSV).

## Menjalankan

```sh
node serve.ts        # http://localhost:8080
```

## Penyerahan (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke output dan menulis
`dossier.json` dengan `buildDossier` dari `vendor/makefun-frontend.ts`.

## Sumber data

BPS — Statistics Indonesia (bps.go.id), World Bank (data.worldbank.org),
Kementerian Dalam Negeri, Bank Indonesia. Setiap angka di situs diberi
sumber dan tahun di tempatnya ditampilkan; lihat halaman Metodologi.

Entri untuk kompetisi make.fun
[best-national-statistics-site-20261126-0539](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

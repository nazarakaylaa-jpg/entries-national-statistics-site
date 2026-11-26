// views.js — halaman-halaman situs. Setiap rute hash merender satu halaman
// lengkap: kartu indikator, grafik, tabel, dan sumber angka. Semua kontrol
// di halaman (pencarian, urut, banding, pengalih metrik) benar-benar bekerja.

import {
  KEY_INDICATORS, POPULATION_SERIES, GDP_GROWTH, INFLATION, UNEMPLOYMENT,
  POVERTY, AGE_STRUCTURE, PROVINCES, TRADE_2024, COUNTRY_FACTS, shareOfNational,
} from "./data.js";
import { lineChart, barChart, hbarChart } from "./charts.js";

function fmt(n, d = 2) {
  return n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function sourceLine(source) {
  return `<p class="source">Sumber: ${source}</p>`;
}

function kpiCards() {
  return `<div class="kpi-grid">${KEY_INDICATORS.map((k) => `
    <article class="kpi">
      <p class="kpi-label">${k.label}</p>
      <p class="kpi-value">${k.value}</p>
      <p class="kpi-meta">${k.change} · ${k.year}</p>
      <p class="kpi-src">${k.source}</p>
    </article>`).join("")}</div>`;
}

function chartCard(title, subtitle, chartHtml, source) {
  return `<section class="card chart-card">
    <h2>${title}</h2><p class="card-sub">${subtitle}</p>
    <div class="chart">${chartHtml}</div>
    ${sourceLine(source)}
  </section>`;
}

function provinceRows(list) {
  return list.map((p, i) => `<tr>
    <td>${i + 1}</td><td><strong>${p.name}</strong></td><td>${p.capital}</td>
    <td class="num">${fmt(p.pop)}</td><td class="num">${fmt(shareOfNational(p.pop), 1)}%</td>
  </tr>`).join("");
}

function provinceTable(list, idPrefix) {
  return `<table class="data-table" id="${idPrefix}-table">
    <thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th>
    <th class="num">Penduduk 2024 (jt)</th><th class="num">Pangsa nasional</th></tr></thead>
    <tbody>${provinceRows(list)}</tbody>
  </table>`;
}

// ---- Beranda -------------------------------------------------------------
export function renderHome() {
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  return `
  <section class="hero">
    <p class="eyebrow">Portal Statistik Nasional · Indonesia</p>
    <h1>Angka Indonesia,<br>dalam satu tempat.</h1>
    <p class="lede">Penduduk, ekonomi, wilayah, dan kesejahteraan — angka resmi terbaru
    dari BPS dan Bank Dunia, lengkap dengan sumber dan tahunnya, bisa dijelajahi
    tanpa akun dan tanpa unduhan.</p>
    <nav class="hero-links" aria-label="Jelajahi">
      <a class="btn" href="#/penduduk">Penduduk</a>
      <a class="btn" href="#/ekonomi">Ekonomi</a>
      <a class="btn" href="#/wilayah">Wilayah</a>
      <a class="btn" href="#/sosial">Pendidikan &amp; Kesehatan</a>
    </nav>
  </section>
  ${kpiCards()}
  <div class="grid-2">
    ${chartCard("Penduduk Indonesia terus tumbuh",
      "Penduduk pertengahan tahun, 2015–2024",
      lineChart(POPULATION_SERIES, { unit: " jt", decimals: 1, title: "Penduduk 2015-2024" }),
      "BPS, Proyeksi Penduduk 2015–2024")}
    ${chartCard("Pertumbuhan ekonomi bangkit pasca-2020",
      "Pertumbuhan PDB riil, % per tahun",
      barChart(GDP_GROWTH, { unit: "%", decimals: 2, title: "Pertumbuhan PDB 2015-2024" }),
      "BPS, PDB 2015–2024")}
  </div>
  <section class="card">
    <h2>Lima provinsi terpadat</h2>
    <p class="card-sub">Penduduk 2024, juta jiwa — lebih dari separuh penduduk Indonesia
    tinggal di Pulau Jawa.</p>
    <div class="chart">${hbarChart(top5.map((p) => ({ label: p.name, value: p.pop })), { unit: " jt", decimals: 2, title: "Lima provinsi terpadat" })}</div>
    ${sourceLine("BPS, Proyeksi Penduduk 2024")}
    <p><a class="link-more" href="#/wilayah">Lihat semua 15 provinsi terbesar →</a></p>
  </section>
  <section class="card facts">
    <h2>Indonesia sekilas</h2>
    <dl>${COUNTRY_FACTS.map((f) => `<div class="fact"><dt>${f.label}</dt><dd>${f.value}</dd><dd class="fact-src">${f.source}</dd></div>`).join("")}</dl>
  </section>`;
}

// ---- Penduduk ------------------------------------------------------------
export function renderPopulation() {
  return `
  <section class="page-head">
    <p class="eyebrow">Penduduk</p>
    <h1>Penduduk Indonesia</h1>
    <p class="lede">281,6 juta jiwa pada 2024 — negara terpadat keempat di dunia.
    Laju tumbuh melambat dari 1,25% (2015) menjadi 0,97% (2024).</p>
  </section>
  <div class="grid-2">
    ${chartCard("Penduduk 2015–2024",
      "Juta jiwa, pertengahan tahun",
      lineChart(POPULATION_SERIES, { unit: " jt", decimals: 1, title: "Penduduk 2015-2024" }),
      "BPS, Proyeksi Penduduk 2015–2024")}
    ${chartCard("Struktur umur 2024",
      "Pangsa penduduk menurut kelompok umur — bonus demografi masih berjalan",
      hbarChart(AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.value })), { unit: "%", decimals: 1, title: "Struktur umur 2024" }),
      "BPS, Proyeksi Penduduk 2024")}
  </div>
  <section class="card">
    <h2>Provinsi menurut penduduk</h2>
    <p class="card-sub">Ketik untuk mencari, atau urutkan dengan memilih kolom.</p>
    <div class="controls">
      <label>Cari provinsi <input id="prov-search" type="search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label>
      <label>Urutkan
        <select id="prov-sort" aria-label="Urutkan provinsi">
          <option value="pop-desc">Penduduk: terbanyak dulu</option>
          <option value="pop-asc">Penduduk: tersedikit dulu</option>
          <option value="name">Nama: A–Z</option>
        </select>
      </label>
    </div>
    <div class="table-wrap">${provinceTable(PROVINCES, "pop")}</div>
    ${sourceLine("BPS, Proyeksi Penduduk 2024. Pangsa = penduduk provinsi ÷ 281,6 juta.")}
  </section>`;
}

// ---- Ekonomi -------------------------------------------------------------
export function renderEconomy() {
  return `
  <section class="page-head">
    <p class="eyebrow">Ekonomi</p>
    <h1>Ekonomi Indonesia</h1>
    <p class="lede">PDB US$ 1.396 miliar (2024), ekonomi terbesar di Asia Tenggara.
    Pertumbuhan kembali di atas 5% sejak 2022, inflasi kembali di bawah 2%.</p>
  </section>
  <section class="card">
    <h2>Pilih indikator</h2>
    <div class="controls" role="group" aria-label="Pilih indikator ekonomi">
      <button class="seg active" data-metric="growth">Pertumbuhan PDB</button>
      <button class="seg" data-metric="inflation">Inflasi</button>
      <button class="seg" data-metric="unemployment">Pengangguran</button>
      <button class="seg" data-metric="poverty">Kemiskinan</button>
    </div>
    <div class="chart" id="econ-chart"></div>
    <p class="source" id="econ-source"></p>
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>Perdagangan 2024</h2>
      <dl class="stat-list">
        <div><dt>Ekspor</dt><dd>US$ ${fmt(TRADE_2024.exports)} miliar</dd></div>
        <div><dt>Impor</dt><dd>US$ ${fmt(TRADE_2024.imports)} miliar</dd></div>
        <div><dt>Surplus</dt><dd>US$ ${fmt(TRADE_2024.surplus)} miliar</dd></div>
      </dl>
      <p class="card-sub">Ekspor utama: ${TRADE_2024.topExports.join(", ")}.</p>
      ${sourceLine("BPS, Statistik Perdagangan Luar Negeri 2024")}
    </section>
    <section class="card">
      <h2>Yang perlu diperhatikan</h2>
      <ul class="notes">
        <li><strong>2020:</strong> ekonomi kontraksi −2,07% — satu-satunya tahun negatif dalam satu dekade, dampak pandemi COVID-19.</li>
        <li><strong>2022:</strong> inflasi melonjak ke 5,51% setelah penyesuaian harga BBM bersubsidi, lalu turun ke 1,57% pada 2024.</li>
        <li><strong>2024:</strong> pengangguran 4,91% — terendah sejak 2019 — dan kemiskinan 8,57%, terendah sepanjang sejarah pencatatan BPS.</li>
      </ul>
    </section>
  </div>`;
}

// ---- Wilayah ---------------------------------------------------------------
export function renderRegions() {
  return `
  <section class="page-head">
    <p class="eyebrow">Wilayah</p>
    <h1>Jelajahi provinsi</h1>
    <p class="lede">Bandingkan provinsi satu sama lain. Pilih dua provinsi untuk melihat
    selisih penduduknya, atau cari provinsi dari daftar lengkap.</p>
  </section>
  <section class="card">
    <h2>Bandingkan dua provinsi</h2>
    <div class="controls">
      <label>Provinsi A
        <select id="cmp-a" aria-label="Provinsi A">${PROVINCES.map((p) => `<option>${p.name}</option>`).join("")}</select>
      </label>
      <label>Provinsi B
        <select id="cmp-b" aria-label="Provinsi B">${PROVINCES.map((p, i) => `<option ${i === 1 ? "selected" : ""}>${p.name}</option>`).join("")}</select>
      </label>
    </div>
    <div class="chart" id="cmp-chart"></div>
    <p class="source" id="cmp-note"></p>
  </section>
  <section class="card">
    <h2>Semua provinsi dalam daftar</h2>
    <p class="card-sub">15 provinsi terbesar menurut penduduk 2024.</p>
    <div class="controls">
      <label>Cari provinsi <input id="reg-search" type="search" placeholder="mis. Sulawesi" aria-label="Cari provinsi"></label>
    </div>
    <div class="table-wrap">${provinceTable(PROVINCES, "reg")}</div>
    ${sourceLine("BPS, Proyeksi Penduduk 2024")}
  </section>`;
}

// ---- Sosial ----------------------------------------------------------------
export function renderSocial() {
  return `
  <section class="page-head">
    <p class="eyebrow">Pendidikan &amp; Kesehatan</p>
    <h1>Kesejahteraan penduduk</h1>
    <p class="lede">Harapan hidup 74,1 tahun, IPM 75,02 (kategori tinggi), dan angka
    melek huruf 96,4% — semuanya membaik dalam satu dekade terakhir.</p>
  </section>
  <div class="grid-2">
    ${chartCard("Kemiskinan terus turun",
      "Penduduk miskin, % — terendah sepanjang sejarah pada September 2024",
      lineChart(POVERTY, { unit: "%", decimals: 2, color: "#b45309", title: "Kemiskinan 2015-2024" }),
      "BPS, Profil Kemiskinan 2015–2024")}
    ${chartCard("Pengangguran kembali ke bawah 5%",
      "Tingkat pengangguran terbuka, % (Sakernas Agustus)",
      barChart(UNEMPLOYMENT, { unit: "%", decimals: 2, color: "#1d4ed8", title: "Pengangguran 2015-2024" }),
      "BPS, Sakernas 2015–2024")}
  </div>
  <section class="card">
    <h2>Indikator kesejahteraan 2024</h2>
    <dl class="stat-list">
      <div><dt>Harapan hidup saat lahir</dt><dd>74,1 tahun</dd><dd class="fact-src">BPS, 2024</dd></div>
      <div><dt>Indeks Pembangunan Manusia</dt><dd>75,02 (kategori tinggi)</dd><dd class="fact-src">BPS, 2024</dd></div>
      <div><dt>Angka melek huruf (15+)</dt><dd>96,4%</dd><dd class="fact-src">BPS, 2023</dd></div>
      <div><dt>Rata-rata lama sekolah</dt><dd>9,0 tahun</dd><dd class="fact-src">BPS, 2024</dd></div>
      <div><dt>Harapan lama sekolah</dt><dd>13,2 tahun</dd><dd class="fact-src">BPS, 2024</dd></div>
      <div><dt>Pengeluaran per kapita (disesuaikan)</dt><dd>Rp 13,1 juta / tahun</dd><dd class="fact-src">BPS, 2024</dd></div>
    </dl>
  </section>`;
}

// ---- Metodologi ------------------------------------------------------------
export function renderMethod() {
  return `
  <section class="page-head">
    <p class="eyebrow">Metodologi &amp; Sumber</p>
    <h1>Dari mana angka-angka ini?</h1>
    <p class="lede">Setiap angka di situs ini berasal dari publikasi resmi dan diberi
    sumber serta tahun di tempatnya ditampilkan. Tidak ada angka karangan.</p>
  </section>
  <section class="card">
    <h2>Sumber data</h2>
    <ul class="notes">
      <li><strong>BPS — Statistics Indonesia (bps.go.id):</strong> penduduk, PDB, inflasi, pengangguran, kemiskinan, IPM, harapan hidup, perdagangan.</li>
      <li><strong>World Bank (data.worldbank.org):</strong> PDB nominal dan PDB per kapita 2024 dalam dolar AS.</li>
      <li><strong>Kementerian Dalam Negeri:</strong> jumlah pulau, provinsi, dan kabupaten/kota.</li>
      <li><strong>Bank Indonesia:</strong> mata uang rupiah.</li>
    </ul>
    <h2>Catatan</h2>
    <ul class="notes">
      <li>Penduduk memakai angka pertengahan tahun dari proyeksi BPS; sensus terakhir 2020 mencatat 270,20 juta jiwa.</li>
      <li>Angka dibulatkan ke satu atau dua desimal agar terbaca; pembulatan tidak mengubah urutan atau kesimpulan.</li>
      <li>Pangsa provinsi dihitung dari penduduk provinsi dibagi total nasional 281,60 juta jiwa (2024).</li>
      <li>Situs ini berjalan sepenuhnya dari berkas statis — tidak ada permintaan jaringan, tidak ada pelacak, tidak ada cookie.</li>
    </ul>
    <p><button class="btn" id="download-csv">Unduh data penduduk (CSV)</button></p>
  </section>`;
}

export const ECON_METRICS = {
  growth: { title: "Pertumbuhan PDB, % per tahun", series: GDP_GROWTH, color: "#0f766e", source: "BPS, PDB 2015–2024" },
  inflation: { title: "Inflasi, % yoy", series: INFLATION, color: "#b45309", source: "BPS, Inflasi 2015–2024" },
  unemployment: { title: "Pengangguran terbuka, %", series: UNEMPLOYMENT, color: "#1d4ed8", source: "BPS, Sakernas 2015–2024" },
  poverty: { title: "Penduduk miskin, %", series: POVERTY, color: "#b45309", source: "BPS, Profil Kemiskinan 2015–2024" },
};

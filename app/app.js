// app.js — router hash dan semua interaksi halaman.
// Rute: #/ beranda, #/penduduk, #/ekonomi, #/wilayah, #/sosial, #/metodologi.
// Setiap kontrol (pencarian, urut, banding, pengalih metrik, unduh CSV)
// dipasang ulang setiap kali halaman dirender.

import { PROVINCES, POPULATION_SERIES, shareOfNational } from "./data.js";
import { barChart, hbarChart } from "./charts.js";
import {
  renderHome, renderPopulation, renderEconomy, renderRegions,
  renderSocial, renderMethod, ECON_METRICS,
} from "./views.js";

const ROUTES = {
  "": renderHome,
  "/": renderHome,
  "/penduduk": renderPopulation,
  "/ekonomi": renderEconomy,
  "/wilayah": renderRegions,
  "/sosial": renderSocial,
  "/metodologi": renderMethod,
};

const NAV = [
  ["#/", "Beranda"], ["#/penduduk", "Penduduk"], ["#/ekonomi", "Ekonomi"],
  ["#/wilayah", "Wilayah"], ["#/sosial", "Pendidikan & Kesehatan"],
  ["#/metodologi", "Metodologi"],
];

function fmt(n, d = 2) {
  return n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] ? hash : "/";
}

function renderNav(active) {
  const nav = document.getElementById("main-nav");
  nav.innerHTML = NAV.map(([href, label]) =>
    `<a href="${href}"${href === "#" + active || (active === "/" && href === "#/") ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("");
}

function attachProvinceControls(searchId, sortId, tableId) {
  const search = document.getElementById(searchId);
  const sort = sortId ? document.getElementById(sortId) : null;
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!search || !tbody) return;
  function apply() {
    const q = search.value.trim().toLowerCase();
    let list = PROVINCES.filter((p) => p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q));
    if (sort) {
      if (sort.value === "pop-asc") list = [...list].sort((a, b) => a.pop - b.pop);
      else if (sort.value === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "id"));
      else list = [...list].sort((a, b) => b.pop - a.pop);
    }
    tbody.innerHTML = list.length ? list.map((p, i) => `<tr>
      <td>${i + 1}</td><td><strong>${p.name}</strong></td><td>${p.capital}</td>
      <td class="num">${fmt(p.pop)}</td><td class="num">${fmt(shareOfNational(p.pop), 1)}%</td>
    </tr>`).join("") : `<tr><td colspan="5">Tidak ada provinsi yang cocok dengan “${search.value}”.</td></tr>`;
  }
  search.addEventListener("input", apply);
  if (sort) sort.addEventListener("change", apply);
}

function attachEconomy() {
  const chart = document.getElementById("econ-chart");
  const src = document.getElementById("econ-source");
  if (!chart) return;
  function show(key) {
    const m = ECON_METRICS[key];
    chart.innerHTML = barChart(m.series, { unit: "%", decimals: 2, color: m.color, title: m.title });
    src.textContent = "Sumber: " + m.source;
    document.querySelectorAll(".seg").forEach((b) => b.classList.toggle("active", b.dataset.metric === key));
  }
  document.querySelectorAll(".seg").forEach((b) => b.addEventListener("click", () => show(b.dataset.metric)));
  show("growth");
}

function attachCompare() {
  const a = document.getElementById("cmp-a");
  const b = document.getElementById("cmp-b");
  const chart = document.getElementById("cmp-chart");
  const note = document.getElementById("cmp-note");
  if (!a || !b) return;
  function show() {
    const pa = PROVINCES.find((p) => p.name === a.value);
    const pb = PROVINCES.find((p) => p.name === b.value);
    chart.innerHTML = hbarChart([
      { label: pa.name, value: pa.pop, color: "#0f766e" },
      { label: pb.name, value: pb.pop, color: "#b45309" },
    ], { unit: " jt", decimals: 2, title: `Bandingkan ${pa.name} dan ${pb.name}` });
    const diff = Math.abs(pa.pop - pb.pop);
    const bigger = pa.pop >= pb.pop ? pa : pb;
    const smaller = pa.pop >= pb.pop ? pb : pa;
    note.textContent = pa.name === pb.name
      ? "Pilih dua provinsi yang berbeda untuk membandingkan."
      : `${bigger.name} (${fmt(bigger.pop)} juta jiwa) lebih besar ${fmt(diff)} juta jiwa dibanding ${smaller.name} (${fmt(smaller.pop)} juta jiwa). Sumber: BPS, Proyeksi Penduduk 2024.`;
  }
  a.addEventListener("change", show);
  b.addEventListener("change", show);
  show();
}

function attachCsv() {
  const btn = document.getElementById("download-csv");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const lines = ["tahun,penduduk_juta_jiwa", ...POPULATION_SERIES.map((d) => `${d.year},${d.value}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "penduduk-indonesia-2015-2024.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
}

function render() {
  const r = route();
  renderNav(r);
  document.getElementById("page").innerHTML = ROUTES[r]();
  attachProvinceControls("prov-search", "prov-sort", "pop-table");
  attachProvinceControls("reg-search", null, "reg-table");
  attachEconomy();
  attachCompare();
  attachCsv();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();

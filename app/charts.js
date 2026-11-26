// charts.js — pembuat grafik SVG murni (tanpa library).
// Semua grafik digambar dari data di data.js, jadi angka di layar selalu
// sama dengan angka di sumber. Fungsi mengembalikan string SVG.

export function svgOpen(width, height, label) {
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${label}">`;
}

function niceTicks(min, max, count) {
  const step = (max - min) / Math.max(1, count - 1);
  const ticks = [];
  for (let i = 0; i < count; i++) ticks.push(min + step * i);
  return ticks;
}

function fmtTick(v, decimals) {
  return v.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Grafik garis dengan titik, label nilai, dan garis grid.
export function lineChart(series, opts) {
  const o = Object.assign({ width: 720, height: 300, unit: "", decimals: 1, color: "#0f766e", area: true }, opts);
  const W = o.width, H = o.height, padL = 56, padR = 14, padT = 18, padB = 30;
  const values = series.map((d) => d.value);
  let min = Math.min(...values), max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12;
  min -= pad; max += pad;
  const x = (i) => padL + (i * (W - padL - padR)) / Math.max(1, series.length - 1);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const ticks = niceTicks(min + pad, max - pad, 4);
  let s = svgOpen(W, H, o.title || "Grafik garis");
  ticks.forEach((t) => {
    s += `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${fmtTick(t, o.decimals)}${o.unit}</text>`;
  });
  const pts = series.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  if (o.area) {
    const base = H - padB;
    s += `<polygon points="${padL},${base} ${pts} ${x(series.length - 1).toFixed(1)},${base}" fill="${o.color}" fill-opacity="0.08"/>`;
  }
  s += `<polyline points="${pts}" fill="none" stroke="${o.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  series.forEach((d, i) => {
    s += `<circle cx="${x(i)}" cy="${y(d.value)}" r="3.5" fill="#fff" stroke="${o.color}" stroke-width="2"/>`;
    s += `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#64748b">${d.year}</text>`;
    if (i === series.length - 1 || i === 0) {
      const anchor = i === 0 ? "start" : "end";
      const lx = i === 0 ? x(i) + 6 : x(i) - 6;
      s += `<text x="${lx}" y="${y(d.value) - 10}" text-anchor="${anchor}" font-size="12" font-weight="700" fill="#0f172a">${fmtTick(d.value, o.decimals)}${o.unit}</text>`;
    }
  });
  s += "</svg>";
  return s;
}

// Grafik batang vertikal; batang negatif digambar ke bawah dari garis nol.
export function barChart(series, opts) {
  const o = Object.assign({ width: 720, height: 300, unit: "", decimals: 1, color: "#0f766e", negColor: "#dc2626" }, opts);
  const W = o.width, H = o.height, padL = 56, padR = 14, padT = 22, padB = 30;
  const values = series.map((d) => d.value);
  let min = Math.min(0, ...values), max = Math.max(0, ...values);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.08;
  min -= pad; max += pad;
  const slot = (W - padL - padR) / series.length;
  const bw = Math.min(46, slot * 0.62);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const ticks = niceTicks(min + pad, max - pad, 4);
  let s = svgOpen(W, H, o.title || "Grafik batang");
  ticks.forEach((t) => {
    s += `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${fmtTick(t, o.decimals)}${o.unit}</text>`;
  });
  s += `<line x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}" stroke="#94a3b8" stroke-width="1.5"/>`;
  series.forEach((d, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(0, d.value)), bot = y(Math.min(0, d.value));
    const color = d.value < 0 ? o.negColor : o.color;
    s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw}" height="${Math.max(1, bot - top).toFixed(1)}" rx="3" fill="${color}"/>`;
    s += `<text x="${cx}" y="${(d.value < 0 ? bot + 16 : top - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a">${fmtTick(d.value, o.decimals)}${o.unit}</text>`;
    s += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#64748b">${d.year}</text>`;
  });
  s += "</svg>";
  return s;
}

// Grafik batang horizontal untuk perbandingan (label kiri, nilai kanan).
export function hbarChart(rows, opts) {
  const o = Object.assign({ width: 720, rowH: 34, unit: "", decimals: 1, color: "#0f766e" }, opts);
  const max = Math.max(...rows.map((r) => r.value));
  const H = rows.length * o.rowH + 14;
  const padL = 170, padR = 70;
  let s = svgOpen(o.width, H, o.title || "Grafik batang horizontal");
  rows.forEach((r, i) => {
    const y = 10 + i * o.rowH;
    const w = ((o.width - padL - padR) * r.value) / max;
    s += `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12" fill="#334155">${r.label}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${w.toFixed(1)}" height="20" rx="4" fill="${r.color || o.color}"/>`;
    s += `<text x="${padL + w + 8}" y="${y + 15}" font-size="12" font-weight="700" fill="#0f172a">${fmtTick(r.value, o.decimals)}${o.unit}</text>`;
  });
  s += "</svg>";
  return s;
}

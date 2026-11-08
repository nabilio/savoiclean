// Utilitaires montants / dates (montants stockés en centimes).
export function fmtEUR(cents, { nbsp = false } = {}) {
  const neg = cents < 0;
  const abs = Math.abs(Math.round(cents || 0));
  const euros = Math.floor(abs / 100);
  const dec = String(abs % 100).padStart(2, '0');
  const int = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, nbsp ? ' ' : ' ');
  return `${neg ? '-' : ''}${int},${dec}${nbsp ? ' ' : ' '}€`;
}

export function parseEuros(input) {
  if (input === null || input === undefined) return 0;
  const s = String(input).replace(/\s/g, '').replace(',', '.').replace(/[^0-9.\-]/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function parseNum(input, fallback = 0) {
  const n = parseFloat(String(input ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}

// lines : [{ desc, qty, unit, price (centimes HT), vat (%) }]
export function computeTotals(lines, regime = 'normal') {
  let ht = 0;
  const byRate = new Map();
  for (const l of lines) {
    const lineHT = Math.round(Number(l.qty || 0) * Number(l.price || 0));
    ht += lineHT;
    const rate = regime === 'franchise' ? 0 : Number(l.vat || 0);
    byRate.set(rate, (byRate.get(rate) || 0) + lineHT);
  }
  let vat = 0;
  const vatLines = [];
  for (const [rate, base] of [...byRate.entries()].sort((a, b) => a[0] - b[0])) {
    const amount = Math.round((base * rate) / 100);
    vat += amount;
    vatLines.push({ rate, base, amount });
  }
  return { ht, vat, ttc: ht + vat, vatLines };
}

export function lineTotal(l) {
  return Math.round(Number(l.qty || 0) * Number(l.price || 0));
}

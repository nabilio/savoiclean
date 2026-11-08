import 'server-only';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { one } from './db';
import { fmtEUR, fmtDate, lineTotal, computeTotals } from './money';

const NAVY = rgb(0.047, 0.145, 0.259);
const GREY = rgb(0.38, 0.43, 0.49);
const LINE = rgb(0.86, 0.89, 0.93);
const TEAL = rgb(0.08, 0.54, 0.52);

export async function buildDocumentPdf({ doc, client, settings }) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28;
  const H = 841.89;
  const M = 42;
  const lines = JSON.parse(doc.items || '[]');
  const franchise = doc.vat_regime === 'franchise';
  const totals = computeTotals(lines, doc.vat_regime);

  const ok = new Map();
  const safe = (s) =>
    String(s ?? '')
      .replace(/[  ]/g, ' ')
      .replace(/[‘’]/g, "'")
      .replace(/[\r\n]+/g, ' ')
      .split('')
      .map((ch) => {
        if (!ok.has(ch)) {
          try {
            font.encodeText(ch);
            ok.set(ch, true);
          } catch {
            ok.set(ch, false);
          }
        }
        return ok.get(ch) ? ch : '?';
      })
      .join('');

  let page = pdf.addPage([W, H]);
  let y = H - M;

  const text = (s, x, yy, { size = 9.5, f = font, color = NAVY } = {}) => page.drawText(safe(s), { x, y: yy, size, font: f, color });
  const textR = (s, xr, yy, opts = {}) => {
    const f = opts.f || font;
    const size = opts.size || 9.5;
    const t = safe(s);
    page.drawText(t, { x: xr - f.widthOfTextAtSize(t, size), y: yy, size, font: f, color: opts.color || NAVY });
  };
  const wrap = (s, width, f = font, size = 9.5) => {
    const words = safe(s).split(/\s+/).filter(Boolean);
    const out = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(t, size) <= width) cur = t;
      else {
        if (cur) out.push(cur);
        cur = w;
      }
    }
    if (cur) out.push(cur);
    return out.length ? out : [''];
  };
  const hline = (yy, x1 = M, x2 = W - M, color = LINE, thickness = 0.8) => page.drawLine({ start: { x: x1, y: yy }, end: { x: x2, y: yy }, color, thickness });

  const isInvoice = doc.type === 'facture';
  const company = settings.legal_name || settings.brand_name;

  // --- Logo (image importée dans Paramètres, sinon logo par défaut dessiné) ---
  const LOGO = 44;
  let logoDone = false;
  const logoId = Number(settings.logo_image || 0);
  if (logoId) {
    try {
      const m = await one('SELECT mime, data FROM media WHERE id = ?', [logoId]);
      if (m && (m.mime === 'image/png' || m.mime === 'image/jpeg')) {
        const img = m.mime === 'image/png' ? await pdf.embedPng(m.data) : await pdf.embedJpg(m.data);
        const sc = Math.min(LOGO / img.height, 110 / img.width);
        page.drawImage(img, { x: M, y: y - img.height * sc + 4, width: img.width * sc, height: img.height * sc });
        logoDone = img.width * sc;
      }
    } catch {}
  }
  if (!logoDone) {
    const k = LOGO / 84;
    const ox = M, oy = y + 4;
    page.drawSvgPath('M42 6C58 26 70 38 70 52a28 28 0 0 1-56 0C14 38 26 26 42 6z', { x: ox, y: oy, scale: k, color: rgb(0.1, 0.64, 0.61) });
    page.drawSvgPath('M50 40c-3-5-9-6-13-3s-3 8 3 10l6 2c6 2 6 8 1 10-4 2-10 1-14-3', { x: ox, y: oy, scale: k, borderColor: rgb(1, 1, 1), borderWidth: 5 * k, borderLineCap: 1 });
    page.drawSvgPath('M64 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z', { x: ox, y: oy, scale: k, color: rgb(1, 0.79, 0.3) });
    logoDone = LOGO;
  }
  const HX = M + logoDone + 12;

  // --- En-tête émetteur ---
  text(company, HX, y - 12, { size: 17, f: bold });
  let ly = y - 28;
  const issuerLines = [
    [settings.legal_form, settings.siren ? `SIREN ${settings.siren}` : ''].filter(Boolean).join(' – '),
    settings.legal_address || settings.address,
    [settings.phone_display, settings.email].filter(Boolean).join(' · '),
    settings.vat_number ? `TVA ${settings.vat_number}` : '',
  ].filter(Boolean);
  for (const l of issuerLines) {
    text(l, HX, ly, { size: 8.8, color: GREY });
    ly -= 11.5;
  }

  // --- Type + numéro ---
  textR(isInvoice ? 'FACTURE' : 'DEVIS', W - M, y - 14, { size: 22, f: bold, color: TEAL });
  textR(`N° ${doc.number}`, W - M, y - 32, { size: 10.5, f: bold });
  textR(`Date : ${fmtDate(doc.issue_date)}`, W - M, y - 46, { size: 9.5, color: GREY });
  textR(isInvoice ? `Échéance : ${fmtDate(doc.due_date)}` : `Valable jusqu'au : ${fmtDate(doc.due_date)}`, W - M, y - 59, { size: 9.5, color: GREY });

  y = Math.min(ly, y - 70) - 14;

  // --- Client ---
  const boxX = W / 2 + 10;
  const cl = [
    client?.company || client?.name,
    client?.company ? client?.name : '',
    client?.address,
    [client?.postal_code, client?.city].filter(Boolean).join(' '),
    client?.email,
    client?.phone,
    client?.siret ? `SIRET ${client.siret}` : '',
    client?.vat_number ? `TVA ${client.vat_number}` : '',
  ].filter(Boolean);
  const boxH = 24 + cl.length * 12;
  page.drawRectangle({ x: boxX, y: y - boxH, width: W - M - boxX, height: boxH, color: rgb(0.96, 0.98, 0.99), borderColor: LINE, borderWidth: 0.8 });
  text('CLIENT', boxX + 10, y - 14, { size: 7.5, f: bold, color: GREY });
  cl.forEach((l, i) => text(l, boxX + 10, y - 27 - i * 12, { size: 9.5, f: i === 0 ? bold : font }));
  y -= boxH + 22;

  if (doc.title) {
    for (const l of wrap(`Objet : ${doc.title}`, W - 2 * M, bold, 10.5)) {
      text(l, M, y, { size: 10.5, f: bold });
      y -= 14;
    }
    y -= 6;
  }

  // --- Tableau ---
  const cols = franchise
    ? { desc: M, qty: 330, unit: 375, pu: 470, tot: W - M }
    : { desc: M, qty: 290, unit: 332, pu: 420, vat: 458, tot: W - M };
  const descW = (franchise ? 320 : 280) - M;

  const header = () => {
    page.drawRectangle({ x: M, y: y - 18, width: W - 2 * M, height: 22, color: NAVY });
    const hs = { size: 8, f: bold, color: rgb(1, 1, 1) };
    text('DÉSIGNATION', cols.desc + 8, y - 11, hs);
    text('QTÉ', cols.qty, y - 11, hs);
    text('UNITÉ', cols.unit, y - 11, hs);
    textR('PU HT', cols.pu + 38, y - 11, hs);
    if (!franchise) textR('TVA', cols.vat + 28, y - 11, hs);
    textR('TOTAL HT', cols.tot - 8, y - 11, hs);
    y -= 26;
  };
  const newPage = () => {
    page = pdf.addPage([W, H]);
    y = H - M;
    header();
  };
  header();

  for (const l of lines) {
    const dl = wrap(l.desc, descW - 12);
    const rowH = Math.max(18, dl.length * 12 + 8);
    if (y - rowH < 140) newPage();
    dl.forEach((t, i) => text(t, cols.desc + 8, y - 11 - i * 12, {}));
    text(String(l.qty).replace('.', ','), cols.qty, y - 11);
    text(l.unit, cols.unit, y - 11);
    textR(fmtEUR(l.price), cols.pu + 38, y - 11);
    if (!franchise) textR(`${String(l.vat).replace('.', ',')} %`, cols.vat + 28, y - 11);
    textR(fmtEUR(lineTotal(l)), cols.tot - 8, y - 11, { f: bold });
    y -= rowH;
    hline(y + 2);
  }

  // --- Totaux ---
  if (y < 230) newPage();
  y -= 16;
  const tx = W - M - 210;
  const row = (label, val, opts = {}) => {
    text(label, tx, y, { size: opts.size || 10, f: opts.f || font, color: opts.color || NAVY });
    textR(val, W - M, y, { size: opts.size || 10, f: opts.f || bold, color: opts.color || NAVY });
    y -= opts.gap || 15;
  };
  row('Total HT', fmtEUR(totals.ht));
  if (franchise) {
    text('TVA non applicable, art. 293 B du CGI', tx, y, { size: 8.5, color: GREY });
    y -= 15;
  } else {
    for (const v of totals.vatLines) row(`TVA ${String(v.rate).replace('.', ',')} %`, fmtEUR(v.amount), { color: GREY });
  }
  hline(y + 8, tx, W - M, NAVY, 1.2);
  y -= 4;
  row('Total TTC', fmtEUR(totals.ttc), { size: 12.5, f: bold, gap: 22 });
  if (isInvoice && doc.status === 'payée') {
    text(`Facture acquittée le ${fmtDate(doc.paid_at)}${doc.payment_method ? ` (${doc.payment_method})` : ''}`, tx - 40, y, { size: 9, f: bold, color: TEAL });
    y -= 16;
  }

  // --- Informations de règlement / acceptation ---
  y -= 6;
  const block = (title, rows) => {
    text(title, M, y, { size: 8.5, f: bold, color: GREY });
    y -= 12;
    for (const r of rows) {
      for (const l of wrap(r, W - 2 * M)) {
        if (y < 90) newPage2();
        text(l, M, y, { size: 9 });
        y -= 11.5;
      }
    }
    y -= 6;
  };
  const newPage2 = () => {
    page = pdf.addPage([W, H]);
    y = H - M;
  };

  if (doc.notes) block('NOTES', [doc.notes]);
  if (isInvoice) {
    const pay = [`Règlement à réception sous ${Math.max(0, Math.round((new Date(doc.due_date) - new Date(doc.issue_date)) / 86400000))} jours, avant le ${fmtDate(doc.due_date)}.`];
    if (settings.iban) pay.push(`Virement : IBAN ${String(settings.iban).replace(/(.{4})/g, '$1 ').trim()}${settings.bic ? ` – BIC ${settings.bic}` : ''}`);
    block('RÈGLEMENT', pay);
    block('CONDITIONS', [
      "En cas de retard de paiement, une pénalité égale à trois fois le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce). Pas d'escompte pour paiement anticipé.",
      settings.invoice_footer,
    ].filter(Boolean));
  } else {
    if (y < 160) newPage2();
    block('CONDITIONS', [`Devis valable jusqu'au ${fmtDate(doc.due_date)}.`, settings.quote_footer].filter(Boolean));
    if (y < 120) newPage2();
    page.drawRectangle({ x: W - M - 230, y: y - 78, width: 230, height: 78, borderColor: LINE, borderWidth: 1 });
    text('Bon pour accord, date et signature :', W - M - 220, y - 14, { size: 8.5, f: bold, color: GREY });
    y -= 90;
  }

  // --- Pied de page sur toutes les pages ---
  const legal = [company, settings.legal_form, settings.siren ? `SIREN ${settings.siren}` : '', settings.vat_number ? `TVA ${settings.vat_number}` : ''].filter(Boolean).join(' – ');
  const pages = pdf.getPages();
  pages.forEach((pg, i) => {
    pg.drawLine({ start: { x: M, y: 36 }, end: { x: W - M, y: 36 }, color: LINE, thickness: 0.8 });
    pg.drawText(safe(legal), { x: M, y: 24, size: 7.5, font, color: GREY });
    const pn = `${doc.number} · Page ${i + 1}/${pages.length}`;
    pg.drawText(safe(pn), { x: W - M - font.widthOfTextAtSize(safe(pn), 7.5), y: 24, size: 7.5, font, color: GREY });
  });

  return Buffer.from(await pdf.save());
}

'use server';
import { redirect } from 'next/navigation';
import { q, one, run, nowStamp, todayStr } from '@/lib/db';
import { requireAdmin, checkPassword, hashPassword, validatePassword, rateLimit, audit, startSession, endSession, decryptText, newRecoveryCodes } from '@/lib/auth';
import { verifyTotp } from '@/lib/totp';
import { clearCache, getSettings, loadSettings } from '@/lib/site';
import { ENTITIES, SETTING_GROUPS, LEAD_STATUSES, DOC_STATUSES, UNITS, VAT_RATES } from '@/lib/admin-schema';
import { slugify } from '@/lib/text';
import { parseEuros, parseNum, computeTotals, addDays } from '@/lib/money';

const clip = (v, n) => String(v ?? '').trim().slice(0, n);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));

function safeBack(v, fallback) {
  const s = String(v || '');
  return s.startsWith('/admin') && !s.startsWith('//') && !s.includes('\\') ? s.split('?')[0] : fallback;
}
function go(back, key, val) {
  redirect(`${back}?${key}=${encodeURIComponent(val)}`);
}

/* ---------------- Contenu (services, zones, faq, blog, réalisations) ---------------- */
function detectImage(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  return null;
}

export async function saveEntity(fd) {
  await requireAdmin();
  const key = String(fd.get('_entity'));
  const cfg = ENTITIES[key];
  if (!cfg) redirect('/admin/contenu');
  const back = safeBack(fd.get('_back'), `/admin/contenu/${key}`);
  const id = Number(fd.get('id') || 0);
  const existing = id ? await one(`SELECT * FROM ${cfg.table} WHERE id = ?`, [id]) : null;
  if (id && !existing) go(back, 'err', 'required');

  const data = {};
  for (const f of cfg.fields) {
    const raw = fd.get(f.name);
    if (f.type === 'bool') data[f.name] = raw ? 1 : 0;
    else if (f.type === 'number') {
      if (raw === null || String(raw).trim() === '') {
        if (existing) data[f.name] = existing[f.name];
        else if (f.name === 'sort') data[f.name] = Number((await one(`SELECT COALESCE(MAX(sort),0) AS m FROM ${cfg.table}`)).m) + 10;
        else data[f.name] = 0;
      } else data[f.name] = Math.round(parseNum(raw, 0));
    } else if (f.type === 'image') {
      data[f.name] = existing ? existing[f.name] : null;
      const file = fd.get(`${f.name}__file`);
      if (file && typeof file === 'object' && file.size > 0) {
        if (file.size > 4 * 1024 * 1024) go(back, 'err', 'image');
        const buf = Buffer.from(await file.arrayBuffer());
        const mime = detectImage(buf);
        if (!mime) go(back, 'err', 'image');
        const r = await run('INSERT INTO media (mime, name, data, created_at) VALUES (?,?,?,?)', [mime, clip(file.name, 190), buf, nowStamp()]);
        data[f.name] = r.insertId;
      }
    } else {
      const max = f.type === 'rich' ? 60000 : f.type === 'textarea' ? 6000 : 400;
      data[f.name] = clip(raw, max);
      if (f.type === 'date' && data[f.name] && !isDate(data[f.name])) data[f.name] = '';
    }
    if (f.required && !data[f.name]) go(back, 'err', 'required');
  }
  if (cfg.fields.some((f) => f.name === 'slug')) {
    data.slug = slugify(data.slug || data[cfg.slugFrom]);
    if (!data.slug) go(back, 'err', 'required');
    const dup = await one(`SELECT id FROM ${cfg.table} WHERE slug = ? AND id <> ?`, [data.slug, id]);
    if (dup) go(back, 'err', 'slug');
  }
  if (key === 'posts' && !data.published_at) data.published_at = todayStr();

  const cols = Object.keys(data);
  if (id) {
    await run(`UPDATE ${cfg.table} SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`, [...cols.map((c) => data[c]), id]);
  } else {
    await run(`INSERT INTO ${cfg.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, cols.map((c) => data[c]));
  }
  clearCache();
  go(back, 'ok', id ? 'saved' : 'created');
}

export async function deleteEntity(fd) {
  await requireAdmin();
  const key = String(fd.get('_entity'));
  const cfg = ENTITIES[key];
  if (!cfg) redirect('/admin/contenu');
  const back = safeBack(fd.get('_back'), `/admin/contenu/${key}`);
  await run(`DELETE FROM ${cfg.table} WHERE id = ?`, [Number(fd.get('id'))]);
  clearCache();
  go(back, 'ok', 'deleted');
}

/* ---------------- Paramètres ---------------- */
export async function saveSettings(fd) {
  await requireAdmin();
  const key = String(fd.get('_group'));
  const group = SETTING_GROUPS[key];
  if (!group) redirect('/admin');
  const back = safeBack(fd.get('_back'), '/admin/parametres');
  const current = await loadSettings();
  for (const f of group.fields) {
    let v = clip(fd.get(f.name), f.type === 'rich' ? 40000 : 6000);
    if (f.required && !v) go(back, 'err', 'required');
    if (f.name === 'whatsapp_number') {
      v = v.replace(/\D/g, '');
      if (/^0\d{9}$/.test(v)) v = '33' + v.slice(1);
      if (v.length < 9 || v.length > 15) go(back, 'err', 'phone');
    }
    if (f.name === 'vat_regime' && !['normal', 'franchise'].includes(v)) v = 'normal';
    if (f.type === 'number') v = String(Math.max(0, Math.round(parseNum(v, 0))));
    if (f.name === 'iban' || f.name === 'bic') v = v.replace(/\s+/g, '').toUpperCase();
    {
      const row = await one('SELECT k FROM settings WHERE k = ?', [f.name]);
      if (row) await run('UPDATE settings SET v = ? WHERE k = ?', [v, f.name]);
      else await run('INSERT INTO settings (k, v) VALUES (?,?)', [f.name, v]);
    }
  }
  clearCache();
  go(back, 'ok', 'saved');
}

/* ---------------- Demandes ---------------- */
export async function updateLead(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const status = String(fd.get('status'));
  if (!LEAD_STATUSES.includes(status)) redirect('/admin/demandes');
  const notes = fd.has('notes') ? clip(fd.get('notes'), 4000) : null;
  if (notes === null) await run('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
  else await run('UPDATE leads SET status = ?, notes = ? WHERE id = ?', [status, notes, id]);
  go(safeBack(fd.get('_back'), `/admin/demandes/${id}`), 'ok', 'saved');
}

export async function deleteLead(fd) {
  await requireAdmin();
  await run('DELETE FROM leads WHERE id = ?', [Number(fd.get('id'))]);
  go('/admin/demandes', 'ok', 'deleted');
}

export async function leadToQuote(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const lead = await one('SELECT * FROM leads WHERE id = ?', [id]);
  if (!lead) redirect('/admin/demandes');
  let client = lead.email ? await one('SELECT id FROM clients WHERE email = ?', [lead.email]) : null;
  if (!client) {
    const r = await run(
      'INSERT INTO clients (kind, name, company, email, phone, notes, created_at) VALUES (?,?,?,?,?,?,?)',
      [lead.company ? 'pro' : 'particulier', lead.name, lead.company, lead.email, lead.phone, `Issu de la demande du ${String(lead.created_at).slice(0, 10)}`, nowStamp()]
    );
    client = { id: r.insertId };
  }
  await run("UPDATE leads SET status = 'devis' WHERE id = ? AND status IN ('nouveau','contacté')", [id]);
  redirect(`/admin/facturation/nouveau?type=devis&client=${client.id}&title=${encodeURIComponent(lead.service || '')}`);
}

/* ---------------- Clients ---------------- */
const CLIENT_FIELDS = ['kind', 'name', 'company', 'email', 'phone', 'address', 'postal_code', 'city', 'siret', 'vat_number', 'notes'];

export async function saveClient(fd) {
  await requireAdmin();
  const id = Number(fd.get('id') || 0);
  const back = safeBack(fd.get('_back'), '/admin/facturation/clients');
  const d = {};
  for (const f of CLIENT_FIELDS) d[f] = clip(fd.get(f), f === 'notes' ? 3000 : 255);
  if (!['pro', 'particulier'].includes(d.kind)) d.kind = 'pro';
  if (!d.name) go(back, 'err', 'required');
  if (id) {
    await run(`UPDATE clients SET ${CLIENT_FIELDS.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`, [...CLIENT_FIELDS.map((c) => d[c]), id]);
    go(back, 'ok', 'saved');
  }
  const r = await run(`INSERT INTO clients (${CLIENT_FIELDS.join(', ')}, created_at) VALUES (${CLIENT_FIELDS.map(() => '?').join(', ')}, ?)`, [...CLIENT_FIELDS.map((c) => d[c]), nowStamp()]);
  go(`/admin/facturation/clients/${r.insertId}`, 'ok', 'created');
}

export async function deleteClient(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const n = await one('SELECT COUNT(*) AS c FROM documents WHERE client_id = ?', [id]);
  if (Number(n.c) > 0) go(`/admin/facturation/clients/${id}`, 'err', 'nodelete');
  await run('DELETE FROM clients WHERE id = ?', [id]);
  go('/admin/facturation/clients', 'ok', 'deleted');
}

/* ---------------- Devis & factures ---------------- */
const EDITABLE = { devis: ['brouillon', 'envoyé'], facture: ['brouillon', 'envoyée'] };

async function nextNumber(type, dateStr) {
  const prefix = type === 'devis' ? 'DEV' : 'FAC';
  const year = dateStr.slice(0, 4);
  const rows = await q('SELECT number FROM documents WHERE number LIKE ?', [`${prefix}-${year}-%`]);
  let max = 0;
  for (const r of rows) max = Math.max(max, parseInt(String(r.number).split('-')[2], 10) || 0);
  return `${prefix}-${year}-${String(max + 1).padStart(4, '0')}`;
}

function cleanLines(json) {
  let arr;
  try {
    arr = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, 60)
    .map((l) => {
      const qty = parseNum(l.qty, 0);
      const vat = parseNum(l.vat, 20);
      return {
        desc: clip(l.desc, 500),
        qty: qty > 0 && qty < 1e6 ? qty : 0,
        unit: UNITS.includes(l.unit) ? l.unit : 'u',
        price: parseEuros(l.price),
        vat: VAT_RATES.includes(vat) ? vat : 20,
      };
    })
    .filter((l) => l.desc && l.qty > 0);
}

export async function saveDocument(fd) {
  await requireAdmin();
  const id = Number(fd.get('id') || 0);
  const settings = await getSettings();
  let doc = id ? await one('SELECT * FROM documents WHERE id = ?', [id]) : null;
  const type = doc ? doc.type : String(fd.get('type')) === 'facture' ? 'facture' : 'devis';
  const back = id ? `/admin/facturation/doc/${id}` : `/admin/facturation/nouveau?type=${type}`;
  if (doc && !EDITABLE[type].includes(doc.status)) go(`/admin/facturation/doc/${id}`, 'err', 'locked');

  const lines = cleanLines(String(fd.get('items_json') || '[]'));
  if (!lines.length) go(back, 'err', 'lines');

  let clientId = Number(fd.get('client_id') || 0);
  if (!clientId) {
    const nm = clip(fd.get('new_name'), 190);
    if (!nm) go(back, 'err', 'client');
    const r = await run('INSERT INTO clients (kind, name, company, email, phone, address, created_at) VALUES (?,?,?,?,?,?,?)', [
      clip(fd.get('new_company'), 190) ? 'pro' : 'particulier',
      nm,
      clip(fd.get('new_company'), 190),
      clip(fd.get('new_email'), 190),
      clip(fd.get('new_phone'), 40),
      clip(fd.get('new_address'), 255),
      nowStamp(),
    ]);
    clientId = r.insertId;
  } else if (!(await one('SELECT id FROM clients WHERE id = ?', [clientId]))) go(back, 'err', 'client');

  const issue = isDate(fd.get('issue_date')) ? String(fd.get('issue_date')) : todayStr();
  const days = Number(type === 'devis' ? settings.quote_validity_days : settings.payment_terms_days) || 30;
  const due = isDate(fd.get('due_date')) ? String(fd.get('due_date')) : addDays(issue, days);
  const regime = doc ? doc.vat_regime : settings.vat_regime === 'franchise' ? 'franchise' : 'normal';
  const t = computeTotals(lines, regime);
  const fields = {
    client_id: clientId,
    issue_date: issue,
    due_date: due,
    title: clip(fd.get('title'), 255),
    items: JSON.stringify(lines),
    total_ht: t.ht,
    total_vat: t.vat,
    total_ttc: t.ttc,
    notes: clip(fd.get('notes'), 4000),
    updated_at: nowStamp(),
  };
  if (doc) {
    const cols = Object.keys(fields);
    await run(`UPDATE documents SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`, [...cols.map((c) => fields[c]), id]);
    go(`/admin/facturation/doc/${id}`, 'ok', 'saved');
  }
  const number = await nextNumber(type, issue);
  const r = await run(
    'INSERT INTO documents (type, number, client_id, status, issue_date, due_date, title, items, vat_regime, total_ht, total_vat, total_ttc, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [type, number, clientId, 'brouillon', issue, due, fields.title, fields.items, regime, t.ht, t.vat, t.ttc, fields.notes, nowStamp(), nowStamp()]
  );
  go(`/admin/facturation/doc/${r.insertId}`, 'ok', 'created');
}

export async function setDocStatus(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const doc = await one('SELECT * FROM documents WHERE id = ?', [id]);
  if (!doc) redirect('/admin/facturation');
  const status = String(fd.get('status'));
  if (!DOC_STATUSES[doc.type].includes(status) || status === 'payée' || status === 'facturé') go(`/admin/facturation/doc/${id}`, 'err', 'locked');
  if (doc.type === 'facture' && doc.status === 'payée') go(`/admin/facturation/doc/${id}`, 'err', 'locked');
  await run('UPDATE documents SET status = ?, updated_at = ? WHERE id = ?', [status, nowStamp(), id]);
  go(`/admin/facturation/doc/${id}`, 'ok', 'status');
}

export async function markPaid(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const doc = await one("SELECT * FROM documents WHERE id = ? AND type = 'facture'", [id]);
  if (!doc || doc.status === 'annulée') redirect('/admin/facturation/factures');
  const paidAt = isDate(fd.get('paid_at')) ? String(fd.get('paid_at')) : todayStr();
  await run("UPDATE documents SET status = 'payée', paid_at = ?, payment_method = ?, updated_at = ? WHERE id = ?", [paidAt, clip(fd.get('payment_method'), 40), nowStamp(), id]);
  go(`/admin/facturation/doc/${id}`, 'ok', 'paid');
}

export async function convertToInvoice(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const d = await one("SELECT * FROM documents WHERE id = ? AND type = 'devis'", [id]);
  if (!d) redirect('/admin/facturation');
  const settings = await getSettings();
  const today = todayStr();
  const number = await nextNumber('facture', today);
  const r = await run(
    'INSERT INTO documents (type, number, client_id, status, issue_date, due_date, title, items, vat_regime, total_ht, total_vat, total_ttc, notes, source_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    ['facture', number, d.client_id, 'brouillon', today, addDays(today, Number(settings.payment_terms_days) || 30), d.title, d.items, d.vat_regime, d.total_ht, d.total_vat, d.total_ttc, d.notes, d.id, nowStamp(), nowStamp()]
  );
  await run("UPDATE documents SET status = 'facturé', updated_at = ? WHERE id = ?", [nowStamp(), id]);
  go(`/admin/facturation/doc/${r.insertId}`, 'ok', 'invoice');
}

export async function deleteDocument(fd) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const d = await one('SELECT * FROM documents WHERE id = ?', [id]);
  if (!d || d.type !== 'devis' || !['brouillon', 'refusé'].includes(d.status)) go(`/admin/facturation/doc/${id}`, 'err', 'nodelete');
  await run('DELETE FROM documents WHERE id = ?', [id]);
  go('/admin/facturation', 'ok', 'deleted');
}

/* ---------------- Sécurité ---------------- */
export async function changePassword(fd) {
  const user = await requireAdmin();
  const back = '/admin/parametres/securite';
  if (!(await rateLimit(`pwd:${user.id}`, 6, 900))) go(back, 'err', 'limit');
  if (!(await checkPassword(String(fd.get('current') || ''), user.pass_hash))) go(back, 'err', 'badpwd');
  const pw = String(fd.get('password') || '');
  if (pw !== String(fd.get('confirm') || '')) go(back, 'err', 'nomatch');
  if (validatePassword(pw)) go(back, 'err', 'weakpwd');
  await run('UPDATE users SET pass_hash = ?, session_version = session_version + 1 WHERE id = ?', [await hashPassword(pw), user.id]);
  await audit('password_changed', { userId: user.id, email: user.email });
  await startSession(await one('SELECT * FROM users WHERE id = ?', [user.id]));
  go(back, 'ok', 'pwd');
}

export async function regenCodes(_prev, fd) {
  const user = await requireAdmin();
  if (!(await rateLimit(`2fa:${user.id}`, 6, 600))) return { error: 'Trop d’essais, patientez.' };
  const step = verifyTotp(decryptText(user.totp_secret_enc), String(fd.get('code') || ''), user.totp_last_step);
  if (!step) return { error: 'Code incorrect.' };
  const { codes, hashes } = newRecoveryCodes();
  await run('UPDATE users SET totp_last_step = ?, recovery = ? WHERE id = ?', [step, JSON.stringify(hashes), user.id]);
  await audit('recovery_regenerated', { userId: user.id, email: user.email });
  return { codes };
}

export async function resetTotp(_prev, fd) {
  const user = await requireAdmin();
  if (!(await rateLimit(`2fa:${user.id}`, 6, 600))) return { error: 'Trop d’essais, patientez.' };
  if (!(await checkPassword(String(fd.get('password') || ''), user.pass_hash))) return { error: 'Mot de passe incorrect.' };
  const step = verifyTotp(decryptText(user.totp_secret_enc), String(fd.get('code') || ''), user.totp_last_step);
  if (!step) return { error: 'Code incorrect.' };
  await run('UPDATE users SET totp_enabled = 0, totp_secret_enc = NULL, recovery = NULL, totp_last_step = 0, session_version = session_version + 1 WHERE id = ?', [user.id]);
  await audit('2fa_reset', { userId: user.id, email: user.email });
  await endSession();
  redirect('/admin/login');
}

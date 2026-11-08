import { createHmac, timingSafeEqual } from 'node:crypto';

function secret() {
  const s = process.env.APP_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production' && process.env.USE_SQLITE !== '1') throw new Error('APP_SECRET manquant ou trop court.');
  return 'dev-only-secret-dev-only-secret-0123456789';
}

// Signature stable (pas de colonne en base) : un lien de partage est valable tant que le document existe.
export function docSignature(doc) {
  return createHmac('sha256', secret()).update(`share:${doc.id}:${doc.number}`).digest('hex').slice(0, 32);
}

export function verifyDocSignature(doc, sig) {
  const a = Buffer.from(docSignature(doc));
  const b = Buffer.from(String(sig || ''));
  return a.length === b.length && timingSafeEqual(a, b);
}

// Numéro de téléphone → format international pour wa.me (par défaut France +33).
export function waPhone(raw) {
  let d = String(raw || '').replace(/[^\d+]/g, '');
  if (!d) return '';
  if (d.startsWith('+')) return d.slice(1).replace(/\D/g, '');
  if (d.startsWith('00')) return d.slice(2);
  if (d.startsWith('0')) return '33' + d.slice(1);
  return d;
}

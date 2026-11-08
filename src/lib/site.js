import 'server-only';
import { q, one } from './db';
import { DEFAULT_SETTINGS } from '@/data/defaults';

const store = (globalThis.__alpiCache ||= new Map());
const TTL = 20000;

async function cached(key, fn) {
  const hit = store.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  const v = await fn();
  store.set(key, { t: Date.now(), v });
  return v;
}

export function clearCache() {
  store.clear();
}

export async function loadSettings() {
  const rows = await q('SELECT k, v FROM settings');
  const out = { ...DEFAULT_SETTINGS };
  for (const r of rows) if (r.k in DEFAULT_SETTINGS) out[r.k] = r.v ?? '';
  return out;
}

export const getSettings = () => cached('settings', loadSettings);
export const getServices = () => cached('services', () => q('SELECT * FROM services WHERE visible = 1 ORDER BY sort, id'));
export const getZones = () => cached('zones', () => q('SELECT * FROM zones WHERE visible = 1 ORDER BY sort, id'));
export const getFaqs = () => cached('faqs', () => q('SELECT * FROM faqs WHERE visible = 1 ORDER BY sort, id'));
export const getPosts = () =>
  cached('posts', () => q('SELECT id, slug, title, excerpt, meta_description, published_at FROM posts WHERE published = 1 ORDER BY published_at DESC, id DESC'));
export const getRealisations = () =>
  cached('realisations', () => q('SELECT * FROM realisations WHERE visible = 1 ORDER BY sort, id DESC'));

export const getSlides = () => cached('slides', () => q('SELECT * FROM slides WHERE visible = 1 ORDER BY sort, id'));

export async function getService(slug) {
  return one('SELECT * FROM services WHERE slug = ? AND visible = 1', [slug]);
}
export async function getZone(slug) {
  return one('SELECT * FROM zones WHERE slug = ? AND visible = 1', [slug]);
}
export async function getPost(slug) {
  return one('SELECT * FROM posts WHERE slug = ? AND published = 1', [slug]);
}

export function siteUrl() {
  let u = String(process.env.SITE_URL || 'http://localhost:3000').trim();
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try {
    return new URL(u).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

export function absUrl(path = '/') {
  return siteUrl() + (path.startsWith('/') ? path : '/' + path);
}

export function isIndexable() {
  return process.env.ALLOW_INDEXING === 'true';
}

export function waLink(settings, text) {
  const n = String(settings.whatsapp_number || '').replace(/\D/g, '');
  const base = `https://wa.me/${n}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telLink(settings) {
  const n = String(settings.whatsapp_number || '').replace(/\D/g, '');
  return `tel:+${n}`;
}

export function groupZones(zones) {
  const groups = { Savoie: { Ville: [], Station: [] }, 'Haute-Savoie': { Ville: [], Station: [] } };
  for (const z of zones) {
    const d = groups[z.dept] || (groups[z.dept] = { Ville: [], Station: [] });
    (d[z.kind] || (d[z.kind] = [])).push(z);
  }
  return groups;
}

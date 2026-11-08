import 'server-only';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { q, one, run, nowStamp } from './db';
import { generateSecret } from './totp';

const SESSION_COOKIE = 'alp_s';
const PRE_COOKIE = 'alp_p';
const SESSION_HOURS = 8;

function appSecret() {
  const s = process.env.APP_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production' && process.env.USE_SQLITE !== '1') {
    throw new Error('APP_SECRET manquant ou trop court (32 caractères minimum).');
  }
  return 'dev-only-secret-dev-only-secret-0123456789';
}

const jwtKey = () => new TextEncoder().encode(appSecret());
const encKey = () => crypto.createHash('sha256').update(appSecret() + ':totp').digest();

export function encryptText(plain) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', encKey(), iv);
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString('base64')).join('.');
}

export function decryptText(payload) {
  const [iv, tag, enc] = payload.split('.').map((p) => Buffer.from(p, 'base64'));
  const d = crypto.createDecipheriv('aes-256-gcm', encKey(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString('utf8');
}

export const hashPassword = (pw) => bcrypt.hash(pw, 12);
export const checkPassword = (pw, hash) => bcrypt.compare(pw, hash);

export function validatePassword(pw) {
  if (!pw || pw.length < 12) return 'Le mot de passe doit contenir au moins 12 caractères.';
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw)) return 'Utilisez des majuscules, des minuscules et au moins un chiffre.';
  return null;
}

export async function clientIp() {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : h.get('x-real-ip') || 'unknown').slice(0, 64);
}

// Limiteur simple stocké en base : true si la tentative est autorisée.
export async function rateLimit(rawKey, max, windowSec) {
  // La clé (IP, e-mail…) est hachée : on ne conserve pas l'adresse en clair.
  const key = crypto.createHash('sha256').update(`${process.env.APP_SECRET || ''}|${rawKey}`).digest('hex');
  const now = Date.now();
  const row = await one('SELECT n, reset_at FROM rate_limits WHERE k = ?', [key]);
  if (!row || Number(row.reset_at) < now) {
    if (row) await run('UPDATE rate_limits SET n = 1, reset_at = ? WHERE k = ?', [now + windowSec * 1000, key]);
    else await run('INSERT INTO rate_limits (k, n, reset_at) VALUES (?,?,?)', [key, 1, now + windowSec * 1000]);
    return true;
  }
  if (Number(row.n) >= max) return false;
  await run('UPDATE rate_limits SET n = n + 1 WHERE k = ?', [key]);
  return true;
}

export async function resetLimit(key) {
  await run('DELETE FROM rate_limits WHERE k = ?', [key]);
}

export async function audit(action, { userId = null, email = null, detail = null } = {}) {
  try {
    const ip = await clientIp();
    await run('INSERT INTO audit (user_id, email, action, detail, ip, created_at) VALUES (?,?,?,?,?,?)', [
      userId,
      email,
      action,
      detail,
      ip,
      nowStamp(),
    ]);
  } catch {
    /* ne jamais bloquer l'action à cause du journal */
  }
}

const cookieBase = () => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== '1',
  path: '/',
});

export async function setPre(userId, stage) {
  const token = await new SignJWT({ uid: userId, stage })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(jwtKey());
  (await cookies()).set(PRE_COOKIE, token, { ...cookieBase(), maxAge: 600 });
}

export async function readPre() {
  const token = (await cookies()).get(PRE_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jwtKey(), { algorithms: ['HS256'] });
    const user = await one('SELECT * FROM users WHERE id = ?', [payload.uid]);
    return user ? { user, stage: payload.stage } : null;
  } catch {
    return null;
  }
}

export async function clearPre() {
  (await cookies()).delete(PRE_COOKIE);
}

export async function startSession(user) {
  const token = await new SignJWT({ uid: user.id, sv: user.session_version })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(jwtKey());
  const c = await cookies();
  c.set(SESSION_COOKIE, token, { ...cookieBase(), maxAge: SESSION_HOURS * 3600 });
  c.delete(PRE_COOKIE);
  await run('UPDATE users SET last_login = ? WHERE id = ?', [nowStamp(), user.id]);
}

export async function endSession() {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
  c.delete(PRE_COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jwtKey(), { algorithms: ['HS256'] });
    const user = await one('SELECT * FROM users WHERE id = ?', [payload.uid]);
    if (!user || user.session_version !== payload.sv || !user.totp_enabled) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSession();
  if (!user) redirect('/admin/login');
  return user;
}

export async function usersCount() {
  const r = await one('SELECT COUNT(*) AS c FROM users');
  return Number(r.c);
}

const recoveryHash = (code) =>
  crypto.createHmac('sha256', appSecret()).update(code.replace(/[^a-z0-9]/gi, '').toLowerCase()).digest('hex');

export function newRecoveryCodes(n = 8) {
  const codes = [];
  for (let i = 0; i < n; i++) {
    const raw = crypto.randomBytes(5).toString('hex');
    codes.push(`${raw.slice(0, 5)}-${raw.slice(5)}`);
  }
  return { codes, hashes: codes.map(recoveryHash) };
}

export function consumeRecovery(user, code) {
  const list = JSON.parse(user.recovery || '[]');
  const h = recoveryHash(code);
  const i = list.indexOf(h);
  if (i < 0) return null;
  list.splice(i, 1);
  return list;
}

export async function listAudit(limit = 15) {
  return q('SELECT * FROM audit ORDER BY id DESC LIMIT ?', [limit]);
}

// Crée (si besoin) le secret TOTP en attente d'activation pour l'utilisateur.
export async function ensurePendingSecret(user) {
  if (user.totp_secret_enc) return decryptText(user.totp_secret_enc);
  const secret = generateSecret();
  await run('UPDATE users SET totp_secret_enc = ? WHERE id = ? AND totp_enabled = 0', [encryptText(secret), user.id]);
  return secret;
}

'use server';
import crypto from 'node:crypto';
import { redirect } from 'next/navigation';
import { one, run, nowStamp } from '@/lib/db';
import {
  hashPassword, checkPassword, validatePassword, rateLimit, resetLimit, clientIp, audit,
  setPre, readPre, startSession, endSession, usersCount, decryptText, newRecoveryCodes, consumeRecovery, getSession,
} from '@/lib/auth';
import { verifyTotp } from '@/lib/totp';

let dummyHash;
const safeEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export async function setupAction(_prev, fd) {
  if ((await usersCount()) > 0) redirect('/admin/login');
  const ip = await clientIp();
  if (!(await rateLimit(`setup:${ip}`, 10, 900))) return { error: 'Trop de tentatives. Réessayez plus tard.' };
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const expected = process.env.SETUP_TOKEN || '';
  if (!expected || !safeEq(String(fd.get('token') || ''), expected)) return { error: 'Jeton d’installation invalide.', email };
  const pw = String(fd.get('password') || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Adresse e-mail invalide.', email };
  if (pw !== String(fd.get('confirm') || '')) return { error: 'Les mots de passe ne correspondent pas.', email };
  const bad = validatePassword(pw);
  if (bad) return { error: bad, email };
  const r = await run('INSERT INTO users (email, pass_hash, totp_enabled, session_version, created_at) VALUES (?,?,0,1,?)', [email, await hashPassword(pw), nowStamp()]);
  await audit('setup', { userId: r.insertId, email });
  await setPre(r.insertId, 'enroll');
  redirect('/admin/enroll');
}

export async function loginAction(_prev, fd) {
  const ip = await clientIp();
  const email = String(fd.get('email') || '').trim().toLowerCase().slice(0, 190);
  const pw = String(fd.get('password') || '');
  if (!(await rateLimit(`login-ip:${ip}`, 15, 900)) || !(await rateLimit(`login-user:${email}`, 6, 900))) {
    return { error: 'Trop de tentatives. Patientez 15 minutes avant de réessayer.', email };
  }
  const user = email ? await one('SELECT * FROM users WHERE email = ?', [email]) : null;
  dummyHash ||= await hashPassword(crypto.randomUUID());
  const ok = await checkPassword(pw, user ? user.pass_hash : dummyHash);
  if (!user || !ok) {
    await audit('login_failed', { email });
    return { error: 'Identifiants incorrects.', email };
  }
  await resetLimit(`login-user:${email}`);
  await audit('password_ok', { userId: user.id, email });
  await setPre(user.id, user.totp_enabled ? '2fa' : 'enroll');
  redirect(user.totp_enabled ? '/admin/login/2fa' : '/admin/enroll');
}

export async function verify2faAction(_prev, fd) {
  const pre = await readPre();
  if (!pre || pre.stage !== '2fa') redirect('/admin/login');
  const { user } = pre;
  if (!(await rateLimit(`2fa:${user.id}`, 6, 600))) return { error: 'Trop d’essais. Patientez 10 minutes.' };
  const code = String(fd.get('code') || '').trim();
  const secret = decryptText(user.totp_secret_enc);
  const step = verifyTotp(secret, code, user.totp_last_step);
  if (step) {
    await run('UPDATE users SET totp_last_step = ? WHERE id = ?', [step, user.id]);
  } else {
    const left = code.length > 6 ? consumeRecovery(user, code) : null;
    if (!left) {
      await audit('2fa_failed', { userId: user.id, email: user.email });
      return { error: 'Code incorrect ou expiré.' };
    }
    await run('UPDATE users SET recovery = ? WHERE id = ?', [JSON.stringify(left), user.id]);
    await audit('recovery_used', { userId: user.id, email: user.email });
  }
  await resetLimit(`2fa:${user.id}`);
  await startSession(user);
  await audit('login', { userId: user.id, email: user.email });
  redirect('/admin');
}

export async function enrollAction(_prev, fd) {
  const pre = await readPre();
  if (!pre || pre.stage !== 'enroll') redirect('/admin/login');
  const { user } = pre;
  if (user.totp_enabled) return { error: 'La double authentification est déjà activée.' };
  if (!(await rateLimit(`2fa:${user.id}`, 8, 600))) return { error: 'Trop d’essais. Patientez 10 minutes.' };
  if (!user.totp_secret_enc) redirect('/admin/enroll');
  const step = verifyTotp(decryptText(user.totp_secret_enc), String(fd.get('code') || ''), 0);
  if (!step) return { error: 'Code incorrect. Vérifiez l’heure de votre téléphone et réessayez.' };
  const { codes, hashes } = newRecoveryCodes();
  await run('UPDATE users SET totp_enabled = 1, totp_last_step = ?, recovery = ? WHERE id = ?', [step, JSON.stringify(hashes), user.id]);
  await audit('2fa_enabled', { userId: user.id, email: user.email });
  return { done: true, codes };
}

// Dernière étape : ouvre la session une fois les codes de secours notés.
export async function finishEnrollAction() {
  const pre = await readPre();
  if (!pre || pre.stage !== 'enroll' || !pre.user.totp_enabled) redirect('/admin/login');
  await startSession(pre.user);
  await audit('login', { userId: pre.user.id, email: pre.user.email });
  redirect('/admin');
}

export async function logoutAction() {
  const u = await getSession();
  if (u) await audit('logout', { userId: u.id, email: u.email });
  await endSession();
  redirect('/admin/login');
}

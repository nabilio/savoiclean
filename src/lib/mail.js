import 'server-only';
import { q } from '@/lib/db';

// Destinataires : tous les comptes admin + LEAD_NOTIFY_TO (facultatif)
export async function adminRecipients() {
  const set = new Set();
  try {
    const rows = await q('SELECT email FROM users');
    rows.forEach((r) => r.email && set.add(String(r.email).trim()));
  } catch {}
  (process.env.LEAD_NOTIFY_TO || '').split(',').forEach((x) => x.trim() && set.add(x.trim()));
  return [...set];
}

// Envoi : SMTP (boîte mail de l'hébergeur) en priorité, sinon Resend. Ne lève jamais d'erreur.
export async function notifyAdmins({ subject, text, replyTo, brand = 'Site' }) {
  try {
    const to = await adminRecipients();
    if (!to.length) return false;
    if (process.env.SMTP_HOST) {
      const nodemailer = (await import('nodemailer')).default;
      const port = Number(process.env.SMTP_PORT || 465);
      const tr = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      });
      await tr.sendMail({
        from: process.env.MAIL_FROM || `${brand} <${process.env.SMTP_USER}>`,
        to,
        replyTo: replyTo || undefined,
        subject,
        text,
      });
      return true;
    }
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || process.env.LEAD_FROM || `${brand} <onboarding@resend.dev>`,
          to,
          reply_to: replyTo || undefined,
          subject,
          text,
        }),
      });
      return true;
    }
  } catch (e) {
    console.error('mail', e?.message);
  }
  return false;
}

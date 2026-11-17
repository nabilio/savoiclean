'use server';
import { headers } from 'next/headers';
import { purgeIfDue } from '@/lib/purge';
import { run, nowStamp } from '@/lib/db';
import { rateLimit, clientIp } from '@/lib/auth';
import { getSettings } from '@/lib/site';
import { notifyAdmins } from '@/lib/mail';

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export async function submitLead(_prev, formData) {
  if (clip(formData.get('website'), 100)) return { ok: true }; // piège anti-robot
  const name = clip(formData.get('name'), 120);
  const company = clip(formData.get('company'), 160);
  const phone = clip(formData.get('phone'), 40);
  const email = clip(formData.get('email'), 190);
  const service = clip(formData.get('service'), 190);
  const zone = clip(formData.get('zone'), 190);
  const message = clip(formData.get('message'), 4000);
  const consent = formData.get('consent');

  const values = { name, company, phone, email, service, zone, message };
  const fail = (error) => ({ ok: false, error, values });

  if (name.length < 2) return fail('Merci d’indiquer votre nom.');
  if (!phone && !email) return fail('Merci d’indiquer un numéro de téléphone ou un e-mail pour vous répondre.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('L’adresse e-mail semble invalide.');
  if (phone && phone.replace(/\D/g, '').length < 8) return fail('Le numéro de téléphone semble invalide.');
  if (message.length < 10) return fail('Décrivez votre besoin en quelques mots (lieu, surface, date souhaitée).');
  if (!consent) return fail('Veuillez accepter le traitement de vos informations pour être recontacté.');

  // Aucune adresse IP n'est utilisée : piège anti-robot + plafond global de demandes par heure.
  if (!(await rateLimit('lead:global', 30, 3600))) return fail('Trop de demandes envoyées. Réessayez dans un moment ou écrivez-nous sur WhatsApp.');

  await run(
    'INSERT INTO leads (name, company, email, phone, service, zone, message, source, status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [name, company, email, phone, service, zone, message, 'site', 'nouveau', nowStamp()]
  );

  purgeIfDue();

  // Notification e-mail à tous les admins (SMTP ou Resend, voir README)
  const s = await getSettings();
  await notifyAdmins({
    brand: s.brand_name,
    replyTo: email,
    subject: `Nouvelle demande de devis – ${name}`,
    text: `Nom : ${name}\nEntreprise : ${company}\nTéléphone : ${phone}\nE-mail : ${email}\nService : ${service}\nLieu : ${zone}\n\n${message}\n\nÀ traiter dans l'administration › Demandes.`,
  });
  return { ok: true };
}

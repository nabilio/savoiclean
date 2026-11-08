import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Diagnostic d'installation : indique seulement si la configuration et la base fonctionnent (aucun secret).
export async function GET() {
  const env = {
    DB_NAME: !!process.env.DB_NAME,
    DB_USER: !!process.env.DB_USER,
    DB_PASSWORD: !!process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST || '(défaut 127.0.0.1)',
    APP_SECRET: !!process.env.APP_SECRET && String(process.env.APP_SECRET).length >= 16,
    SETUP_TOKEN: !!process.env.SETUP_TOKEN,
    SITE_URL: process.env.SITE_URL || '(non défini)',
  };
  try {
    const r = await q('SELECT COUNT(*) AS n FROM services');
    return Response.json({ ok: true, db: 'ok', services: Number(r[0]?.n || 0), env });
  } catch (e) {
    return Response.json({ ok: false, db: 'erreur', code: e?.code || null, message: String(e?.message || e).slice(0, 200), env }, { status: 500 });
  }
}

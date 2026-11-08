import { one } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getSettings } from '@/lib/site';
import { buildDocumentPdf } from '@/lib/pdf';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const user = await getSession();
  if (!user) return new Response('Non autorisé', { status: 401 });
  const { id } = await params;
  const doc = await one('SELECT * FROM documents WHERE id = ?', [Number(id)]);
  if (!doc) return new Response('Introuvable', { status: 404 });
  const client = doc.client_id ? await one('SELECT * FROM clients WHERE id = ?', [doc.client_id]) : null;
  const settings = await getSettings();
  const buf = await buildDocumentPdf({ doc, client, settings });
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${doc.number}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

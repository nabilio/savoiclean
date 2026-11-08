import { one } from '@/lib/db';
import { getSettings } from '@/lib/site';
import { buildDocumentPdf } from '@/lib/pdf';
import { verifyDocSignature } from '@/lib/share';

export const dynamic = 'force-dynamic';

// Lien de partage envoyé au client (WhatsApp / e-mail) : PDF en lecture seule, signé et non devinable.
export async function GET(_req, { params }) {
  const { id, sig } = await params;
  const doc = /^\d+$/.test(id) ? await one('SELECT * FROM documents WHERE id = ?', [Number(id)]) : null;
  if (!doc || !verifyDocSignature(doc, sig)) return new Response('Lien invalide', { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });
  const client = doc.client_id ? await one('SELECT * FROM clients WHERE id = ?', [doc.client_id]) : null;
  const settings = await getSettings();
  const buf = await buildDocumentPdf({ doc, client, settings });
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${doc.number}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

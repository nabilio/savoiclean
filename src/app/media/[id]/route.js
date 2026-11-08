import { one } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) return new Response('Not found', { status: 404 });
  const row = await one('SELECT mime, data FROM media WHERE id = ?', [n]);
  if (!row) return new Response('Not found', { status: 404 });
  return new Response(row.data, {
    headers: {
      'Content-Type': row.mime,
      'Cache-Control': 'public, max-age=86400, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'",
    },
  });
}

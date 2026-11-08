import Link from 'next/link';
import { q } from '@/lib/db';
import { fmtDate } from '@/lib/money';
import { LEAD_STATUSES } from '@/lib/admin-schema';
import { Flash, StatusBadge, PageTitle } from '@/components/admin/Fields';

export const dynamic = 'force-dynamic';

export default async function Leads({ searchParams }) {
  const sp = await searchParams;
  const s = LEAD_STATUSES.includes(sp?.s) ? sp.s : '';
  const rows = s ? await q('SELECT * FROM leads WHERE status = ? ORDER BY id DESC LIMIT 300', [s]) : await q('SELECT * FROM leads ORDER BY id DESC LIMIT 300');
  return (
    <>
      <PageTitle>Demandes de devis</PageTitle>
      <Flash sp={sp} />
      <div className="filters">
        <Link href="/admin/demandes" className={!s ? 'on' : ''}>
          Toutes
        </Link>
        {LEAD_STATUSES.map((x) => (
          <Link key={x} href={`/admin/demandes?s=${x}`} className={s === x ? 'on' : ''}>
            {x}
          </Link>
        ))}
      </div>
      <div className="table-wrap">
        {rows.length === 0 ? (
          <p className="empty">Aucune demande.</p>
        ) : (
          <table className="t">
            <thead>
              <tr>
                <th>Date</th>
                <th>Contact</th>
                <th>Besoin</th>
                <th>Lieu</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td className="muted">{fmtDate(String(l.created_at).slice(0, 10))}</td>
                  <td>
                    <Link href={`/admin/demandes/${l.id}`}>{l.name}</Link>
                    <div className="muted">{[l.company, l.phone, l.email].filter(Boolean).join(' · ')}</div>
                  </td>
                  <td>{l.service || '—'}</td>
                  <td>{l.zone || '—'}</td>
                  <td>
                    <StatusBadge s={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

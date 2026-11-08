import Link from 'next/link';
import { q, todayStr } from '@/lib/db';
import { DOC_STATUSES } from '@/lib/admin-schema';
import { fmtEUR } from '@/lib/money';
import { Flash, PageTitle } from '@/components/admin/Fields';
import DocsTable from '@/components/admin/DocsTable';

export const dynamic = 'force-dynamic';

export default async function Invoices({ searchParams }) {
  const sp = await searchParams;
  const s = DOC_STATUSES.facture.includes(sp?.s) ? sp.s : '';
  const base = "SELECT d.*, c.name AS client_name, c.company AS client_company FROM documents d LEFT JOIN clients c ON c.id = d.client_id WHERE d.type = 'facture'";
  const docs = s ? await q(`${base} AND d.status = ? ORDER BY d.id DESC LIMIT 300`, [s]) : await q(`${base} ORDER BY d.id DESC LIMIT 300`);
  const today = todayStr();
  const open = docs.filter((d) => d.status === 'envoyée').reduce((a, d) => a + d.total_ttc, 0);
  return (
    <>
      <PageTitle
        actions={
          <Link className="btn btn-primary" href="/admin/facturation/nouveau?type=facture">
            + Nouvelle facture
          </Link>
        }
      >
        Factures
      </PageTitle>
      <Flash sp={sp} />
      <div className="filters">
        <Link href="/admin/facturation/factures" className={!s ? 'on' : ''}>
          Toutes
        </Link>
        {DOC_STATUSES.facture.map((x) => (
          <Link key={x} href={`/admin/facturation/factures?s=${encodeURIComponent(x)}`} className={s === x ? 'on' : ''}>
            {x}
          </Link>
        ))}
      </div>
      {open > 0 && <p className="muted">À encaisser dans cette liste : <b>{fmtEUR(open)}</b> TTC</p>}
      <DocsTable docs={docs} today={today} />
    </>
  );
}

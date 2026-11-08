import Link from 'next/link';
import { q, todayStr } from '@/lib/db';
import { DOC_STATUSES } from '@/lib/admin-schema';
import { Flash, PageTitle } from '@/components/admin/Fields';
import DocsTable from '@/components/admin/DocsTable';

export const dynamic = 'force-dynamic';

export default async function Quotes({ searchParams }) {
  const sp = await searchParams;
  const s = DOC_STATUSES.devis.includes(sp?.s) ? sp.s : '';
  const base = "SELECT d.*, c.name AS client_name, c.company AS client_company FROM documents d LEFT JOIN clients c ON c.id = d.client_id WHERE d.type = 'devis'";
  const docs = s ? await q(`${base} AND d.status = ? ORDER BY d.id DESC LIMIT 300`, [s]) : await q(`${base} ORDER BY d.id DESC LIMIT 300`);
  return (
    <>
      <PageTitle
        actions={
          <Link className="btn btn-primary" href="/admin/facturation/nouveau?type=devis">
            + Nouveau devis
          </Link>
        }
      >
        Devis
      </PageTitle>
      <Flash sp={sp} />
      <div className="filters">
        <Link href="/admin/facturation" className={!s ? 'on' : ''}>
          Tous
        </Link>
        {DOC_STATUSES.devis.map((x) => (
          <Link key={x} href={`/admin/facturation?s=${encodeURIComponent(x)}`} className={s === x ? 'on' : ''}>
            {x}
          </Link>
        ))}
      </div>
      <DocsTable docs={docs} today={todayStr()} />
    </>
  );
}

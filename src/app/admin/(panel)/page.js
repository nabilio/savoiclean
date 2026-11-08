import Link from 'next/link';
import { q, one, todayStr } from '@/lib/db';
import { fmtEUR, fmtDate } from '@/lib/money';
import { StatusBadge, PageTitle } from '@/components/admin/Fields';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const today = todayStr();
  const monthStart = today.slice(0, 8) + '01';
  const [nl, quotes, due, overdue, month, leads, docs] = await Promise.all([
    one("SELECT COUNT(*) AS c FROM leads WHERE status = 'nouveau'"),
    one("SELECT COUNT(*) AS c, COALESCE(SUM(total_ttc),0) AS s FROM documents WHERE type = 'devis' AND status = 'envoyé'"),
    one("SELECT COUNT(*) AS c, COALESCE(SUM(total_ttc),0) AS s FROM documents WHERE type = 'facture' AND status = 'envoyée'"),
    one("SELECT COUNT(*) AS c FROM documents WHERE type = 'facture' AND status = 'envoyée' AND due_date < ?", [today]),
    one("SELECT COALESCE(SUM(total_ttc),0) AS s FROM documents WHERE type = 'facture' AND status = 'payée' AND paid_at >= ?", [monthStart]),
    q('SELECT * FROM leads ORDER BY id DESC LIMIT 6'),
    q('SELECT d.*, c.name AS client_name, c.company AS client_company FROM documents d LEFT JOIN clients c ON c.id = d.client_id ORDER BY d.id DESC LIMIT 6'),
  ]);
  return (
    <>
      <PageTitle
        actions={
          <>
            <Link className="btn btn-primary" href="/admin/facturation/nouveau?type=devis">
              + Nouveau devis
            </Link>
            <Link className="btn btn-ghost" href="/admin/facturation/nouveau?type=facture">
              + Nouvelle facture
            </Link>
          </>
        }
      >
        Tableau de bord
      </PageTitle>
      <div className="kpis">
        <Link href="/admin/demandes?s=nouveau" className="kpi" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>Nouvelles demandes</span>
          <b>{Number(nl.c)}</b>
          <small>à traiter</small>
        </Link>
        <div className="kpi">
          <span>Devis en attente</span>
          <b>{Number(quotes.c)}</b>
          <small>{fmtEUR(Number(quotes.s))} TTC</small>
        </div>
        <div className="kpi">
          <span>Factures à encaisser</span>
          <b>{fmtEUR(Number(due.s))}</b>
          <small>
            {Number(due.c)} facture(s){Number(overdue.c) ? ` · ${Number(overdue.c)} en retard` : ''}
          </small>
        </div>
        <div className="kpi">
          <span>Encaissé ce mois-ci</span>
          <b>{fmtEUR(Number(month.s))}</b>
          <small>TTC</small>
        </div>
      </div>

      <div className="box">
        <h2>Dernières demandes</h2>
        {leads.length === 0 ? (
          <p className="empty">Aucune demande pour le moment.</p>
        ) : (
          <div className="table-wrap" style={{ border: 0 }}>
            <table className="t">
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/admin/demandes/${l.id}`}>{l.name}</Link>
                      <div className="muted">{[l.company, l.service].filter(Boolean).join(' · ')}</div>
                    </td>
                    <td>{l.zone}</td>
                    <td className="muted">{fmtDate(String(l.created_at).slice(0, 10))}</td>
                    <td>
                      <StatusBadge s={l.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="box">
        <h2>Derniers devis et factures</h2>
        {docs.length === 0 ? (
          <p className="empty">Aucun document pour le moment.</p>
        ) : (
          <div className="table-wrap" style={{ border: 0 }}>
            <table className="t">
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Link href={`/admin/facturation/doc/${d.id}`}>{d.number}</Link>
                    </td>
                    <td>{d.client_company || d.client_name}</td>
                    <td className="num">{fmtEUR(d.total_ttc)}</td>
                    <td>
                      <StatusBadge s={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

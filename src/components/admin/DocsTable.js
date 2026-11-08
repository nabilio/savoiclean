import Link from 'next/link';
import { fmtEUR, fmtDate } from '@/lib/money';
import { StatusBadge } from './Fields';

export function displayStatus(d, today) {
  return d.type === 'facture' && d.status === 'envoyée' && d.due_date && d.due_date < today ? 'en retard' : d.status;
}

export default function DocsTable({ docs, today, showClient = true }) {
  if (!docs.length) return <p className="empty">Aucun document.</p>;
  return (
    <div className="table-wrap">
      <table className="t">
        <thead>
          <tr>
            <th>N°</th>
            {showClient && <th>Client</th>}
            <th>Objet</th>
            <th>Date</th>
            <th>{docs[0].type === 'devis' ? 'Validité' : 'Échéance'}</th>
            <th className="num">Total TTC</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id}>
              <td>
                <Link href={`/admin/facturation/doc/${d.id}`}>{d.number}</Link>
              </td>
              {showClient && <td>{d.client_company || d.client_name || '—'}</td>}
              <td>{d.title || '—'}</td>
              <td className="muted">{fmtDate(d.issue_date)}</td>
              <td className="muted">{fmtDate(d.due_date)}</td>
              <td className="num">{fmtEUR(d.total_ttc)}</td>
              <td>
                <StatusBadge s={displayStatus(d, today)} />
              </td>
              <td>
                <a href={`/admin/facturation/doc/${d.id}/pdf`} target="_blank" rel="noopener noreferrer">
                  Visualiser
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

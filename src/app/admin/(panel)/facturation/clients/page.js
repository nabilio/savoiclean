import Link from 'next/link';
import { q } from '@/lib/db';
import { Flash, Fold, PageTitle } from '@/components/admin/Fields';
import ClientForm from '@/components/admin/ClientForm';

export const dynamic = 'force-dynamic';

export default async function Clients({ searchParams }) {
  const sp = await searchParams;
  const term = String(sp?.q || '').trim().slice(0, 80);
  const rows = term
    ? await q('SELECT * FROM clients WHERE name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY name LIMIT 300', Array(4).fill(`%${term}%`))
    : await q('SELECT * FROM clients ORDER BY name LIMIT 300');
  return (
    <>
      <PageTitle>Clients</PageTitle>
      <Flash sp={sp} />
      <Fold title="Nouveau client">
        <ClientForm back="/admin/facturation/clients" />
      </Fold>
      <form className="filters" action="/admin/facturation/clients">
        <input className="input" name="q" defaultValue={term} placeholder="Rechercher un client…" style={{ maxWidth: 320, padding: '9px 14px', border: '1.5px solid #cdd8e3', borderRadius: 10 }} />
        <button className="btn btn-ghost btn-sm">Rechercher</button>
      </form>
      <div className="table-wrap">
        {rows.length === 0 ? (
          <p className="empty">Aucun client.</p>
        ) : (
          <table className="t">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Ville</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/facturation/clients/${c.id}`}>{c.company || c.name}</Link>
                    {c.company && <div className="muted">{c.name}</div>}
                  </td>
                  <td>{c.kind === 'pro' ? 'Professionnel' : 'Particulier'}</td>
                  <td className="muted">{[c.phone, c.email].filter(Boolean).join(' · ')}</td>
                  <td>{c.city || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

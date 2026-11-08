import Link from 'next/link';
import { notFound } from 'next/navigation';
import { q, one, todayStr } from '@/lib/db';
import { ConfirmButton } from '@/components/admin/Bits';
import { Flash, PageTitle } from '@/components/admin/Fields';
import ClientForm from '@/components/admin/ClientForm';
import DocsTable from '@/components/admin/DocsTable';
import { deleteClient } from '../../../actions';

export const dynamic = 'force-dynamic';

export default async function ClientPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const c = await one('SELECT * FROM clients WHERE id = ?', [Number(id)]);
  if (!c) notFound();
  const docs = await q('SELECT d.*, ? AS client_name FROM documents d WHERE d.client_id = ? ORDER BY d.id DESC', [c.name, c.id]);
  const editing = sp?.edit === '1';
  const rows = [
    ['Type', c.kind === 'pro' ? 'Professionnel' : 'Particulier'],
    ['Nom du contact', c.name],
    ['Entreprise', c.company],
    ['Téléphone', c.phone],
    ['E-mail', c.email],
    ['Adresse', [c.address, [c.postal_code, c.city].filter(Boolean).join(' ')].filter(Boolean).join('\n')],
    ['SIRET', c.siret],
    ['N° TVA', c.vat_number],
    ['Notes', c.notes],
  ];
  return (
    <>
      <PageTitle
        actions={
          <>
            <Link className="btn btn-primary" href={`/admin/facturation/nouveau?type=devis&client=${c.id}`}>
              + Nouveau devis
            </Link>
            <Link className="btn btn-ghost" href="/admin/facturation/clients">
              ← Clients
            </Link>
          </>
        }
      >
        {c.company || c.name}
      </PageTitle>
      <Flash sp={sp} />
      <div className="box">
        {editing ? (
          <ClientForm client={c} back={`/admin/facturation/clients/${c.id}`} cancelHref={`/admin/facturation/clients/${c.id}`} />
        ) : (
          <>
            <dl className="dl">
              {rows.map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>{k}</dt>
                  <dd>{v || '—'}</dd>
                </div>
              ))}
            </dl>
            <div className="actions-bar">
              <Link className="btn btn-ghost" href={`/admin/facturation/clients/${c.id}?edit=1`}>
                Modifier
              </Link>
            </div>
          </>
        )}
      </div>
      <h2 style={{ fontSize: '1.05rem' }}>Devis et factures</h2>
      <DocsTable docs={docs.map((d) => ({ ...d, client_name: c.name }))} today={todayStr()} showClient={false} />
      <form action={deleteClient} style={{ marginTop: 22 }}>
        <input type="hidden" name="id" value={c.id} />
        <ConfirmButton message="Supprimer ce client ?">Supprimer le client</ConfirmButton>
      </form>
    </>
  );
}

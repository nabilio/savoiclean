import Link from 'next/link';
import { notFound } from 'next/navigation';
import { one } from '@/lib/db';
import { fmtDate } from '@/lib/money';
import { LEAD_STATUSES } from '@/lib/admin-schema';
import { ConfirmButton } from '@/components/admin/Bits';
import { Flash, StatusBadge, PageTitle } from '@/components/admin/Fields';
import { updateLead, deleteLead, leadToQuote } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function LeadPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const lead = await one('SELECT * FROM leads WHERE id = ?', [Number(id)]);
  if (!lead) notFound();
  const editing = sp?.edit === '1';
  const phoneDigits = String(lead.phone || '').replace(/\D/g, '');
  const wa = phoneDigits ? `https://wa.me/${phoneDigits.startsWith('0') ? '33' + phoneDigits.slice(1) : phoneDigits}` : null;
  return (
    <>
      <PageTitle actions={<Link className="btn btn-ghost" href="/admin/demandes">← Retour</Link>}>
        Demande de {lead.name} <StatusBadge s={lead.status} />
      </PageTitle>
      <Flash sp={sp} />
      <div className="box">
        <dl className="dl">
          <dt>Reçue le</dt>
          <dd>{fmtDate(String(lead.created_at).slice(0, 10))}</dd>
          <dt>Nom</dt>
          <dd>{lead.name}</dd>
          <dt>Entreprise</dt>
          <dd>{lead.company || '—'}</dd>
          <dt>Téléphone</dt>
          <dd>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : '—'}</dd>
          <dt>E-mail</dt>
          <dd>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : '—'}</dd>
          <dt>Prestation</dt>
          <dd>{lead.service || '—'}</dd>
          <dt>Lieu</dt>
          <dd>{lead.zone || '—'}</dd>
          <dt>Message</dt>
          <dd>{lead.message}</dd>
        </dl>
        <div className="actions-bar">
          {wa && (
            <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
              Répondre sur WhatsApp
            </a>
          )}
          <form action={leadToQuote}>
            <input type="hidden" name="id" value={lead.id} />
            <button className="btn btn-primary">Créer le client et un devis</button>
          </form>
        </div>
      </div>

      <div className="box">
        <h2>Suivi</h2>
        <div className="row-actions" style={{ marginBottom: 12 }}>
          {LEAD_STATUSES.filter((x) => x !== lead.status).map((x) => (
            <form action={updateLead} key={x}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="status" value={x} />
              <button className="btn btn-ghost btn-sm">Passer à « {x} »</button>
            </form>
          ))}
        </div>
        {editing ? (
          <form action={updateLead}>
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="status" value={lead.status} />
            <div className="field">
              <label htmlFor="notes">Notes internes</label>
              <textarea id="notes" name="notes" defaultValue={lead.notes || ''} />
            </div>
            <div className="actions-bar">
              <button className="btn btn-primary">Enregistrer</button>
              <Link className="btn btn-ghost" href={`/admin/demandes/${lead.id}`}>
                Annuler
              </Link>
            </div>
          </form>
        ) : (
          <>
            <dl className="dl">
              <dt>Notes internes</dt>
              <dd>{lead.notes || '—'}</dd>
            </dl>
            <div className="actions-bar">
              <Link className="btn btn-ghost" href={`/admin/demandes/${lead.id}?edit=1`}>
                Modifier les notes
              </Link>
            </div>
          </>
        )}
      </div>
      <form action={deleteLead}>
        <input type="hidden" name="id" value={lead.id} />
        <ConfirmButton message="Supprimer définitivement cette demande ?">Supprimer la demande</ConfirmButton>
      </form>
    </>
  );
}

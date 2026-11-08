import Link from 'next/link';
import { q } from '@/lib/db';
import { DocEditor } from './Bits';
import { saveDocument } from '@/app/admin/(panel)/actions';
import { UNITS, VAT_RATES } from '@/lib/admin-schema';

export default async function DocForm({ doc, type, defaults = {}, regime, cancelHref }) {
  const clients = await q('SELECT id, name, company FROM clients ORDER BY COALESCE(NULLIF(company,\'\'), name)');
  const lines = doc
    ? JSON.parse(doc.items).map((l) => ({ desc: l.desc, qty: String(l.qty), unit: l.unit, price: (l.price / 100).toFixed(2).replace('.', ','), vat: String(l.vat) }))
    : [];
  const v = doc || defaults;
  return (
    <form action={saveDocument}>
      {doc ? <input type="hidden" name="id" value={doc.id} /> : <input type="hidden" name="type" value={type} />}
      <div className="box">
        <h2>Informations</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="client_id">Client {doc ? '' : '*'}</label>
            <select id="client_id" name="client_id" defaultValue={v.client_id ? String(v.client_id) : ''}>
              <option value="">— Choisir un client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company ? `${c.company} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Objet</label>
            <input id="title" name="title" defaultValue={v.title || ''} placeholder="Ex. Nettoyage de fin de chantier – résidence Les Alpes" />
          </div>
          <div className="field">
            <label htmlFor="issue_date">Date d’émission</label>
            <input id="issue_date" name="issue_date" type="date" defaultValue={v.issue_date || ''} />
          </div>
          <div className="field">
            <label htmlFor="due_date">{type === 'devis' ? 'Valable jusqu’au' : 'Échéance de paiement'}</label>
            <input id="due_date" name="due_date" type="date" defaultValue={v.due_date || ''} />
          </div>
        </div>
        <details className="fold" style={{ marginTop: 14, marginBottom: 0 }} open={false}>
          <summary>Nouveau client (si absent de la liste)</summary>
          <div className="inner">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="new_name">Nom du contact</label>
                <input id="new_name" name="new_name" />
              </div>
              <div className="field">
                <label htmlFor="new_company">Entreprise</label>
                <input id="new_company" name="new_company" />
              </div>
              <div className="field">
                <label htmlFor="new_email">E-mail</label>
                <input id="new_email" name="new_email" type="email" />
              </div>
              <div className="field">
                <label htmlFor="new_phone">Téléphone</label>
                <input id="new_phone" name="new_phone" />
              </div>
              <div className="field full">
                <label htmlFor="new_address">Adresse</label>
                <input id="new_address" name="new_address" />
              </div>
            </div>
          </div>
        </details>
      </div>
      <div className="box">
        <h2>Lignes</h2>
        <DocEditor initialLines={lines} regime={regime} vatRates={VAT_RATES} units={UNITS} />
      </div>
      <div className="box">
        <h2>Notes</h2>
        <div className="field">
          <label htmlFor="notes">Mentions particulières (visibles sur le document)</label>
          <textarea id="notes" name="notes" defaultValue={v.notes || ''} style={{ minHeight: 90 }} placeholder="Ex. Accès au chantier, horaires d’intervention, conditions particulières…" />
        </div>
      </div>
      <div className="actions-bar">
        <button className="btn btn-primary">Enregistrer</button>
        <Link className="btn btn-ghost" href={cancelHref}>
          Annuler
        </Link>
      </div>
    </form>
  );
}

import Link from 'next/link';
import { saveClient } from '@/app/admin/(panel)/actions';

export default function ClientForm({ client, back, cancelHref }) {
  const c = client || {};
  return (
    <form action={saveClient} className="form-grid">
      {c.id ? <input type="hidden" name="id" value={c.id} /> : null}
      <input type="hidden" name="_back" value={back} />
      <div className="field">
        <label htmlFor="kind">Type</label>
        <select id="kind" name="kind" defaultValue={c.kind || 'pro'}>
          <option value="pro">Professionnel</option>
          <option value="particulier">Particulier</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="name">Nom du contact *</label>
        <input id="name" name="name" defaultValue={c.name || ''} required />
      </div>
      <div className="field">
        <label htmlFor="company">Entreprise</label>
        <input id="company" name="company" defaultValue={c.company || ''} />
      </div>
      <div className="field">
        <label htmlFor="phone">Téléphone</label>
        <input id="phone" name="phone" defaultValue={c.phone || ''} />
      </div>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" defaultValue={c.email || ''} />
      </div>
      <div className="field">
        <label htmlFor="address">Adresse</label>
        <input id="address" name="address" defaultValue={c.address || ''} />
      </div>
      <div className="field">
        <label htmlFor="postal_code">Code postal</label>
        <input id="postal_code" name="postal_code" defaultValue={c.postal_code || ''} />
      </div>
      <div className="field">
        <label htmlFor="city">Ville</label>
        <input id="city" name="city" defaultValue={c.city || ''} />
      </div>
      <div className="field">
        <label htmlFor="siret">SIRET</label>
        <input id="siret" name="siret" defaultValue={c.siret || ''} />
      </div>
      <div className="field">
        <label htmlFor="vat_number">N° TVA intracommunautaire</label>
        <input id="vat_number" name="vat_number" defaultValue={c.vat_number || ''} />
      </div>
      <div className="field full">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" defaultValue={c.notes || ''} style={{ minHeight: 80 }} />
      </div>
      <div className="full actions-bar" style={{ marginTop: 0 }}>
        <button className="btn btn-primary">Enregistrer</button>
        {cancelHref ? (
          <Link className="btn btn-ghost" href={cancelHref}>
            Annuler
          </Link>
        ) : null}
      </div>
    </form>
  );
}

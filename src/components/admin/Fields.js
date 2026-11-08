import Link from 'next/link';

const OK = {
  saved: 'Modifications enregistrées.',
  created: 'Élément créé.',
  deleted: 'Élément supprimé.',
  pwd: 'Mot de passe modifié.',
  codes: 'Nouveaux codes de secours générés.',
  status: 'Statut mis à jour.',
  paid: 'Paiement enregistré.',
  invoice: 'Facture créée à partir du devis.',
  admin_added: 'Administrateur ajouté. Il activera la double authentification à sa première connexion.',
  admin_deleted: 'Administrateur supprimé.',
};
const ERR = {
  required: 'Un champ obligatoire est manquant.',
  slug: 'Cette adresse de page est déjà utilisée.',
  image: 'Image invalide (JPG, PNG ou WebP, 4 Mo maximum).',
  locked: 'Ce document est verrouillé et ne peut plus être modifié.',
  lines: 'Ajoutez au moins une ligne avec une désignation et un prix.',
  client: 'Choisissez un client ou saisissez son nom.',
  bad2fa: 'Code de double authentification incorrect ou expiré.',
  badpwd: 'Mot de passe actuel incorrect.',
  weakpwd: 'Mot de passe trop faible (12 caractères min., majuscule, minuscule, chiffre).',
  nomatch: 'Les mots de passe ne correspondent pas.',
  code: 'Code de vérification incorrect.',
  limit: 'Trop de tentatives, réessayez plus tard.',
  nodelete: 'Suppression impossible pour ce document (une facture ne se supprime pas : annulez-la).',
  adm_email: 'Adresse e-mail invalide.',
  adm_exists: 'Un administrateur utilise déjà cette adresse e-mail.',
  adm_last: 'Suppression impossible : il faut garder au moins un administrateur avec la double authentification activée.',
  adm_missing: 'Administrateur introuvable.',
  phone: 'Numéro WhatsApp invalide (indicatif pays + numéro, chiffres uniquement).',
};

export function Flash({ sp }) {
  if (sp?.ok && OK[sp.ok]) return <div className="alert ok" role="status">{OK[sp.ok]}</div>;
  if (sp?.err && ERR[sp.err]) return <div className="alert err" role="alert">{ERR[sp.err]}</div>;
  return null;
}

export function Field({ f, value }) {
  const id = `f-${f.name}`;
  const v = value ?? '';
  let input;
  if (f.type === 'textarea' || f.type === 'rich') {
    input = <textarea id={id} name={f.name} defaultValue={v} className={f.type === 'rich' ? 'tall' : ''} required={f.required} />;
  } else if (f.type === 'select') {
    input = (
      <select id={id} name={f.name} defaultValue={v || f.options[0]}>
        {f.options.map((o) => (
          <option key={o} value={o}>
            {f.optionLabels?.[o] || o}
          </option>
        ))}
      </select>
    );
  } else if (f.type === 'bool') {
    return (
      <label className="check" style={{ alignItems: 'center', fontSize: '0.95rem', color: 'var(--ink)' }}>
        <input type="checkbox" name={f.name} defaultChecked={Number(value ?? 1) === 1} />
        <span>{f.label}</span>
      </label>
    );
  } else if (f.type === 'image') {
    input = (
      <div>
        {v ? <img className="thumb" src={`/media/${v}`} alt="" style={{ marginBottom: 8 }} /> : null}
        <input id={id} name={`${f.name}__file`} type="file" accept="image/jpeg,image/png,image/webp" />
      </div>
    );
  } else {
    input = <input id={id} name={f.name} type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} defaultValue={v} required={f.required} step={f.type === 'number' ? 'any' : undefined} />;
  }
  return (
    <div className={`field ${f.full ? 'full' : ''}`}>
      <label htmlFor={id}>
        {f.label} {f.required ? '*' : ''}
        {f.help ? <span className="hint"> — {f.help}</span> : null}
      </label>
      {input}
    </div>
  );
}

export function ReadOnly({ fields, data }) {
  return (
    <dl className="dl">
      {fields.map((f) => {
        let val = data[f.name];
        if (f.type === 'bool') val = Number(val) === 1 ? 'Oui' : 'Non';
        else if (f.type === 'image') val = val ? <img className="thumb" src={`/media/${val}`} alt="" /> : '—';
        else if (f.type === 'select' && f.optionLabels) val = f.optionLabels[val] || val;
        else if (f.name === 'iban' && val) val = String(val).replace(/(.{4})/g, '$1 ').trim();
        return (
          <div key={f.name} style={{ display: 'contents' }}>
            <dt>{f.label}</dt>
            <dd>{val === '' || val === null || val === undefined ? '—' : val}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function StatusBadge({ s }) {
  const map = {
    nouveau: 'red', contacté: 'blue', devis: 'amber', gagné: 'green', perdu: '',
    brouillon: '', envoyé: 'blue', envoyée: 'blue', accepté: 'green', refusé: 'red', facturé: 'green', payée: 'green', annulée: '', 'en retard': 'red',
  };
  return <span className={`badge ${map[s] ?? ''}`}>{s}</span>;
}

export function Fold({ title, children, open = false }) {
  return (
    <details className="fold" open={open}>
      <summary>{title}</summary>
      <div className="inner">{children}</div>
    </details>
  );
}

export function PageTitle({ children, actions }) {
  return (
    <div className="adm-title">
      <h1>{children}</h1>
      {actions ? <div className="row-actions">{actions}</div> : null}
    </div>
  );
}

export { Link };

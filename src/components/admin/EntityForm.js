import Link from 'next/link';
import { ENTITIES } from '@/lib/admin-schema';
import { Field } from './Fields';
import { saveEntity } from '@/app/admin/(panel)/actions';

export default function EntityForm({ entity, item, back }) {
  const cfg = ENTITIES[entity];
  return (
    <form action={saveEntity} className="form-grid">
      <input type="hidden" name="_entity" value={entity} />
      <input type="hidden" name="_back" value={back} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      {cfg.fields.map((f) => (
        <Field key={f.name} f={f} value={item ? item[f.name] : f.type === 'bool' ? 1 : f.name === 'published' ? 0 : ''} />
      ))}
      <div className="full actions-bar" style={{ marginTop: 0 }}>
        <button className="btn btn-primary">{item ? 'Enregistrer' : 'Ajouter'}</button>
        {item ? (
          <Link className="btn btn-ghost" href={back}>
            Annuler
          </Link>
        ) : null}
      </div>
    </form>
  );
}

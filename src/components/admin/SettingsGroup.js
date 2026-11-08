import Link from 'next/link';
import { SETTING_GROUPS } from '@/lib/admin-schema';
import { Field, ReadOnly } from './Fields';
import { saveSettings } from '@/app/admin/(panel)/actions';

export default function SettingsGroup({ groupKey, settings, editing, back }) {
  const g = SETTING_GROUPS[groupKey];
  return (
    <div className="box">
      <h2>{g.title}</h2>
      {editing ? (
        <form action={saveSettings} className="form-grid">
          <input type="hidden" name="_group" value={groupKey} />
          <input type="hidden" name="_back" value={back} />
          {g.fields.map((f) => (
            <Field key={f.name} f={f} value={settings[f.name]} />
          ))}
          <div className="full actions-bar" style={{ marginTop: 0 }}>
            <button className="btn btn-primary">Enregistrer</button>
            <Link className="btn btn-ghost" href={back}>
              Annuler
            </Link>
          </div>
        </form>
      ) : (
        <>
          <ReadOnly fields={g.fields} data={settings} />
          <div className="actions-bar">
            <Link className="btn btn-ghost" href={`${back}?edit=1`}>
              Modifier
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

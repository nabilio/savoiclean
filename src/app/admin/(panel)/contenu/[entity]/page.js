import Link from 'next/link';
import { notFound } from 'next/navigation';
import { q } from '@/lib/db';
import { ENTITIES } from '@/lib/admin-schema';
import { fmtDate } from '@/lib/money';
import { ConfirmButton } from '@/components/admin/Bits';
import { Flash, Fold, PageTitle } from '@/components/admin/Fields';
import EntityForm from '@/components/admin/EntityForm';
import { deleteEntity } from '../../actions';

export const dynamic = 'force-dynamic';

function summaryText(cfg, item, key) {
  const parts = [];
  for (const k of cfg.summary) {
    const v = item[k];
    if (k === 'visible') parts.push(Number(v) ? 'Visible' : 'Masqué');
    else if (k === 'published') parts.push(Number(v) ? 'Publié' : 'Brouillon');
    else if (k === 'published_at') parts.push(fmtDate(v));
    else if (v) parts.push(v);
  }
  return parts.join(' · ');
}

export default async function EntityPage({ params, searchParams }) {
  const { entity } = await params;
  const sp = await searchParams;
  const cfg = ENTITIES[entity];
  if (!cfg) notFound();
  const items = await q(`SELECT * FROM ${cfg.table} ORDER BY ${cfg.order}`);
  const editId = Number(sp?.edit || 0);
  const back = `/admin/contenu/${entity}`;
  return (
    <>
      <PageTitle>{cfg.plural}</PageTitle>
      <p className="muted" style={{ marginTop: -6 }}>
        {cfg.intro}
      </p>
      <Flash sp={sp} />
      <Fold title={`Ajouter ${/^[aeiouyéè]/i.test(cfg.label) ? 'une' : 'un'} ${cfg.label}`.replace('un réalisation', 'une réalisation').replace('une service', 'un service').replace('une zone', 'une zone')}>
        <EntityForm entity={entity} back={back} />
      </Fold>
      <div className="table-wrap">
        <table className="t">
          <tbody>
            {items.length === 0 && (
              <tr>
                <td className="empty">Rien pour le moment.</td>
              </tr>
            )}
            {items.map((it) =>
              it.id === editId ? (
                <tr key={it.id}>
                  <td colSpan={2} style={{ background: '#f9fbfd' }}>
                    <h3 style={{ margin: '4px 0 14px' }}>Modifier : {it[cfg.titleField]}</h3>
                    <EntityForm entity={entity} item={it} back={back} />
                    <form action={deleteEntity} style={{ marginTop: 14 }}>
                      <input type="hidden" name="_entity" value={entity} />
                      <input type="hidden" name="_back" value={back} />
                      <input type="hidden" name="id" value={it.id} />
                      <ConfirmButton message="Supprimer définitivement cet élément ?">Supprimer</ConfirmButton>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={it.id}>
                  <td>
                    <b>{it[cfg.titleField]}</b>
                    <div className="muted">{summaryText(cfg, it, entity)}</div>
                  </td>
                  <td className="num">
                    <Link className="btn btn-ghost btn-sm" href={`${back}?edit=${it.id}`}>
                      Modifier
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

import { requireAdmin } from '@/lib/auth';
import { q } from '@/lib/db';
import { Flash, Fold, PageTitle } from '@/components/admin/Fields';
import { ConfirmButton } from '@/components/admin/Bits';
import { addAdmin, deleteAdmin } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function Admins({ searchParams }) {
  const sp = await searchParams;
  const me = await requireAdmin();
  const users = await q('SELECT id, email, totp_enabled, created_at, last_login FROM users ORDER BY id');
  return (
    <>
      <PageTitle>Administrateurs</PageTitle>
      <Flash sp={sp} />
      <div className="box">
        <h2>Comptes ayant accès à l’administration</h2>
        <div className="table-wrap" style={{ border: 0 }}>
          <table className="t">
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Double authentification</th>
                <th>Dernière connexion</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.email} {u.id === me.id ? <span className="badge">Vous</span> : null}
                  </td>
                  <td>{u.totp_enabled ? <span className="badge green">Activée</span> : <span className="badge">En attente de la 1re connexion</span>}</td>
                  <td>{u.last_login ? u.last_login.slice(0, 16) : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    {users.length > 1 ? (
                      <form action={deleteAdmin}>
                        <input type="hidden" name="id" value={u.id} />
                        <ConfirmButton
                          className="btn btn-danger btn-sm"
                          message={
                            u.id === me.id
                              ? 'Supprimer votre propre accès ? Vous serez déconnecté et ne pourrez plus vous connecter avec ce compte.'
                              : `Supprimer l’accès de ${u.email} ? Cette personne ne pourra plus se connecter.`
                          }
                        >
                          Supprimer
                        </ConfirmButton>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Pour <b>remplacer</b> un administrateur : ajoutez le nouveau compte, connectez-vous une première fois avec lui (il active sa double authentification), puis supprimez l’ancien.
          Au moins un compte avec la double authentification activée est toujours conservé.
        </p>
      </div>
      <Fold title="Ajouter un administrateur">
        <form action={addAdmin} className="form-grid" style={{ maxWidth: 560 }}>
          <div className="field full">
            <label htmlFor="ae">E-mail du nouvel administrateur</label>
            <input id="ae" name="email" type="email" autoComplete="off" required />
          </div>
          <div className="field">
            <label htmlFor="ap">Mot de passe provisoire</label>
            <input id="ap" name="password" type="password" autoComplete="new-password" required minLength={12} />
          </div>
          <div className="field">
            <label htmlFor="ac">Confirmation</label>
            <input id="ac" name="confirm" type="password" autoComplete="new-password" required minLength={12} />
          </div>
          <div className="field full">
            <label htmlFor="cur">Votre mot de passe (pour confirmer)</label>
            <input id="cur" name="current" type="password" autoComplete="current-password" required />
          </div>
          <p className="muted full" style={{ margin: 0 }}>
            12 caractères minimum, avec majuscule, minuscule et chiffre. Transmettez ce mot de passe à la personne : elle pourra le changer ensuite dans Sécurité, et activera la double authentification à sa première connexion.
          </p>
          <div className="full">
            <button className="btn btn-primary">Ajouter l’administrateur</button>
          </div>
        </form>
      </Fold>
    </>
  );
}

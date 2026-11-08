import { requireAdmin, listAudit } from '@/lib/auth';
import { Flash, Fold, PageTitle } from '@/components/admin/Fields';
import { RegenCodesForm, ResetTotpForm } from '@/components/admin/SecurityForms';
import { changePassword } from '../../actions';

export const dynamic = 'force-dynamic';

const LABELS = {
  setup: 'Création du compte',
  password_ok: 'Mot de passe validé',
  login: 'Connexion réussie',
  login_failed: 'Échec de connexion',
  '2fa_failed': 'Code 2FA incorrect',
  '2fa_enabled': '2FA activée',
  '2fa_reset': '2FA réinitialisée',
  recovery_used: 'Code de secours utilisé',
  recovery_regenerated: 'Codes de secours régénérés',
  password_changed: 'Mot de passe modifié',
  logout: 'Déconnexion',
  admin_added: 'Administrateur ajouté',
  admin_deleted: 'Administrateur supprimé',
};

export default async function Security({ searchParams }) {
  const sp = await searchParams;
  const user = await requireAdmin();
  const log = await listAudit(15);
  const codesLeft = JSON.parse(user.recovery || '[]').length;
  return (
    <>
      <PageTitle>Sécurité du compte</PageTitle>
      <Flash sp={sp} />
      <div className="box">
        <h2>Compte administrateur</h2>
        <dl className="dl">
          <dt>E-mail</dt>
          <dd>{user.email}</dd>
          <dt>Double authentification</dt>
          <dd>
            <span className="badge green">Activée</span> (application d’authentification)
          </dd>
          <dt>Codes de secours restants</dt>
          <dd>{codesLeft}</dd>
        </dl>
      </div>
      <Fold title="Changer le mot de passe">
        <form action={changePassword} className="form-grid" style={{ maxWidth: 560 }}>
          <div className="field full">
            <label htmlFor="cur">Mot de passe actuel</label>
            <input id="cur" name="current" type="password" autoComplete="current-password" required />
          </div>
          <div className="field">
            <label htmlFor="np">Nouveau mot de passe</label>
            <input id="np" name="password" type="password" autoComplete="new-password" required minLength={12} />
          </div>
          <div className="field">
            <label htmlFor="cp">Confirmation</label>
            <input id="cp" name="confirm" type="password" autoComplete="new-password" required minLength={12} />
          </div>
          <div className="full">
            <button className="btn btn-primary">Modifier le mot de passe</button>
          </div>
        </form>
      </Fold>
      <Fold title="Codes de secours">
        <RegenCodesForm />
      </Fold>
      <Fold title="Changer de téléphone (réinitialiser la 2FA)">
        <ResetTotpForm />
      </Fold>
      <div className="box">
        <h2>Dernières activités</h2>
        <div className="table-wrap" style={{ border: 0 }}>
          <table className="t">
            <thead>
              <tr>
                <th>Date (UTC)</th>
                <th>Événement</th>
                <th>Adresse IP</th>
              </tr>
            </thead>
            <tbody>
              {log.map((l) => (
                <tr key={l.id}>
                  <td className="muted">{l.created_at}</td>
                  <td>{LABELS[l.action] || l.action}</td>
                  <td className="muted">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

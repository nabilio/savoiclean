'use client';
import { useActionState } from 'react';
import { regenCodes, resetTotp } from '@/app/admin/(panel)/actions';

export function RegenCodesForm() {
  const [state, action, pending] = useActionState(regenCodes, {});
  return (
    <form action={action}>
      {state.error && <div className="alert err">{state.error}</div>}
      {state.codes ? (
        <>
          <div className="alert ok">Nouveaux codes générés : les anciens ne fonctionnent plus. Notez-les maintenant.</div>
          <div className="codes">
            {state.codes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="field" style={{ maxWidth: 320 }}>
            <label htmlFor="rc-code">Code actuel de l’application</label>
            <input id="rc-code" name="code" inputMode="numeric" autoComplete="one-time-code" required />
          </div>
          <button className="btn btn-primary" disabled={pending} style={{ marginTop: 12 }}>
            Générer de nouveaux codes
          </button>
        </>
      )}
    </form>
  );
}

export function ResetTotpForm() {
  const [state, action, pending] = useActionState(resetTotp, {});
  return (
    <form action={action}>
      {state.error && <div className="alert err">{state.error}</div>}
      <p className="muted">Utile si vous changez de téléphone. Vous serez déconnecté et devrez scanner un nouveau QR code.</p>
      <div className="form-grid" style={{ maxWidth: 560 }}>
        <div className="field">
          <label htmlFor="rt-pw">Mot de passe</label>
          <input id="rt-pw" name="password" type="password" autoComplete="current-password" required />
        </div>
        <div className="field">
          <label htmlFor="rt-code">Code actuel</label>
          <input id="rt-code" name="code" inputMode="numeric" autoComplete="one-time-code" required />
        </div>
      </div>
      <button className="btn btn-danger" disabled={pending} style={{ marginTop: 12 }}>
        Réinitialiser la double authentification
      </button>
    </form>
  );
}

'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { setupAction, loginAction, verify2faAction, enrollAction, finishEnrollAction } from '@/app/admin/(auth)/actions';

function Err({ state }) {
  return state?.error ? (
    <div className="alert err" role="alert">
      {state.error}
    </div>
  ) : null;
}

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAction, {});
  return (
    <form action={action}>
      <Err state={state} />
      <div className="field">
        <label htmlFor="token">Jeton d’installation</label>
        <input id="token" name="token" type="password" autoComplete="off" required />
      </div>
      <div className="field">
        <label htmlFor="email">E-mail administrateur</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe <span className="hint">(12 caractères min., majuscule, minuscule, chiffre)</span></label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={12} />
      </div>
      <div className="field">
        <label htmlFor="confirm">Confirmer le mot de passe</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={12} />
      </div>
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? 'Création…' : 'Créer le compte'}
      </button>
    </form>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action}>
      <Err state={state} />
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus defaultValue={state.email} />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? 'Vérification…' : 'Continuer'}
      </button>
    </form>
  );
}

export function TwoFaForm() {
  const [state, action, pending] = useActionState(verify2faAction, {});
  return (
    <form action={action}>
      <Err state={state} />
      <div className="field">
        <label htmlFor="code">Code à 6 chiffres</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required autoFocus placeholder="123456" />
      </div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Application perdue ? Saisissez un de vos codes de secours à la place.
      </p>
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? 'Vérification…' : 'Se connecter'}
      </button>
      <p style={{ textAlign: 'center', marginTop: 14 }}>
        <Link href="/admin/login">Retour</Link>
      </p>
    </form>
  );
}

export function EnrollForm({ qr, secret, enabled }) {
  const [state, action, pending] = useActionState(enrollAction, {});
  if (state.done) {
    return (
      <div>
        <div className="alert ok">Double authentification activée.</div>
        <p>
          <b>Conservez ces codes de secours</b> dans un endroit sûr. Chacun ne sert qu’une fois si vous perdez votre téléphone. Ils ne seront plus affichés.
        </p>
        <div className="codes">
          {state.codes.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <form action={finishEnrollAction}>
          <button className="btn btn-primary btn-block">J’ai noté mes codes, accéder à l’administration</button>
        </form>
      </div>
    );
  }
  if (enabled) {
    return (
      <div className="alert info">
        La double authentification est déjà activée. <Link href="/admin/login">Se connecter</Link>
      </div>
    );
  }
  return (
    <form action={action}>
      <Err state={state} />
      <ol style={{ paddingLeft: 18 }}>
        <li>Installez une application d’authentification (Google Authenticator, Microsoft Authenticator, Authy, 1Password…).</li>
        <li>Scannez ce QR code :</li>
      </ol>
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <div className="qr">
          <img src={qr} alt="QR code d’activation de la double authentification" width="200" height="200" />
        </div>
        <p className="muted" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
          Ou saisissez la clé : <b>{secret}</b>
        </p>
      </div>
      <div className="field">
        <label htmlFor="code">Entrez le code à 6 chiffres affiché</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required placeholder="123456" />
      </div>
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? 'Vérification…' : 'Activer la double authentification'}
      </button>
    </form>
  );
}

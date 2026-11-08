'use client';
import { useActionState } from 'react';
import { submitLead } from '@/app/(site)/actions';
import Icon from './Icon';

export default function ContactForm({ services = [], zones = [], defaultService = '', defaultZone = '', waHref }) {
  const [state, action, pending] = useActionState(submitLead, { ok: false });
  const v = state.values || {};

  if (state.ok) {
    return (
      <div className="alert ok" role="status">
        <b>Merci, votre demande est bien reçue.</b>
        <br />
        Nous vous répondons rapidement avec un devis. Pour une urgence, vous pouvez aussi nous écrire directement sur{' '}
        <a href={waHref} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </div>
    );
  }

  return (
    <form action={action} className="form-grid" noValidate>
      {state.error && (
        <div className="alert err full" role="alert">
          {state.error}
        </div>
      )}
      <div className="field">
        <label htmlFor="cf-name">Nom et prénom *</label>
        <input id="cf-name" name="name" autoComplete="name" required defaultValue={v.name} maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="cf-company">
          Entreprise <span className="hint">(facultatif)</span>
        </label>
        <input id="cf-company" name="company" autoComplete="organization" defaultValue={v.company} maxLength={160} />
      </div>
      <div className="field">
        <label htmlFor="cf-phone">Téléphone</label>
        <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} maxLength={40} />
      </div>
      <div className="field">
        <label htmlFor="cf-email">E-mail</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" defaultValue={v.email} maxLength={190} />
      </div>
      <div className="field">
        <label htmlFor="cf-service">Prestation souhaitée</label>
        <select id="cf-service" name="service" defaultValue={v.service ?? defaultService}>
          <option value="">Choisir…</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="Autre">Autre besoin de nettoyage</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-zone">Ville ou station</label>
        <input id="cf-zone" name="zone" list="cf-zones" defaultValue={v.zone ?? defaultZone} maxLength={190} placeholder="Ex. Chambéry, Courchevel…" />
        <datalist id="cf-zones">
          {zones.map((z) => (
            <option key={z} value={z} />
          ))}
        </datalist>
      </div>
      <div className="field full">
        <label htmlFor="cf-message">Votre besoin *</label>
        <textarea id="cf-message" name="message" required defaultValue={v.message} maxLength={4000} placeholder="Type de lieu, surface, date souhaitée, fréquence…" />
      </div>
      <div className="hp" aria-hidden="true">
        <label>
          Ne pas remplir <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check full">
        <input type="checkbox" name="consent" required />
        <span>J’accepte que ces informations soient utilisées pour répondre à ma demande de devis. Elles ne sont jamais revendues.</span>
      </label>
      <div className="full">
        <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
          {pending ? 'Envoi…' : 'Envoyer ma demande'} <Icon name="arrow" size={18} />
        </button>
      </div>
    </form>
  );
}

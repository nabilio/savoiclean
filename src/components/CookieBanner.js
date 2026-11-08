'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'sc_cookie_consent';

function read() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function write(v) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  try {
    document.cookie = `${KEY}=${v}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax`;
  } catch {}
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!read()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('open-cookie-settings', reopen);
    return () => window.removeEventListener('open-cookie-settings', reopen);
  }, []);

  if (!open) return null;
  const choose = (v) => {
    write(v);
    setOpen(false);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="ck-title">
      <h2 id="ck-title">Vos cookies, votre choix</h2>
      <p>
        Ce site n’utilise que des cookies strictement nécessaires à son fonctionnement et aucun traceur publicitaire. Si des outils de mesure d’audience ou
        de cartographie sont ajoutés un jour, ils ne s’activeront qu’avec votre accord. Vous pouvez changer d’avis à tout moment.{' '}
        <Link href="/confidentialite">En savoir plus</Link>
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-primary" onClick={() => choose('refused')}>
          Refuser
        </button>
        <button type="button" className="btn btn-primary" onClick={() => choose('accepted')}>
          Accepter
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsLink() {
  return (
    <button type="button" className="linklike" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>
      Gérer mes cookies
    </button>
  );
}

import { CookieSettingsLink } from '@/components/CookieBanner';
import Link from 'next/link';
import Icon from './Icon';
import MobileNav from './MobileNav';
import { LogoMark, BrandName } from './Mountains';
import { waLink, telLink } from '@/lib/site';

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/professionnels-stations-de-ski', label: 'Pros & stations' },
  { href: '/zones', label: 'Zones' },
  { href: '/blog', label: 'Conseils' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Header({ settings }) {
  const wa = waLink(settings, 'Bonjour, je souhaite un devis pour une prestation de nettoyage.');
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className="hide-sm">
            <svg width="14" height="14" viewBox="0 0 84 84" aria-hidden="true">
              <path d="M42 4C59 25 72 38 72 52a30 30 0 0 1-60 0C12 38 25 25 42 4z" fill="#fff" />
              <path d="M51 40c-3-5-9-6-13-3s-3 8 3 10l6 2c6 2 6 8 1 10-4 2-10 1-14-3" fill="none" stroke="#17958f" strokeWidth="6" strokeLinecap="round" />
            </svg>{' '}
            {settings.brand_tagline}
          </span>
          <span>
            <Icon name="phone" size={16} /> <a href={telLink(settings)}>{settings.phone_display}</a>
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand" aria-label={`${settings.brand_name} – accueil`}>
            <LogoMark size={52} />
            <span>
              <b>
                <BrandName name={settings.brand_name} />
              </b>
              <small>{settings.brand_slogan || 'Propre. Net. Sans souci.'}</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className="link">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header-cta">
            <Link href="/contact#devis" className="btn btn-ghost btn-sm">
              Devis gratuit
            </Link>
            <a className="btn btn-wa btn-sm" href={wa} target="_blank" rel="noopener noreferrer">
              <Icon name="chat" size={18} /> WhatsApp
            </a>
            <MobileNav links={NAV} waHref={wa} />
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer({ settings, services, zones }) {
  const wa = waLink(settings, 'Bonjour, je souhaite un devis.');
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link href="/" className="brand" style={{ marginBottom: 14 }}>
                <LogoMark size={48} />
                <span>
                  <b>
                    <BrandName name={settings.brand_name} />
                  </b>
                  <small>{settings.brand_slogan || 'Propre. Net. Sans souci.'}</small>
                </span>
              </Link>
              <p>
                Nettoyage professionnel de fin de chantier, ménage et entretien de locaux, lavage auto, débarras. Savoie et Haute-Savoie, stations de ski incluses.
              </p>
              <p>
                <a href={telLink(settings)}>{settings.phone_display}</a>
                {settings.email ? (
                  <>
                    <br />
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </>
                ) : null}
              </p>
            </div>
            <div>
              <h4>Services</h4>
              <ul>
                {services.slice(0, 8).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>{s.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/services">Tous les services</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Entreprise</h4>
              <ul>
                <li>
                  <Link href="/professionnels-stations-de-ski">Professionnels &amp; stations</Link>
                </li>
                <li>
                  <Link href="/zones">Zones d’intervention</Link>
                </li>
                <li>
                  <Link href="/blog">Conseils &amp; actualités</Link>
                </li>
                <li>
                  <Link href="/contact#devis">Demander un devis</Link>
                </li>
                <li>
                  <Link href="/mentions-legales">Mentions légales</Link>
                </li>
                <li>
                  <Link href="/confidentialite">Confidentialité</Link>
                </li>
                <li>
                  <CookieSettingsLink />
                </li>
              </ul>
            </div>
            <div>
              <h4>Disponibilité</h4>
              <p>{settings.hours}</p>
              <a className="btn btn-wa btn-sm" href={wa} target="_blank" rel="noopener noreferrer">
                <Icon name="chat" size={18} /> Écrire sur WhatsApp
              </a>
            </div>
          </div>
          <div className="footer-zones" aria-label="Zones d’intervention">
            {zones.slice(0, 8).map((z) => (
              <Link key={z.slug} href={`/zones/${z.slug}`}>
                {z.name}
              </Link>
            ))}
            <Link href="/zones">Toutes nos zones</Link>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {settings.legal_name || settings.brand_name}. Tous droits réservés.
            </span>
            <span>Nettoyage en Savoie (73) et Haute-Savoie (74)</span>
            {settings.credit_text ? (
              <span className="credit">
                {/^https?:\/\//.test(settings.credit_url || '') ? (
                  <a href={settings.credit_url} target="_blank" rel="noopener noreferrer">
                    {settings.credit_text}
                  </a>
                ) : (
                  settings.credit_text
                )}
              </span>
            ) : null}
          </div>
        </div>
      </footer>
      <a className="fab" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contacter sur WhatsApp">
        <Icon name="chat" size={22} /> WhatsApp
      </a>
      <div className="mbar">
        <a href={telLink(settings)}>
          <Icon name="phone" size={18} /> Appeler
        </a>
        <a className="wa" href={wa} target="_blank" rel="noopener noreferrer">
          <Icon name="chat" size={18} /> WhatsApp
        </a>
        <Link className="devis" href="/contact#devis">
          Devis
        </Link>
      </div>
    </>
  );
}

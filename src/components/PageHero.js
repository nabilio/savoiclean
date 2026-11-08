import Link from 'next/link';
import Mountains from './Mountains';

export default function PageHero({ title, lead, crumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="container">
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                / {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </span>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </section>
  );
}

export function crumbsLd(items, absUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Accueil', href: '/' }, ...items].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? absUrl(c.href) : undefined,
    })),
  };
}

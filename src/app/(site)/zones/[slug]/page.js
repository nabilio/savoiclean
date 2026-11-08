import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import Rich from '@/components/Rich';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getZone, getZones, getServices, getSettings, waLink, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const z = await getZone(slug);
  if (!z) return {};
  const title = `Nettoyage professionnel ${z.kind === 'Station' ? 'à' : 'à'} ${z.name} (${z.dept}) – fin de chantier, ménage, débarras`;
  const description = `Entreprise de nettoyage à ${z.name} : fin de chantier, ménage de locaux pros, chalets et locations, lavage voiture, débarras. Devis gratuit en ${z.dept}.`;
  return { title, description, alternates: { canonical: `/zones/${z.slug}` }, openGraph: { title, description, url: `/zones/${z.slug}` } };
}

export default async function ZonePage({ params }) {
  const { slug } = await params;
  const [zone, zones, services, settings] = await Promise.all([getZone(slug), getZones(), getServices(), getSettings()]);
  if (!zone) notFound();
  const wa = waLink(settings, `Bonjour, je souhaite un devis de nettoyage à ${zone.name}.`);
  const nearby = zones.filter((z) => z.dept === zone.dept && z.slug !== zone.slug && z.kind === zone.kind).slice(0, 10);
  const station = zone.kind === 'Station';

  const ld = [
    crumbsLd([{ label: 'Zones d’intervention', href: '/zones' }, { label: zone.name }], absUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${settings.brand_name} – nettoyage ${zone.name}`,
      url: absUrl(`/zones/${zone.slug}`),
      telephone: `+${String(settings.whatsapp_number).replace(/\D/g, '')}`,
      areaServed: { '@type': 'Place', name: `${zone.name}, ${zone.dept}` },
      parentOrganization: { '@type': 'Organization', name: settings.brand_name, url: absUrl('/') },
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ label: 'Zones d’intervention', href: '/zones' }, { label: zone.name }]}
        title={`Nettoyage professionnel à ${zone.name}`}
        lead={`${station ? 'Station de ski' : 'Ville'} · ${zone.dept}`}
      />
      <section className="section">
        <div className="container layout-2">
          <article>
            <h2>Entreprise de nettoyage à {zone.name}</h2>
            <p>{zone.blurb}</p>
            {zone.body ? <Rich text={zone.body} /> : null}
            <p>
              {station
                ? `En station, le calendrier est dicté par la saison : ouverture, vacances scolaires, changements de clientèle le week-end, fermeture. Nous planifions nos équipes pour que vos logements, locaux et commerces de ${zone.name} soient prêts à temps.`
                : `Que vous soyez une entreprise, un commerce, un syndic ou un particulier, nous intervenons à ${zone.name} selon un planning fixé avec vous, y compris en horaires décalés ou le week-end.`}
            </p>

            <h2 style={{ marginTop: 38 }}>Nos prestations à {zone.name}</h2>
            <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))' }}>
              {services.map((x) => (
                <Link key={x.slug} href={`/services/${x.slug}`} className="card">
                  <span className="ico-badge">
                    <Icon name={x.icon} />
                  </span>
                  <h3>{x.name}</h3>
                  <span className="more">
                    Voir la prestation <Icon name="arrow" size={16} />
                  </span>
                </Link>
              ))}
            </div>

            {nearby.length > 0 && (
              <>
                <h2 style={{ marginTop: 44 }}>Nous intervenons aussi à proximité</h2>
                <div className="chips">
                  {nearby.map((z) => (
                    <Link key={z.slug} href={`/zones/${z.slug}`} className={`chip ${z.kind === 'Station' ? 'station' : ''}`}>
                      {z.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>
          <aside className="sticky">
            <div className="side-card">
              <h3>Devis gratuit à {zone.name}</h3>
              <p className="muted" style={{ marginBottom: 10 }}>
                Indiquez votre besoin et la date souhaitée.
              </p>
              <Link href={`/contact?zone=${encodeURIComponent(zone.name)}`} className="btn btn-primary">
                Demander un devis <Icon name="arrow" size={18} />
              </Link>
              <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                <Icon name="chat" size={20} /> WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

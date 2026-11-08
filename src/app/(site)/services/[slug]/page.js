import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import Rich from '@/components/Rich';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getService, getServices, getZones, getSettings, waLink, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return {
    title: s.meta_title || s.name,
    description: s.meta_description || s.short,
    keywords: s.keywords ? s.keywords.split(',').map((k) => k.trim()).filter(Boolean) : undefined,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.meta_title || s.name, description: s.meta_description || s.short, url: `/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const [service, services, zones, settings] = await Promise.all([getService(slug), getServices(), getZones(), getSettings()]);
  if (!service) notFound();
  const wa = waLink(settings, `Bonjour, je souhaite un devis pour : ${service.name}.`);
  const others = services.filter((x) => x.slug !== service.slug).slice(0, 6);
  const stations = zones.filter((z) => z.kind === 'Station').slice(0, 14);
  const villes = zones.filter((z) => z.kind === 'Ville').slice(0, 10);

  const ld = [
    crumbsLd([{ label: 'Services', href: '/services' }, { label: service.name }], absUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.meta_description || service.short,
      url: absUrl(`/services/${service.slug}`),
      serviceType: service.name,
      provider: { '@type': 'LocalBusiness', name: settings.brand_name, url: absUrl('/'), telephone: `+${String(settings.whatsapp_number).replace(/\D/g, '')}` },
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Savoie' }, { '@type': 'AdministrativeArea', name: 'Haute-Savoie' }],
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ label: 'Services', href: '/services' }, { label: service.name }]}
        title={`${service.name} en Savoie et Haute-Savoie`}
        lead={service.short}
      />
      <section className="section">
        <div className="container layout-2">
          <article>
            <Rich text={service.body} />

            <h2 style={{ marginTop: 44 }}>Où intervenons-nous ?</h2>
            <p>
              Nous réalisons cette prestation en Savoie et en Haute-Savoie : dans les villes de vallée comme dans les stations de ski.
            </p>
            <div className="chips" style={{ marginBottom: 14 }}>
              {villes.map((z) => (
                <Link key={z.slug} className="chip" href={`/zones/${z.slug}`}>
                  {z.name}
                </Link>
              ))}
            </div>
            <div className="chips">
              {stations.map((z) => (
                <Link key={z.slug} className="chip station" href={`/zones/${z.slug}`}>
                  {z.name}
                </Link>
              ))}
            </div>
          </article>
          <aside className="sticky">
            <div className="side-card">
              <h3>Devis gratuit</h3>
              <p className="muted" style={{ marginBottom: 10 }}>
                Décrivez votre besoin : réponse rapide avec un devis détaillé.
              </p>
              <Link href={`/contact?service=${encodeURIComponent(service.name)}`} className="btn btn-primary">
                Demander un devis <Icon name="arrow" size={18} />
              </Link>
              <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                <Icon name="chat" size={20} /> WhatsApp
              </a>
            </div>
            <div className="side-card" style={{ marginTop: 18 }}>
              <h3>Autres services</h3>
              <ul className="mini-list">
                {others.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/services/${x.slug}`}>{x.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

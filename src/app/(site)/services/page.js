import Link from 'next/link';
import Icon from '@/components/Icon';
import { serviceImg } from '@/lib/service-img';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getServices, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Services de nettoyage en Savoie et Haute-Savoie',
  description:
    'Tous nos services : nettoyage de fin de chantier, ménage de bureaux, lavage voiture intérieur et extérieur, débarras, vitres, chalets, hôtels, copropriétés, industrie.',
  alternates: { canonical: '/services' },
};

export default async function Services() {
  const services = await getServices();
  return (
    <>
      <JsonLd data={crumbsLd([{ label: 'Services' }], absUrl)} />
      <PageHero
        crumbs={[{ label: 'Services' }]}
        title="Nos services de nettoyage"
        lead="Fin de chantier, ménage professionnel, lavage auto, débarras et bien plus : une offre complète en Savoie et Haute-Savoie."
      />
      <section className="section">
        <div className="container">
          <div className="cards">
            {services.map((x) => (
              <Link key={x.slug} href={`/services/${x.slug}`} className="card card-photo">
                <span className="card-img">
                  <img src={serviceImg(x.slug)} alt="" loading="lazy" width="600" height="400" />
                </span>
                <span>
                  <span className={`tag ${x.audience === 'B2B' ? 'b2b' : ''}`}>{x.audience === 'B2B' ? 'Professionnels' : x.audience === 'Tous' ? 'Pros & particuliers' : x.audience}</span>
                </span>
                <h3>{x.name}</h3>
                <p>{x.short}</p>
                <span className="more">
                  Détails de la prestation <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

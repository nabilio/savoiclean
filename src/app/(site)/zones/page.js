import Link from 'next/link';
import Icon from '@/components/Icon';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getZones, groupZones, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Zones d’intervention : nettoyage en Savoie, Haute-Savoie et stations de ski',
  description:
    'Nettoyage professionnel à Chambéry, Annecy, Albertville, Chamonix, Courchevel, Méribel, Val Thorens, Megève, Morzine et dans toutes les stations de Savoie et Haute-Savoie.',
  alternates: { canonical: '/zones' },
};

export default async function Zones() {
  const zones = await getZones();
  const grouped = groupZones(zones);
  return (
    <>
      <JsonLd data={crumbsLd([{ label: 'Zones d’intervention' }], absUrl)} />
      <PageHero
        crumbs={[{ label: 'Zones d’intervention' }]}
        title="Zones d’intervention : Savoie et Haute-Savoie"
        lead="Dans les villes de vallée comme dans les stations de ski, nous nous déplaçons pour vos chantiers, vos locaux, vos logements et vos véhicules."
      />
      <section className="section">
        <div className="container">
          {Object.entries(grouped).map(([dept, kinds]) => (
            <div key={dept} style={{ marginBottom: 46 }}>
              <h2>
                <Icon name="pin" size={28} /> {dept}
              </h2>
              {kinds.Ville.length > 0 && (
                <>
                  <h3>Villes et vallées</h3>
                  <div className="cards" style={{ marginBottom: 26 }}>
                    {kinds.Ville.map((z) => (
                      <Link key={z.slug} href={`/zones/${z.slug}`} className="card">
                        <h3>Nettoyage à {z.name}</h3>
                        <p>{z.blurb}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {kinds.Station.length > 0 && (
                <>
                  <h3>Stations de ski</h3>
                  <div className="chips">
                    {kinds.Station.map((z) => (
                      <Link key={z.slug} href={`/zones/${z.slug}`} className="chip station">
                        {z.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

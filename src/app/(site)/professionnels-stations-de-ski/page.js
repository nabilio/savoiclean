import Link from 'next/link';
import Icon from '@/components/Icon';
import { serviceImg } from '@/lib/service-img';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getServices, getZones, getSettings, waLink, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nettoyage pour professionnels et stations de ski en Savoie et Haute-Savoie',
  description:
    'Société de nettoyage pour hôtels, résidences de tourisme, conciergeries, chalets, commerces et entreprises en stations de ski de Savoie et Haute-Savoie : contrats saisonniers, changements de clientèle, fin de chantier.',
  alternates: { canonical: '/professionnels-stations-de-ski' },
};

const SEASON = [
  ['Avant la saison', 'Remise en état complète : sols, vitres, textiles, cuisines, sanitaires, extérieurs. Vos logements et locaux sont prêts pour l’ouverture.', 'sparkle'],
  ['Pendant la saison', 'Ménage de changement de clientèle, entretien régulier des parties communes, renfort pendant les vacances scolaires.', 'calendar'],
  ['Après la saison', 'Nettoyage de fermeture, grand ménage, débarras, remise en état avant travaux ou avant l’été.', 'snow'],
  ['Chantiers et rénovations', 'Nettoyage de fin de chantier pour livrer à temps avant l’ouverture ou avant la remise des clés.', 'brush'],
];

export default async function Pros() {
  const [services, zones, settings] = await Promise.all([getServices(), getZones(), getSettings()]);
  const wa = waLink(settings, 'Bonjour, je représente un établissement professionnel et je souhaite un devis de nettoyage.');
  const b2b = services.filter((x) => x.audience === 'B2B' || x.slug.includes('voiture'));
  const stations = zones.filter((z) => z.kind === 'Station');

  return (
    <>
      <JsonLd data={crumbsLd([{ label: 'Professionnels & stations de ski' }], absUrl)} />
      <PageHero
        crumbs={[{ label: 'Professionnels & stations de ski' }]}
        title="Nettoyage pour professionnels et stations de ski"
        lead={settings.b2b_text}
      />

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Offre B2B</span>
            <h2>Un prestataire unique pour tous vos besoins de propreté</h2>
            <p>
              Hôtels, résidences de tourisme, conciergeries, agences immobilières, restaurants, commerces, remontées mécaniques, entreprises du bâtiment, syndics : chaque activité a ses contraintes. Nous construisons une offre sur mesure, à l’année ou à la saison.
            </p>
            <ul className="checks">
              {[
                'Contrat d’entretien ou intervention ponctuelle',
                'Tarif forfaitaire par logement, par surface ou par passage',
                'Planning calé sur vos arrivées, vos départs et vos horaires',
                'Devis détaillé, facturation mensuelle groupée',
                'Un interlocuteur unique, joignable par WhatsApp',
              ].map((t) => (
                <li key={t}>
                  <Icon name="check" /> {t}
                </li>
              ))}
            </ul>
            <div className="hero-actions">
              <Link href="/contact#devis" className="btn btn-primary">
                Demander un devis pro <Icon name="arrow" size={18} />
              </Link>
              <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                <Icon name="chat" size={20} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="panel">
            <h3>Tout au long de l’année</h3>
            <ul className="checks">
              {SEASON.map(([t, d]) => (
                <li key={t}>
                  <Icon name="check" />
                  <span>
                    <b>{t}</b>
                    <br />
                    <span className="muted">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Prestations pour professionnels</span>
            <h2>Les services les plus demandés en station</h2>
          </div>
          <div className="cards">
            {b2b.map((x) => (
              <Link key={x.slug} href={`/services/${x.slug}`} className="card card-photo">
                <span className="card-img">
                  <img src={serviceImg(x)} alt="" loading="lazy" width="600" height="400" />
                </span>
                <h3>{x.name}</h3>
                <p>{x.short}</p>
                <span className="more">
                  En savoir plus <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Stations desservies</span>
            <h2>Nous intervenons dans les stations de Savoie et Haute-Savoie</h2>
          </div>
          <div className="chips">
            {stations.map((z) => (
              <Link key={z.slug} href={`/zones/${z.slug}`} className="chip">
                {z.name}
              </Link>
            ))}
          </div>
          <div className="cta-band" style={{ marginTop: 48 }}>
            <div>
              <h2>Préparez votre saison dès maintenant</h2>
              <p>Les créneaux de début de saison partent vite : réservez votre planning à l’avance.</p>
            </div>
            <Link href="/contact#devis" className="btn btn-accent">
              Réserver mon créneau <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

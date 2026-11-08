import Link from 'next/link';
import Icon from '@/components/Icon';
import { serviceImg } from '@/lib/service-img';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import HeroSlider from '@/components/HeroSlider';
import { getSettings, getServices, getZones, getFaqs, getRealisations, getSlides, groupZones, waLink, telLink, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: { absolute: `${s.brand_name} – Nettoyage fin de chantier, ménage pro, lavage auto et débarras en Savoie` },
    description:
      'Entreprise de nettoyage en Savoie et Haute-Savoie : fin de chantier, ménage de bureaux et locaux pros, lavage voiture intérieur/extérieur, débarras, vitres, chalets et stations de ski. Devis gratuit.',
    alternates: { canonical: '/' },
    openGraph: { title: `${s.brand_name} – Nettoyage professionnel en Savoie et Haute-Savoie`, url: '/' },
  };
}

const STEPS = [
  ['Vous nous contactez', 'Formulaire, appel ou WhatsApp : décrivez votre besoin, votre lieu et vos dates.'],
  ['Devis gratuit', 'Visite ou analyse de photos, puis un devis détaillé, clair et sans engagement.'],
  ['Intervention planifiée', 'Une équipe équipée intervient à la date prévue, y compris en horaires décalés.'],
  ['Contrôle et facture', 'Contrôle qualité, reprise si besoin, puis facture simple, avec suivi pour les contrats.'],
];

export default async function Home() {
  const [s, services, zones, faqs, realisations, slideRows] = await Promise.all([getSettings(), getServices(), getZones(), getFaqs(), getRealisations(), getSlides()]);
  const slides = slideRows
    .map((r) => ({ src: r.image_id ? `/media/${r.image_id}` : r.image_url, alt: r.alt || r.title || '', caption: r.title || '' }))
    .filter((r) => r.src);
  const grouped = groupZones(zones);
  const wa = waLink(s, 'Bonjour, je souhaite un devis pour une prestation de nettoyage.');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': absUrl('/#entreprise'),
        name: s.brand_name,
        url: absUrl('/'),
        description: 'Entreprise de nettoyage professionnel en Savoie et Haute-Savoie : fin de chantier, ménage de locaux, lavage auto, débarras.',
        telephone: `+${String(s.whatsapp_number).replace(/\D/g, '')}`,
        email: s.email || undefined,
        priceRange: '€€',
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Savoie' },
          { '@type': 'AdministrativeArea', name: 'Haute-Savoie' },
          ...zones.slice(0, 30).map((z) => ({ '@type': 'Place', name: z.name })),
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services de nettoyage',
          itemListElement: services.map((x) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: x.name, url: absUrl(`/services/${x.slug}`) },
          })),
        },
        sameAs: [s.facebook_url, s.instagram_url, s.google_business_url].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': absUrl('/#site'),
        url: absUrl('/'),
        name: s.brand_name,
        inLanguage: 'fr-FR',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
          <h1>
            {String(s.hero_title || '')
              .split(/(\*[^*]+\*)/)
              .map((part, i) => (part.startsWith('*') && part.endsWith('*') ? <span key={i} className="hl">{part.slice(1, -1)}</span> : part))}
          </h1>
          <p className="lead">{s.hero_subtitle}</p>
          <div className="hero-actions">
            <Link href="/contact#devis" className="btn btn-accent">
              Demander un devis gratuit <Icon name="arrow" size={18} />
            </Link>
            <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
              <Icon name="chat" size={20} /> Écrire sur WhatsApp
            </a>
          </div>
          <ul className="hero-tags">
            <li>
              <Icon name="check" size={16} /> Fin de chantier
            </li>
            <li>
              <Icon name="check" size={16} /> Ménage &amp; entretien pro
            </li>
            <li>
              <Icon name="check" size={16} /> Lavage auto intérieur / extérieur
            </li>
            <li>
              <Icon name="check" size={16} /> Débarras
            </li>
          </ul>
          </div>
          <HeroSlider slides={slides} />
        </div>
      </section>

      <section className="trust" aria-label="Nos engagements">
        <div className="container trust-grid">
          {[
            ['x', 'Devis gratuit', 'Détaillé et sans engagement'],
            ['x', 'Réponse rapide', 'Sous 24 h, WhatsApp inclus'],
            ['x', 'Finition soignée', 'Matériel et produits pros'],
            ['x', 'Savoie & Haute-Savoie', 'Vallées et stations de ski'],
          ].map(([i, a, b]) => (
            <div key={a} className="trust-item">
              <span className="tick" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span>
                <b>{a}</b>
                <small>{b}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Nos services</span>
            <h2>Tout le nettoyage, un seul interlocuteur</h2>
            <p>
              Du nettoyage de fin de chantier au lavage de voiture intérieur et extérieur, en passant par le ménage de bureaux, le débarras ou les chalets de location : une offre complète pour les professionnels et les particuliers.
            </p>
          </div>
          <div className="cards">
            {services.slice(0, 8).map((x) => (
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
          <p style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/services" className="btn btn-primary">
              Voir tous nos services <Icon name="arrow" size={18} />
            </Link>
          </p>
        </div>
      </section>

      <section className="section b2b" id="professionnels">
        <div className="container split">
          <div>
            <span className="eyebrow">
              <Icon name="mountain" size={16} /> B2B &amp; stations de ski
            </span>
            <h2>{s.b2b_title}</h2>
            <p>{s.b2b_text}</p>
            <ul className="checks" style={{ margin: '20px 0 28px' }}>
              <li>
                <Icon name="check" /> Contrats d’entretien et forfaits saisonniers
              </li>
              <li>
                <Icon name="check" /> Ménage de changement de clientèle le samedi
              </li>
              <li>
                <Icon name="check" /> Ouverture et fermeture de saison, remise en état
              </li>
              <li>
                <Icon name="check" /> Facturation mensuelle groupée, interlocuteur unique
              </li>
            </ul>
            <div className="hero-actions" style={{ margin: 0 }}>
              <Link href="/professionnels-stations-de-ski" className="btn btn-accent">
                Offre professionnels <Icon name="arrow" size={18} />
              </Link>
              <a href={wa} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                <Icon name="chat" size={18} /> Parler à un conseiller
              </a>
            </div>
          </div>
          <div className="panel">
            <img
              src={s.b2b_image ? `/media/${s.b2b_image}` : '/img/hotel.jpg'}
              alt={s.b2b_image ? '' : 'Chariot de ménage et aspirateur dans un couloir d’hôtel'}
              width="1000"
              height="1500"
              loading="lazy"
              className="panel-photo"
            />
            <h3>Nos prestations s’adressent à</h3>
            <ul className="checks">
              {['Hôtels et résidences de tourisme', 'Conciergeries et agences immobilières', 'Propriétaires de chalets', 'Restaurants et commerces', 'Syndics et copropriétés', 'Entreprises du bâtiment et promoteurs'].map((t) => (
                <li key={t}>
                  <Icon name="check" /> {t}
                </li>
              ))}
            </ul>
            <div className="stat-row">
              <div className="stat">
                <b>73 &amp; 74</b>
                <span>Savoie et Haute-Savoie</span>
              </div>
              <div className="stat">
                <b>Gratuit</b>
                <span>Devis détaillé, sans engagement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Comment ça marche</span>
            <h2>Un process simple, du devis à la facture</h2>
          </div>
          <ol className="steps">
            {STEPS.map(([t, d]) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Pourquoi nous choisir</span>
            <h2>{s.about_title}</h2>
            <p>{s.about_text}</p>
            <p>
              Entreprise de nettoyage en Savoie et en Haute-Savoie, nous réalisons le nettoyage de fin de chantier, le ménage de bureaux et de locaux professionnels, le lavage de voiture intérieur et extérieur, le débarras de caves, greniers et logements, le nettoyage de vitres, la remise en état de chalets et de locations saisonnières, ainsi que l’entretien d’hôtels, de résidences et de copropriétés.
            </p>
          </div>
          <div className="cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[
              ['24 h', 'Réactivité', 'Réponse rapide et planning respecté, même en haute saison.'],
              ['0 €', 'Devis clair', 'Un prix détaillé, sans surprise, validé avant intervention.'],
              ['Pro', 'Finition soignée', 'Matériel et produits professionnels adaptés à chaque surface.'],
              ['73·74', 'Proximité', 'Vallées et stations de Savoie et Haute-Savoie.'],
            ].map(([i, t, d]) => (
              <div key={t} className="card why">
                <b className="why-fig">{i}</b>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {realisations.length > 0 && (
        <section className="section tint">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Réalisations</span>
              <h2>Quelques interventions récentes</h2>
            </div>
            <div className="gallery">
              {realisations.slice(0, 6).map((r) => (
                <figure key={r.id}>
                  {r.image_id ? <img src={`/media/${r.image_id}`} alt={`${r.title}${r.place ? ' – ' + r.place : ''}`} loading="lazy" width="800" height="600" /> : null}
                  <figcaption>
                    <b>{r.title}</b>
                    <span>{[r.service, r.place].filter(Boolean).join(' · ')}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="zones">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Zones d’intervention</span>
            <h2>Nettoyage en Savoie et Haute-Savoie, jusqu’en station</h2>
            <p>De Chambéry à Annecy, des vallées aux stations de ski : retrouvez votre commune ou votre station.</p>
          </div>
          {Object.entries(grouped).map(([dept, kinds]) => (
            <div className="zone-block" key={dept}>
              <h3>
                <Icon name="pin" /> {dept}
              </h3>
              <div className="chips">
                {kinds.Ville.map((z) => (
                  <Link key={z.slug} href={`/zones/${z.slug}`} className="chip">
                    {z.name}
                  </Link>
                ))}
              </div>
              {kinds.Station.length > 0 && (
                <details className="zone-more">
                  <summary>Stations de ski ({kinds.Station.length})</summary>
                  <div className="chips">
                    {kinds.Station.map((z) => (
                      <Link key={z.slug} href={`/zones/${z.slug}`} className="chip">
                        {z.name}
                      </Link>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section tint" id="faq">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Questions fréquentes</span>
            <h2>Vos questions, nos réponses</h2>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.id}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container cta-final-in">
          <div>
            <h2>Un chantier, un local, une saison à préparer ?</h2>
            <p>Décrivez votre besoin : devis gratuit et réponse rapide.</p>
          </div>
          <div className="hero-actions" style={{ margin: 0 }}>
            <Link href="/contact#devis" className="btn btn-accent">
              Demander un devis gratuit <Icon name="arrow" size={18} />
            </Link>
            <a href={telLink(s)} className="btn btn-light">
              <Icon name="phone" size={18} /> {s.phone_display}
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Parlons de votre besoin</h2>
            <p>Décrivez votre projet : nous revenons vers vous rapidement avec un devis gratuit et sans engagement.</p>
            <ul className="contact-list">
              <li>
                <span className="ico-badge">
                  <Icon name="chat" />
                </span>
                <span>
                  <b>WhatsApp</b>
                  <small>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      {s.phone_display}
                    </a>
                  </small>
                </span>
              </li>
              <li>
                <span className="ico-badge">
                  <Icon name="phone" />
                </span>
                <span>
                  <b>Téléphone</b>
                  <small>
                    <a href={telLink(s)}>{s.phone_display}</a>
                  </small>
                </span>
              </li>
              {s.email ? (
                <li>
                  <span className="ico-badge">
                    <Icon name="mail" />
                  </span>
                  <span>
                    <b>E-mail</b>
                    <small>
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </small>
                  </span>
                </li>
              ) : null}
              <li>
                <span className="ico-badge">
                  <Icon name="clock" />
                </span>
                <span>
                  <b>Disponibilité</b>
                  <small>{s.hours}</small>
                </span>
              </li>
            </ul>
            <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
              <Icon name="chat" size={20} /> Écrire sur WhatsApp
            </a>
          </div>
          <div className="panel">
            <h3>Demande de devis gratuit</h3>
            <ContactForm services={services.map((x) => x.name)} zones={zones.map((z) => z.name)} waHref={wa} />
          </div>
        </div>
      </section>
    </>
  );
}

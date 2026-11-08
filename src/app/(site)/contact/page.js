import Icon from '@/components/Icon';
import ContactForm from '@/components/ContactForm';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getSettings, getServices, getZones, waLink, telLink, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact et devis gratuit – nettoyage en Savoie et Haute-Savoie',
  description: 'Demandez un devis gratuit de nettoyage (fin de chantier, ménage, lavage auto, débarras) en Savoie et Haute-Savoie : formulaire, téléphone ou WhatsApp.',
  alternates: { canonical: '/contact' },
};

export default async function Contact({ searchParams }) {
  const sp = await searchParams;
  const [s, services, zones] = await Promise.all([getSettings(), getServices(), getZones()]);
  const wa = waLink(s, 'Bonjour, je souhaite un devis pour une prestation de nettoyage.');
  const defaultService = services.find((x) => x.name === sp?.service)?.name || '';
  const defaultZone = zones.find((z) => z.name === sp?.zone)?.name || '';
  return (
    <>
      <JsonLd data={crumbsLd([{ label: 'Contact' }], absUrl)} />
      <PageHero crumbs={[{ label: 'Contact' }]} title="Contact et demande de devis" lead="Une question, un chantier, une saison à préparer ? Écrivez-nous : devis gratuit et sans engagement." />
      <section className="section">
        <div className="container contact-grid">
          <div>
            <h2>Nous joindre</h2>
            <ul className="contact-list">
              <li>
                <span className="ico-badge">
                  <Icon name="chat" />
                </span>
                <span>
                  <b>WhatsApp (réponse rapide)</b>
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
              <li>
                <span className="ico-badge">
                  <Icon name="pin" />
                </span>
                <span>
                  <b>Zone d’intervention</b>
                  <small>Savoie (73) et Haute-Savoie (74), stations de ski comprises</small>
                </span>
              </li>
            </ul>
            <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
              <Icon name="chat" size={20} /> Écrire sur WhatsApp
            </a>
          </div>
          <div className="panel contact-form-panel" id="devis">
            <h2 style={{ fontSize: '1.45rem' }}>Formulaire de contact</h2>
            <ContactForm services={services.map((x) => x.name)} zones={zones.map((z) => z.name)} defaultService={defaultService} defaultZone={defaultZone} waHref={wa} />
          </div>
        </div>
      </section>
    </>
  );
}

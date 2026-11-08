import Link from 'next/link';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getFaqs, getSettings, waLink, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'FAQ – questions fréquentes sur le nettoyage en Savoie et Haute-Savoie',
  description:
    'Devis, délais, tarifs, zones d’intervention, fin de chantier, lavage auto, débarras, contrats pour hôtels et stations de ski : toutes les réponses à vos questions.',
  alternates: { canonical: '/faq' },
};

export default async function FaqPage() {
  const [faqs, s] = await Promise.all([getFaqs(), getSettings()]);
  const wa = waLink(s, 'Bonjour, j’ai une question avant de demander un devis.');
  const ld = [
    crumbsLd([{ label: 'FAQ' }], absUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    },
  ];
  return (
    <>
      <JsonLd data={ld} />
      <PageHero crumbs={[{ label: 'FAQ' }]} title="Questions fréquentes" lead="Tout ce qu’il faut savoir avant de demander un devis de nettoyage en Savoie et Haute-Savoie." />
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.id}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="cta-band" style={{ marginTop: 40 }}>
            <div>
              <h2 style={{ margin: 0 }}>Une autre question ?</h2>
              <p style={{ margin: '6px 0 0' }}>Écrivez-nous, nous répondons rapidement.</p>
            </div>
            <div className="hero-actions" style={{ margin: 0 }}>
              <Link href="/contact#devis" className="btn btn-accent">
                Demander un devis
              </Link>
              <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

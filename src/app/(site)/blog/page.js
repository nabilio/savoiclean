import Link from 'next/link';
import Icon from '@/components/Icon';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getPosts, absUrl } from '@/lib/site';
import { fmtDate } from '@/lib/money';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Conseils nettoyage : fin de chantier, chalets, hôtels, entretien',
  description: 'Conseils pratiques et actualités du nettoyage professionnel en Savoie et Haute-Savoie : fin de chantier, location saisonnière, hôtellerie, entretien de locaux.',
  alternates: { canonical: '/blog' },
};

export default async function Blog() {
  const posts = await getPosts();
  return (
    <>
      <JsonLd data={crumbsLd([{ label: 'Conseils' }], absUrl)} />
      <PageHero crumbs={[{ label: 'Conseils' }]} title="Conseils et actualités du nettoyage" lead="Guides pratiques pour réussir vos fins de chantier, préparer vos locations et entretenir vos locaux." />
      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p>Les articles arrivent bientôt.</p>
          ) : (
            <div className="cards">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="card">
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    {fmtDate(p.published_at)}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="more">
                    Lire l’article <Icon name="arrow" size={16} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

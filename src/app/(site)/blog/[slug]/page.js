import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import Rich from '@/components/Rich';
import PageHero, { crumbsLd } from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { getPost, getSettings, waLink, absUrl } from '@/lib/site';
import { fmtDate } from '@/lib/money';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.meta_description || p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: 'article', title: p.title, description: p.meta_description || p.excerpt, url: `/blog/${p.slug}`, publishedTime: p.published_at || undefined },
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!p) notFound();
  const wa = waLink(settings, `Bonjour, j’ai lu votre article « ${p.title} » et je souhaite un devis.`);
  const ld = [
    crumbsLd([{ label: 'Conseils', href: '/blog' }, { label: p.title }], absUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.meta_description || p.excerpt,
      datePublished: p.published_at || undefined,
      mainEntityOfPage: absUrl(`/blog/${p.slug}`),
      author: { '@type': 'Organization', name: settings.brand_name },
      publisher: { '@type': 'Organization', name: settings.brand_name },
      inLanguage: 'fr-FR',
    },
  ];
  return (
    <>
      <JsonLd data={ld} />
      <PageHero crumbs={[{ label: 'Conseils', href: '/blog' }, { label: p.title }]} title={p.title} lead={p.excerpt} />
      <section className="section">
        <div className="container">
          <article className="article">
            <p className="post-meta">Publié le {fmtDate(p.published_at)}</p>
            <Rich text={p.body} />
            <div className="cta-band" style={{ marginTop: 48 }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Besoin d’un coup de main ?</h2>
                <p>Demandez un devis gratuit pour votre projet.</p>
              </div>
              <div className="hero-actions" style={{ margin: 0 }}>
                <Link href="/contact#devis" className="btn btn-accent">
                  Devis gratuit
                </Link>
                <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                  <Icon name="chat" size={18} /> WhatsApp
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

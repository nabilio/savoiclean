import PageHero from '@/components/PageHero';
import LegalText from '@/components/LegalText';
import { getSettings } from '@/lib/site';
import { legalSource, fillLegal } from '@/lib/legal';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mentions légales', alternates: { canonical: '/mentions-legales' } };

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ label: 'Mentions légales' }]} title="Mentions légales" />
      <section className="section">
        <div className="container article rich">
          <LegalText text={fillLegal(legalSource(s, 'legal_mentions'), s)} />
        </div>
      </section>
    </>
  );
}

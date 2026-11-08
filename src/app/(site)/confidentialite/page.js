import PageHero from '@/components/PageHero';
import LegalText from '@/components/LegalText';
import { getSettings } from '@/lib/site';
import { legalSource, fillLegal } from '@/lib/legal';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Politique de confidentialité', alternates: { canonical: '/confidentialite' } };

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ label: 'Confidentialité' }]} title="Politique de confidentialité" />
      <section className="section">
        <div className="container article rich">
          <LegalText text={fillLegal(legalSource(s, 'legal_privacy'), s)} />
        </div>
      </section>
    </>
  );
}

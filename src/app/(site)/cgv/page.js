import PageHero from '@/components/PageHero';
import LegalText from '@/components/LegalText';
import { getSettings } from '@/lib/site';
import { legalSource, fillLegal } from '@/lib/legal';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Conditions générales de vente', alternates: { canonical: '/cgv' } };

export default async function Cgv() {
  const s = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ label: 'CGV' }]} title="Conditions générales de vente" />
      <section className="section">
        <div className="container article rich">
          <LegalText text={fillLegal(legalSource(s, 'legal_cgv'), s)} />
        </div>
      </section>
    </>
  );
}

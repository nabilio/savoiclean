import { loadSettings } from '@/lib/site';
import { Flash, PageTitle } from '@/components/admin/Fields';
import SettingsGroup from '@/components/admin/SettingsGroup';

export const dynamic = 'force-dynamic';

export default async function BillingSettings({ searchParams }) {
  const sp = await searchParams;
  const s = await loadSettings();
  return (
    <>
      <PageTitle>Société et facturation</PageTitle>
      <p className="muted" style={{ marginTop: -6 }}>
        Ces informations apparaissent sur vos devis, vos factures et les mentions légales du site. Complétez-les avant d’émettre un document.
      </p>
      <Flash sp={sp} />
      <SettingsGroup groupKey="facturation" settings={s} editing={sp?.edit === '1'} back="/admin/parametres/facturation" />
    </>
  );
}

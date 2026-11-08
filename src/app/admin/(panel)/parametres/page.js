import { loadSettings } from '@/lib/site';
import { Flash, PageTitle } from '@/components/admin/Fields';
import SettingsGroup from '@/components/admin/SettingsGroup';

export const dynamic = 'force-dynamic';

export default async function Settings({ searchParams }) {
  const sp = await searchParams;
  const s = await loadSettings();
  return (
    <>
      <PageTitle>Entreprise et contact</PageTitle>
      <Flash sp={sp} />
      <SettingsGroup groupKey="entreprise" settings={s} editing={sp?.edit === '1'} back="/admin/parametres" />
    </>
  );
}

import { loadSettings } from '@/lib/site';
import { Flash, PageTitle } from '@/components/admin/Fields';
import SettingsGroup from '@/components/admin/SettingsGroup';

export const dynamic = 'force-dynamic';

export default async function HomeContent({ searchParams }) {
  const sp = await searchParams;
  const s = await loadSettings();
  return (
    <>
      <PageTitle>Contenu de l’accueil</PageTitle>
      <Flash sp={sp} />
      <SettingsGroup groupKey="accueil" settings={s} editing={sp?.edit === '1'} back="/admin/contenu" />
    </>
  );
}

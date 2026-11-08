import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadSettings } from '@/lib/site';
import { Flash } from '@/components/admin/Fields';
import SettingsGroup from '@/components/admin/SettingsGroup';
import { LEGAL_TEMPLATES } from '@/data/legal-templates';

export const dynamic = 'force-dynamic';
const MAP = { mentions: ['legal_mentions', '/mentions-legales'], confidentialite: ['legal_privacy', '/confidentialite'] };

export default async function LegalDoc({ params, searchParams }) {
  const { doc } = await params;
  const sp = await searchParams;
  const m = MAP[doc];
  if (!m) notFound();
  const s = await loadSettings();
  const custom = String(s[m[0]] || '').trim() !== '';
  const view = { ...s, [m[0]]: s[m[0]] || LEGAL_TEMPLATES[m[0]] };
  return (
    <>
      <Flash sp={sp} />
      <p className="muted" style={{ marginTop: 0 }}>
        {custom ? 'Texte personnalisé.' : 'Modèle par défaut (non modifié).'} Page publique :{' '}
        <Link href={m[1]} target="_blank">
          {m[1]}
        </Link>
      </p>
      <SettingsGroup groupKey={m[0]} settings={view} editing={sp?.edit === '1'} back={`/admin/contenu/legal/${doc}`} />
    </>
  );
}

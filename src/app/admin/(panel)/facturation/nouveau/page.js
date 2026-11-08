import { todayStr } from '@/lib/db';
import { getSettings } from '@/lib/site';
import { addDays } from '@/lib/money';
import { Flash, PageTitle } from '@/components/admin/Fields';
import DocForm from '@/components/admin/DocForm';

export const dynamic = 'force-dynamic';

export default async function NewDoc({ searchParams }) {
  const sp = await searchParams;
  const type = sp?.type === 'facture' ? 'facture' : 'devis';
  const s = await getSettings();
  const today = todayStr();
  const days = Number(type === 'devis' ? s.quote_validity_days : s.payment_terms_days) || 30;
  const defaults = { client_id: Number(sp?.client) || '', title: String(sp?.title || '').slice(0, 200), issue_date: today, due_date: addDays(today, days) };
  return (
    <>
      <PageTitle>{type === 'devis' ? 'Nouveau devis' : 'Nouvelle facture'}</PageTitle>
      <Flash sp={sp} />
      <DocForm type={type} defaults={defaults} regime={s.vat_regime === 'franchise' ? 'franchise' : 'normal'} cancelHref={type === 'devis' ? '/admin/facturation' : '/admin/facturation/factures'} />
    </>
  );
}

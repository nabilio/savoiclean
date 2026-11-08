import Link from 'next/link';
import { SubTabs } from '@/components/admin/Bits';
import { getSettings } from '@/lib/site';

export default async function BillingLayout({ children }) {
  const s = await getSettings();
  const missing = [
    !s.legal_name && 'raison sociale',
    !s.siren && 'SIREN',
    !(s.legal_address || s.address) && 'adresse',
    !s.email && 'e-mail',
  ].filter(Boolean);
  return (
    <>
      {missing.length > 0 && (
        <div className="notice-warn">
          <b>Vos devis et factures sont incomplets.</b> Il manque : {missing.join(', ')}. Ces informations apparaissent en haut des documents PDF.{' '}
          <Link href="/admin/parametres">Compléter mes informations</Link>
        </div>
      )}
      <SubTabs
        items={[
          { href: '/admin/facturation', label: 'Devis' },
          { href: '/admin/facturation/factures', label: 'Factures' },
          { href: '/admin/facturation/clients', label: 'Clients' },
        ]}
      />
      {children}
    </>
  );
}

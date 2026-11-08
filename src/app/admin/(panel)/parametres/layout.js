import { SubTabs } from '@/components/admin/Bits';

export default function SettingsLayout({ children }) {
  return (
    <>
      <SubTabs
        items={[
          { href: '/admin/parametres', label: 'Entreprise & contact' },
          { href: '/admin/parametres/facturation', label: 'Société & facturation' },
          { href: '/admin/parametres/securite', label: 'Sécurité' },
        ]}
      />
      {children}
    </>
  );
}

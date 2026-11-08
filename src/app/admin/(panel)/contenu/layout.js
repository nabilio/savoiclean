import { SubTabs } from '@/components/admin/Bits';

export default function ContentLayout({ children }) {
  return (
    <>
      <SubTabs
        items={[
          { href: '/admin/contenu', label: 'Accueil & textes' },
          { href: '/admin/contenu/slides', label: 'Diaporama' },
          { href: '/admin/contenu/services', label: 'Services' },
          { href: '/admin/contenu/zones', label: 'Zones' },
          { href: '/admin/contenu/faqs', label: 'FAQ' },
          { href: '/admin/contenu/posts', label: 'Blog' },
          { href: '/admin/contenu/realisations', label: 'Réalisations' },
          { href: '/admin/contenu/legal', label: 'Pages légales' },
        ]}
      />
      {children}
    </>
  );
}

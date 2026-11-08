import { SubTabs } from '@/components/admin/Bits';

export default function LegalLayout({ children }) {
  return (
    <>
      <div className="notice-warn" style={{ marginBottom: 14 }}>
        <b>Textes types à faire valider.</b> Ces pages légales sont des exemples fournis à titre de modèle. L’éditeur du site reste responsable de leur contenu : faites-les relire par votre conseil juridique et complétez vos informations dans Paramètres › Société &amp; facturation.
      </div>
      <SubTabs
        items={[
          { href: '/admin/contenu/legal/mentions', label: 'Mentions légales' },
          { href: '/admin/contenu/legal/confidentialite', label: 'Confidentialité' },
        ]}
      />
      {children}
    </>
  );
}

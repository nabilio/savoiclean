import '@fontsource-variable/plus-jakarta-sans';
import './globals.css';
import { getSettings, siteUrl, isIndexable } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${s.brand_name} – Nettoyage professionnel en Savoie et Haute-Savoie`,
      template: `%s | ${s.brand_name}`,
    },
    description:
      'Nettoyage de fin de chantier, ménage de locaux professionnels, lavage voiture intérieur et extérieur, débarras, vitres : entreprise de nettoyage en Savoie et Haute-Savoie, stations de ski incluses. Devis gratuit.',
    applicationName: s.brand_name,
    robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
    verification: s.google_site_verification ? { google: s.google_site_verification } : undefined,
    openGraph: { type: 'website', locale: 'fr_FR', siteName: s.brand_name },
    formatDetection: { telephone: false },
  };
}

export const viewport = { themeColor: '#0e8f8a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

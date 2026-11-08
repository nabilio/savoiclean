import { Header, Footer } from '@/components/SiteChrome';
import CookieBanner from '@/components/CookieBanner';
import { getSettings, getServices, getZones } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const [settings, services, zones] = await Promise.all([getSettings(), getServices(), getZones()]);
  return (
    <>
      <Header settings={settings} />
      <main id="contenu">{children}</main>
      <Footer settings={settings} services={services} zones={zones} />
      <CookieBanner />
    </>
  );
}

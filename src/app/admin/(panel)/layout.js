import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { AdminNav } from '@/components/admin/Bits';
import { q } from '@/lib/db';
import { purgeIfDue } from '@/lib/purge';
import { logoutAction } from '../(auth)/actions';
import { LogoMark } from '@/components/Mountains';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration', robots: { index: false, follow: false } };

const ITEMS = [
  { href: '/admin', label: 'Tableau de bord' },
  { href: '/admin/demandes', label: 'Demandes' },
  { href: '/admin/facturation', label: 'Facturation' },
  { href: '/admin/contenu', label: 'Contenu du site' },
  { href: '/admin/parametres', label: 'Paramètres' },
];

export default async function PanelLayout({ children }) {
  const user = await requireAdmin();
  await purgeIfDue();
  const [{ c }] = await q("SELECT COUNT(*) AS c FROM leads WHERE status = 'nouveau'");
  return (
    <div className="adm">
      <header className="adm-top">
        <div className="wrap">
          <Link href="/admin" className="adm-brand">
            <LogoMark size={28} /> Administration
          </Link>
          <AdminNav items={ITEMS} newLeads={Number(c)} />
          <div className="adm-user">
            <Link href="/" target="_blank" className="btn btn-ghost btn-sm">
              Voir le site
            </Link>
            <span>{user.email}</span>
            <form action={logoutAction}>
              <button className="btn btn-ghost btn-sm">Déconnexion</button>
            </form>
          </div>
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </div>
  );
}

import { LogoMark } from '@/components/Mountains';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration', robots: { index: false, follow: false } };

export default function AuthLayout({ children }) {
  return (
    <div className="adm auth-wrap">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <LogoMark size={36} />
          <b style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--navy-900)' }}>Espace administrateur</b>
        </div>
        {children}
      </div>
    </div>
  );
}

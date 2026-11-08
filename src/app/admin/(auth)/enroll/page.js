import { redirect } from 'next/navigation';
import QRCode from 'qrcode';
import { EnrollForm } from '@/components/admin/AuthForms';
import { readPre, ensurePendingSecret } from '@/lib/auth';
import { getSettings } from '@/lib/site';
import { otpauthUrl } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export default async function EnrollPage() {
  const pre = await readPre();
  if (!pre || pre.stage !== 'enroll') redirect('/admin/login');
  if (pre.user.totp_enabled) return <EnrollForm enabled />;
  const s = await getSettings();
  const secret = await ensurePendingSecret(pre.user);
  const qr = await QRCode.toDataURL(otpauthUrl({ secret, account: pre.user.email, issuer: s.brand_name }), { margin: 1, width: 260 });
  return (
    <>
      <h1>Activer la double authentification</h1>
      <p className="sub">Obligatoire pour protéger l’administration de votre site.</p>
      <EnrollForm qr={qr} secret={secret} />
    </>
  );
}

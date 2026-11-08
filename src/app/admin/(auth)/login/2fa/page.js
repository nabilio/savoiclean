import { redirect } from 'next/navigation';
import { TwoFaForm } from '@/components/admin/AuthForms';
import { readPre } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TwoFaPage() {
  const pre = await readPre();
  if (!pre || pre.stage !== '2fa') redirect('/admin/login');
  return (
    <>
      <h1>Double authentification</h1>
      <p className="sub">Ouvrez votre application d’authentification et saisissez le code actuel.</p>
      <TwoFaForm />
    </>
  );
}

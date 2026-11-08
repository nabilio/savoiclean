import { redirect } from 'next/navigation';
import { SetupForm } from '@/components/admin/AuthForms';
import { usersCount } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  if ((await usersCount()) > 0) redirect('/admin/login');
  return (
    <>
      <h1>Première installation</h1>
      <p className="sub">Créez le compte administrateur. Ce formulaire disparaît dès que le compte existe.</p>
      <SetupForm />
    </>
  );
}

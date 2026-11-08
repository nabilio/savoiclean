import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/AuthForms';
import { getSession, usersCount } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  if ((await usersCount()) === 0) redirect('/admin/setup');
  return (
    <>
      <h1>Connexion</h1>
      <p className="sub">Accès réservé. Une double authentification vous sera demandée.</p>
      <LoginForm />
    </>
  );
}

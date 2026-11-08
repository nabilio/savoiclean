import Link from 'next/link';

export const metadata = { title: 'Page introuvable', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container article" style={{ textAlign: 'center' }}>
        <h1>Page introuvable</h1>
        <p>La page que vous cherchez n’existe plus ou a changé d’adresse.</p>
        <Link className="btn btn-primary" href="/">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}

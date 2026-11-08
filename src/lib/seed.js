import { SERVICES } from '@/data/services';
import { ZONES } from '@/data/zones';
import { FAQS, POSTS } from '@/data/faqs-posts';

const stamp = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

export async function seedIfEmpty({ query, run }) {
  const count = async (t) => Number((await query(`SELECT COUNT(*) AS c FROM ${t}`, []))[0].c);

  if ((await count('services')) === 0) {
    let i = 0;
    for (const s of SERVICES) {
      i += 10;
      await run(
        'INSERT INTO services (slug, name, short, body, meta_title, meta_description, icon, audience, keywords, sort, visible) VALUES (?,?,?,?,?,?,?,?,?,?,1)',
        [s.slug, s.name, s.short, s.body, s.meta_title, s.meta_description, s.icon, s.audience, s.keywords, i]
      );
    }
  }
  if ((await count('zones')) === 0) {
    let i = 0;
    for (const z of ZONES) {
      i += 10;
      await run('INSERT INTO zones (slug, name, dept, kind, blurb, body, sort, visible) VALUES (?,?,?,?,?,?,?,1)', [
        z.slug,
        z.name,
        z.dept,
        z.kind,
        z.blurb,
        '',
        i,
      ]);
    }
  }
  if ((await count('faqs')) === 0) {
    let i = 0;
    for (const f of FAQS) {
      i += 10;
      await run('INSERT INTO faqs (question, answer, sort, visible) VALUES (?,?,?,1)', [f.question, f.answer, i]);
    }
  }
  if ((await count('posts')) === 0) {
    for (const p of POSTS) {
      await run(
        'INSERT INTO posts (slug, title, excerpt, body, meta_description, published, published_at) VALUES (?,?,?,?,?,1,?)',
        [p.slug, p.title, p.excerpt, p.body, p.meta_description, p.published_at]
      );
    }
  }
  const flag = await query("SELECT v FROM settings WHERE k = 'seed_slides_cleaning'", []);
  if (!flag.length) {
    // Diaporama d’accueil : photos liées au nettoyage (remplace les anciennes vues de paysages).
    await run("DELETE FROM slides WHERE image_url IN ('/img/station.jpg','/img/chamonix.jpg','/img/dru.jpg','/img/ete-vallee.jpg','/img/ete-lac.jpg','/img/ete-lac-ciel.jpg')", []);
    const defaults = [
      ['Ménage et entretien professionnel', 'Femme de ménage passant la serpillière dans un intérieur lumineux', '/img/menage.jpg'],
      ['Une propreté impeccable, partout', 'Aspirateur dans un salon lumineux', '/img/menage-aspirateur.jpg'],
      ['Nettoyage de fin de chantier', 'Pièce en rénovation avant remise en état complète', '/img/chantier.jpg'],
      ['Chalets, résidences et logements', 'Femme de ménage montant un escalier avec son matériel de nettoyage', '/img/menage-escalier.jpg'],
      ['Hôtels, restaurants et commerces', 'Chariot de ménage et aspirateur dans un couloir d’hôtel', '/img/hotel.jpg'],
      ['Vitres et façades', 'Nettoyage de façade en rappel sur un immeuble', '/img/vitres.jpg'],
      ['Lavage auto intérieur et extérieur', 'Nettoyage de l’intérieur d’un véhicule', '/img/voiture.jpg'],
      ['Entretien de cuisines et locaux', 'Balai et matériel de nettoyage dans une cuisine moderne', '/img/menage-cuisine.jpg'],
    ];
    let i = 0;
    for (const [t, a, u] of defaults) {
      i += 10;
      await run('INSERT INTO slides (title, alt, image_url, sort, visible) VALUES (?,?,?,?,1)', [t, a, u, i]);
    }
    await run("INSERT INTO settings (k, v) VALUES ('seed_slides_cleaning', '1')", []);
  }
  void stamp;
}

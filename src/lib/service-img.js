const MAP = [
  ['pression', '/img/chantier.jpg'],
  ['industriel', '/img/chantier.jpg'],
  ['restaurant', '/img/menage-cuisine.jpg'],
  ['sols', '/img/menage-aspirateur.jpg'],
  ['bail', '/img/menage-escalier.jpg'],
  ['chantier', '/img/chantier.jpg'],
  ['voiture', '/img/voiture.jpg'],
  ['lavage', '/img/voiture.jpg'],
  ['vitre', '/img/vitres.jpg'],
  ['hotel', '/img/hotel.jpg'],
  ['residence', '/img/hotel.jpg'],
  ['debarras', '/img/menage-escalier.jpg'],
  ['copropriete', '/img/menage-escalier.jpg'],
  ['chalet', '/img/menage-cuisine.jpg'],
  ['locaux', '/img/menage-aspirateur.jpg'],
  ['bureau', '/img/menage-aspirateur.jpg'],
  ['menage', '/img/menage.jpg'],
];
export function serviceImg(slug = '') {
  const k = MAP.find(([w]) => slug.includes(w));
  return k ? k[1] : '/img/menage-cuisine.jpg';
}

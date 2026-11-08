// Zones d'intervention (contenu initial, modifiable dans le back-office).
const S = 'Savoie';
const H = 'Haute-Savoie';

export const ZONES = [
  // --- Savoie : villes ---
  { name: 'Chambéry', dept: S, kind: 'Ville', blurb: 'Préfecture de la Savoie et cœur de l’activité économique du département : bureaux, commerces du centre-ville, copropriétés et chantiers de rénovation, nous intervenons à Chambéry comme dans toute la cluse.' },
  { name: 'Aix-les-Bains', dept: S, kind: 'Ville', blurb: 'Ville thermale au bord du lac du Bourget : hôtels, résidences, commerces et villas, avec un fort besoin de ménage régulier et de remise en état entre les saisons.' },
  { name: 'La Motte-Servolex', dept: S, kind: 'Ville', blurb: 'Zones d’activités, entreprises et lotissements de l’agglomération chambérienne : entretien de locaux professionnels et nettoyage de fin de chantier.' },
  { name: 'Montmélian', dept: S, kind: 'Ville', blurb: 'Au carrefour de la Combe de Savoie, Montmélian accueille artisans, commerces et résidences : nous assurons ménage, vitres et nettoyage après travaux.' },
  { name: 'Albertville', dept: S, kind: 'Ville', blurb: 'Porte des vallées de la Tarentaise et du Beaufortain, Albertville concentre entreprises, commerces et logements : un point de départ idéal pour desservir les stations voisines.' },
  { name: 'Saint-Jean-de-Maurienne', dept: S, kind: 'Ville', blurb: 'Capitale de la Maurienne, avec ses industries, ses commerces et ses chantiers : nettoyage industriel, entretien de locaux et débarras.' },
  { name: 'Bourg-Saint-Maurice', dept: S, kind: 'Ville', blurb: 'Porte d’entrée des Arcs et de la haute Tarentaise : résidences, hôtels, commerces et locations saisonnières demandent des interventions fiables en haute saison.' },
  { name: 'Moûtiers', dept: S, kind: 'Ville', blurb: 'Ville de vallée au pied des Trois Vallées : entreprises, services publics et logements, avec des interventions rapides vers Courchevel, Méribel et Val Thorens.' },
  // --- Savoie : stations ---
  { name: 'Courchevel', dept: S, kind: 'Station', blurb: 'Chalets de prestige, hôtels et résidences premium : nous assurons ménage de changement de clientèle, remise en état avant saison et nettoyage de fin de chantier à tous les niveaux de la station.' },
  { name: 'Méribel', dept: S, kind: 'Station', blurb: 'Au cœur des Trois Vallées, Méribel compte de nombreux chalets et résidences de tourisme : ménage entre deux séjours, vitres, linge et ouverture de saison.' },
  { name: 'Val Thorens', dept: S, kind: 'Station', blurb: 'La plus haute station d’Europe : résidences, hôtels, commerces et restaurants d’altitude demandent des équipes disponibles et organisées pour chaque changement de semaine.' },
  { name: 'Les Menuires', dept: S, kind: 'Station', blurb: 'Grandes résidences, appartements et commerces de la vallée des Belleville : ménage de changement de clientèle et entretien des parties communes.' },
  { name: 'La Plagne', dept: S, kind: 'Station', blurb: 'Plusieurs villages et altitudes, de très nombreux appartements en location : nous planifions des tournées de ménage et de remise en état sur l’ensemble de La Plagne.' },
  { name: 'Les Arcs', dept: S, kind: 'Station', blurb: 'Arc 1600, 1800, 1950 et 2000 : résidences de tourisme, hôtels, commerces et chalets, avec des équipes pour la haute saison et la remise en état entre deux saisons.' },
  { name: 'Tignes', dept: S, kind: 'Station', blurb: 'Station d’altitude de l’Espace Killy : résidences, hôtels et commerces entretenus avant l’ouverture, pendant l’hiver et à la fermeture.' },
  { name: 'Val d’Isère', dept: S, kind: 'Station', blurb: 'Hôtels, chalets et commerces de haute Tarentaise : ménage haut de gamme, vitres, textiles et remise en état de logements.' },
  { name: 'Valmorel', dept: S, kind: 'Station', blurb: 'Station-village aux résidences de caractère : nous intervenons sur les changements de clientèle, les chalets et les chantiers de rénovation.' },
  { name: 'Les Saisies', dept: S, kind: 'Station', blurb: 'Entre Beaufortain et Val d’Arly, résidences et chalets de location, avec une activité hivernale et estivale (ski nordique, randonnée) : ménage toute l’année.' },
  { name: 'Valloire', dept: S, kind: 'Station', blurb: 'Station-village de Maurienne au pied du col du Galibier : hôtels, appartements et chalets, avec une saison d’hiver et une saison d’été.' },
  { name: 'La Toussuire', dept: S, kind: 'Station', blurb: 'Domaine des Sybelles en Maurienne : résidences, commerces et locations saisonnières nécessitant des interventions rapides en début de saison.' },
  { name: 'Pralognan-la-Vanoise', dept: S, kind: 'Station', blurb: 'Au cœur du Parc national de la Vanoise : gîtes, hôtels et chalets, ménage et remise en état entre deux séjours.' },
  { name: 'La Rosière', dept: S, kind: 'Station', blurb: 'Face à l’Italie, station ensoleillée de Haute-Tarentaise : résidences et commerces à entretenir à chaque changement de clientèle.' },
  { name: 'Arêches-Beaufort', dept: S, kind: 'Station', blurb: 'Au pays du Beaufort, chalets, gîtes et résidences de tourisme : ménage saisonnier et nettoyage de fin de travaux.' },
  { name: 'Aussois', dept: S, kind: 'Station', blurb: 'Village de Haute-Maurienne : hébergements, restaurants et commerces, avec des besoins forts au début et à la fin de chaque saison.' },
  // --- Haute-Savoie : villes ---
  { name: 'Annecy', dept: H, kind: 'Ville', blurb: 'Capitale de la Haute-Savoie, au bord du lac : bureaux, commerces de la vieille ville, hôtels, copropriétés, chantiers et locations de courte durée, nous couvrons Annecy, Seynod, Cran-Gevrier et Annecy-le-Vieux.' },
  { name: 'Thonon-les-Bains', dept: H, kind: 'Ville', blurb: 'Au bord du Léman, entreprises, commerces et résidences demandent un entretien régulier et des remises en état après travaux.' },
  { name: 'Évian-les-Bains', dept: H, kind: 'Ville', blurb: 'Station thermale et touristique du Chablais : hôtels, résidences et villas, avec des interventions entre deux séjours.' },
  { name: 'Annemasse', dept: H, kind: 'Ville', blurb: 'À la frontière suisse, agglomération dynamique : bureaux, commerces, copropriétés et chantiers, avec des horaires décalés possibles.' },
  { name: 'Cluses', dept: H, kind: 'Ville', blurb: 'Capitale du décolletage dans la vallée de l’Arve : sites industriels, ateliers et entrepôts pour un nettoyage adapté aux contraintes de production.' },
  { name: 'Sallanches', dept: H, kind: 'Ville', blurb: 'Face au massif du Mont-Blanc, porte de Chamonix et de Megève : entreprises, commerces, logements et chantiers.' },
  { name: 'Rumilly', dept: H, kind: 'Ville', blurb: 'Entre Annecy et Chambéry, un bassin d’emplois industriels et commerciaux où nous intervenons pour l’entretien de locaux et les fins de chantier.' },
  // --- Haute-Savoie : stations ---
  { name: 'Chamonix-Mont-Blanc', dept: H, kind: 'Station', blurb: 'Capitale mondiale de l’alpinisme : hôtels, chalets, appartements et commerces, avec une activité toute l’année qui demande une propreté constante.' },
  { name: 'Megève', dept: H, kind: 'Station', blurb: 'Village de caractère et chalets d’exception : ménage soigné, vitres, textiles et remise en état de résidences secondaires.' },
  { name: 'Saint-Gervais-les-Bains', dept: H, kind: 'Station', blurb: 'Entre thermes et domaine skiable du Mont-Blanc : hôtels, résidences, commerces et chalets à entretenir à chaque saison.' },
  { name: 'Les Contamines-Montjoie', dept: H, kind: 'Station', blurb: 'Station familiale au pied du Mont-Blanc : chalets et gîtes, ménage de changement de clientèle et nettoyage de fin de travaux.' },
  { name: 'Morzine', dept: H, kind: 'Station', blurb: 'Au cœur des Portes du Soleil : très nombreux chalets et résidences en location, avec un besoin fort de ménage saisonnier et de remise en état.' },
  { name: 'Avoriaz', dept: H, kind: 'Station', blurb: 'Station sans voiture des Portes du Soleil : résidences, hôtels et appartements entretenus entre deux séjours.' },
  { name: 'Les Gets', dept: H, kind: 'Station', blurb: 'Station-village des Portes du Soleil : chalets, résidences et commerces, ménage de saison et fin de chantier.' },
  { name: 'Samoëns', dept: H, kind: 'Station', blurb: 'Village de caractère du Grand Massif : chalets, gîtes et hôtels, entretien régulier et remise en état avant la saison.' },
  { name: 'Flaine', dept: H, kind: 'Station', blurb: 'Station d’altitude du Grand Massif : résidences et commerces, ménage de changement de clientèle et rénovation de logements.' },
  { name: 'La Clusaz', dept: H, kind: 'Station', blurb: 'Station des Aravis : chalets, hôtels, restaurants et résidences, avec des interventions toute la saison.' },
  { name: 'Le Grand-Bornand', dept: H, kind: 'Station', blurb: 'Village-station des Aravis : chalets, fermes rénovées et hébergements touristiques, ménage et remise en état avant chaque saison.' },
  { name: 'Combloux', dept: H, kind: 'Station', blurb: 'Face au Mont-Blanc, chalets et résidences à entretenir : ménage, vitres et nettoyage avant livraison.' },
].map((z) => ({
  ...z,
  slug: z.name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
}));

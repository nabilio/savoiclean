import { SERVICE_ICONS } from '@/data/defaults';

export const ENTITIES = {
  services: {
    table: 'services',
    label: 'service',
    plural: 'Services',
    titleField: 'name',
    slugFrom: 'name',
    order: 'sort, id',
    intro: 'Chaque service a sa page dédiée (référencement Google). Utilisez des phrases naturelles contenant vos mots-clés.',
    summary: ['audience', 'visible'],
    fields: [
      { name: 'name', label: 'Nom du service', type: 'text', required: true, full: true },
      { name: 'slug', label: 'Adresse de la page', type: 'text', help: 'Laisser vide pour la générer automatiquement.' },
      { name: 'audience', label: 'Public', type: 'select', options: ['B2B', 'Tous', 'Particuliers'] },
      { name: 'icon', label: 'Icône', type: 'select', options: SERVICE_ICONS },
      { name: 'sort', label: 'Ordre d’affichage', type: 'number' },
      { name: 'visible', label: 'Visible sur le site', type: 'bool' },
      { name: 'short', label: 'Résumé (cartes)', type: 'textarea', full: true },
      { name: 'body', label: 'Contenu de la page', type: 'rich', full: true, help: 'Paragraphes séparés par une ligne vide. « ## Titre » pour un sous-titre, « - » pour une liste.' },
      { name: 'meta_title', label: 'Titre Google (SEO)', type: 'text', full: true },
      { name: 'meta_description', label: 'Description Google (SEO)', type: 'textarea', full: true },
      { name: 'keywords', label: 'Mots-clés (séparés par des virgules)', type: 'textarea', full: true },
    ],
  },
  zones: {
    table: 'zones',
    label: 'zone',
    plural: 'Zones',
    titleField: 'name',
    slugFrom: 'name',
    order: 'dept, kind, sort, id',
    intro: 'Villes et stations desservies : une page de référencement local par zone.',
    summary: ['dept', 'kind', 'visible'],
    fields: [
      { name: 'name', label: 'Nom de la ville ou station', type: 'text', required: true },
      { name: 'slug', label: 'Adresse de la page', type: 'text', help: 'Laisser vide pour la générer automatiquement.' },
      { name: 'dept', label: 'Département', type: 'select', options: ['Savoie', 'Haute-Savoie'] },
      { name: 'kind', label: 'Type', type: 'select', options: ['Ville', 'Station'] },
      { name: 'sort', label: 'Ordre d’affichage', type: 'number' },
      { name: 'visible', label: 'Visible sur le site', type: 'bool' },
      { name: 'blurb', label: 'Texte de présentation', type: 'textarea', full: true },
      { name: 'body', label: 'Contenu complémentaire (facultatif)', type: 'rich', full: true },
    ],
  },
  faqs: {
    table: 'faqs',
    label: 'question',
    plural: 'FAQ',
    titleField: 'question',
    order: 'sort, id',
    intro: 'Questions fréquentes affichées sur l’accueil (et utiles pour Google).',
    summary: ['visible'],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true, full: true },
      { name: 'answer', label: 'Réponse', type: 'textarea', required: true, full: true },
      { name: 'sort', label: 'Ordre d’affichage', type: 'number' },
      { name: 'visible', label: 'Visible sur le site', type: 'bool' },
    ],
  },
  posts: {
    table: 'posts',
    label: 'article',
    plural: 'Blog',
    titleField: 'title',
    slugFrom: 'title',
    order: 'published_at DESC, id DESC',
    intro: 'Articles de conseils : excellent levier de référencement sur les recherches locales.',
    summary: ['published_at', 'published'],
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, full: true },
      { name: 'slug', label: 'Adresse de la page', type: 'text', help: 'Laisser vide pour la générer automatiquement.' },
      { name: 'published_at', label: 'Date de publication', type: 'date' },
      { name: 'published', label: 'Publié', type: 'bool' },
      { name: 'excerpt', label: 'Résumé', type: 'textarea', full: true },
      { name: 'body', label: 'Contenu', type: 'rich', full: true, help: 'Paragraphes séparés par une ligne vide. « ## Titre » pour un sous-titre, « - » pour une liste.' },
      { name: 'meta_description', label: 'Description Google (SEO)', type: 'textarea', full: true },
    ],
  },
  slides: {
    table: 'slides',
    label: 'image du diaporama',
    plural: 'Diaporama d’accueil',
    titleField: 'title',
    order: 'sort, id',
    intro: 'Images qui défilent en haut de la page d’accueil. Format paysage conseillé (1600×1000 px). N’utilisez que des photos dont vous détenez les droits.',
    summary: ['visible'],
    fields: [
      { name: 'title', label: 'Légende (affichée sur l’image)', type: 'text', full: true },
      { name: 'image_id', label: 'Image (JPG, PNG ou WebP, 4 Mo max)', type: 'image', full: true },
      { name: 'alt', label: 'Texte alternatif (description pour Google et l’accessibilité)', type: 'text', full: true },
      { name: 'sort', label: 'Ordre d’affichage', type: 'number' },
      { name: 'visible', label: 'Visible sur le site', type: 'bool' },
    ],
  },
  realisations: {
    table: 'realisations',
    label: 'réalisation',
    plural: 'Réalisations',
    titleField: 'title',
    order: 'sort, id DESC',
    intro: 'Photos de vos interventions (avant/après). N’utilisez que vos propres photos.',
    summary: ['place', 'visible'],
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, full: true },
      { name: 'service', label: 'Service', type: 'text' },
      { name: 'place', label: 'Lieu', type: 'text' },
      { name: 'image_id', label: 'Photo (JPG, PNG ou WebP, 4 Mo max)', type: 'image', full: true },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'sort', label: 'Ordre d’affichage', type: 'number' },
      { name: 'visible', label: 'Visible sur le site', type: 'bool' },
    ],
  },
};

export const SETTING_GROUPS = {
  accueil: {
    title: 'Textes de l’accueil',
    fields: [
      { name: 'hero_title', label: 'Titre principal (H1) — entourez un mot de *étoiles* pour le mettre en couleur', type: 'text', full: true },
      { name: 'hero_subtitle', label: 'Sous-titre', type: 'textarea', full: true },
      { name: 'about_title', label: 'Titre « Pourquoi nous choisir »', type: 'text', full: true },
      { name: 'about_text', label: 'Texte « Pourquoi nous choisir »', type: 'textarea', full: true },
      { name: 'b2b_title', label: 'Titre section professionnels', type: 'text', full: true },
      { name: 'b2b_text', label: 'Texte section professionnels', type: 'textarea', full: true },
    ],
  },
  entreprise: {
    title: 'Entreprise et contact',
    fields: [
      { name: 'brand_name', label: 'Nom de la marque', type: 'text', required: true },
      { name: 'brand_slogan', label: 'Slogan du logo', type: 'text' },
      { name: 'brand_tagline', label: 'Texte du bandeau supérieur', type: 'text' },
      { name: 'phone_display', label: 'Téléphone affiché', type: 'text' },
      { name: 'whatsapp_number', label: 'Numéro WhatsApp (format international sans +)', type: 'text', help: 'Ex. 33753327816' },
      { name: 'email', label: 'E-mail de contact', type: 'text' },
      { name: 'address', label: 'Adresse (facultatif)', type: 'text' },
      { name: 'hours', label: 'Horaires / disponibilité', type: 'text', full: true },
      { name: 'facebook_url', label: 'Page Facebook', type: 'text' },
      { name: 'instagram_url', label: 'Compte Instagram', type: 'text' },
      { name: 'google_business_url', label: 'Fiche Google Business', type: 'text' },
      { name: 'google_site_verification', label: 'Code de vérification Google Search Console', type: 'text', help: 'Uniquement le contenu du code (sans balise).' },
    ],
  },
  facturation: {
    title: 'Société et facturation',
    fields: [
      { name: 'legal_name', label: 'Raison sociale', type: 'text' },
      { name: 'legal_form', label: 'Forme juridique', type: 'text', help: 'Ex. SAS, SASU, EI, micro-entreprise' },
      { name: 'siren', label: 'SIREN / SIRET', type: 'text' },
      { name: 'legal_capital', label: 'Capital social', type: 'text', help: 'Ex. 1 000 €' },
      { name: 'legal_rcs', label: 'RCS (ville + numéro)', type: 'text', help: 'Ex. RCS Chambéry 123 456 789' },
      { name: 'mediator_name', label: 'Médiateur de la consommation (nom)', type: 'text', help: 'Obligatoire si vous avez des clients particuliers.' },
      { name: 'mediator_url', label: 'Médiateur (site web)', type: 'text' },
      { name: 'vat_number', label: 'N° TVA intracommunautaire', type: 'text' },
      { name: 'legal_address', label: 'Adresse du siège', type: 'text', full: true },
      { name: 'director', label: 'Directeur de la publication', type: 'text' },
      { name: 'vat_regime', label: 'Régime de TVA', type: 'select', options: ['normal', 'franchise'], optionLabels: { normal: 'TVA applicable', franchise: 'Franchise en base (TVA non applicable)' } },
      { name: 'payment_terms_days', label: 'Délai de paiement (jours)', type: 'number' },
      { name: 'quote_validity_days', label: 'Validité des devis (jours)', type: 'number' },
      { name: 'iban', label: 'IBAN', type: 'text' },
      { name: 'bic', label: 'BIC', type: 'text' },
      { name: 'quote_footer', label: 'Mention complémentaire sur les devis', type: 'textarea', full: true },
      { name: 'invoice_footer', label: 'Mention complémentaire sur les factures', type: 'textarea', full: true },
    ],
  },
};

const LEGAL_HELP = 'Laissez le champ vide pour revenir au modèle. Variables disponibles : {{legal_name}}, {{siren}}, {{legal_address}}, {{email}}, {{phone_display}}… Syntaxe : « ## Titre », « - liste », **gras**.';
SETTING_GROUPS.legal_mentions = { title: 'Mentions légales', fields: [{ name: 'legal_mentions', label: 'Texte de la page', type: 'rich', full: true, help: LEGAL_HELP }] };
SETTING_GROUPS.legal_privacy = { title: 'Politique de confidentialité', fields: [{ name: 'legal_privacy', label: 'Texte de la page', type: 'rich', full: true, help: LEGAL_HELP }] };

export const LEAD_STATUSES = ['nouveau', 'contacté', 'devis', 'gagné', 'perdu'];

export const DOC_STATUSES = {
  devis: ['brouillon', 'envoyé', 'accepté', 'refusé', 'facturé'],
  facture: ['brouillon', 'envoyée', 'payée', 'annulée'],
};

export const UNITS = ['u', 'h', 'm²', 'forfait', 'jour', 'véhicule', 'logement', 'mois'];
export const VAT_RATES = [20, 10, 5.5, 0];

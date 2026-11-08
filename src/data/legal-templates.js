// Modèles de pages légales. Variables : {{nom_du_champ}} (Paramètres). Syntaxe : "## Titre", "- liste", **gras**.
// IMPORTANT : textes types à faire relire et valider par l'éditeur du site (ou son conseil juridique).

export const LEGAL_KEYS = ['legal_mentions', 'legal_privacy'];

export const LEGAL_TEMPLATES = {
  legal_mentions: `## Éditeur du site
- **Raison sociale :** {{legal_name}}
- **Forme juridique :** {{legal_form}}
- **Capital social :** {{legal_capital}}
- **SIREN / SIRET :** {{siren}}
- **RCS :** {{legal_rcs}}
- **TVA intracommunautaire :** {{vat_number}}
- **Siège social :** {{legal_address}}
- **Téléphone :** {{phone_display}}
- **E-mail :** {{email}}
- **Directeur de la publication :** {{director}}

## Hébergement
Ce site est hébergé par Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Chypre – www.hostinger.fr.

## Conception et réalisation
- Site conçu et réalisé par {{credit_legal}}.

## Propriété intellectuelle
L’ensemble des contenus de ce site (textes, photographies, illustrations, logo, structure) est protégé par le droit d’auteur et reste la propriété de l’éditeur ou de ses concédants. Toute reproduction, représentation ou réutilisation, même partielle, sans autorisation écrite préalable est interdite.

## Responsabilité
Les informations présentées sur ce site sont données à titre indicatif et peuvent être modifiées à tout moment. Elles ne constituent pas une offre contractuelle : seul un devis signé engage l’éditeur sur le prix et le périmètre de la prestation. L’éditeur ne saurait être tenu responsable d’une indisponibilité temporaire du site ni de l’usage qui est fait des informations qu’il contient.

## Liens externes
Le site peut contenir des liens vers des sites tiers (par exemple WhatsApp). L’éditeur n’exerce aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.

## Médiation de la consommation
Pour les clients consommateurs, en cas de litige non résolu avec l’éditeur, il est possible de recourir gratuitement à un médiateur de la consommation : {{mediator_name}} {{mediator_url}}. Plateforme européenne de règlement en ligne des litiges : ec.europa.eu/consumers/odr.

## Droit applicable
Le présent site et ses mentions sont soumis au droit français.`,

  legal_privacy: `## Responsable du traitement
Le responsable du traitement des données personnelles collectées sur ce site est {{legal_name}}, {{legal_address}}. Contact : {{email}} – {{phone_display}}.

## Données collectées
Lorsque vous remplissez le formulaire de contact ou de demande de devis, nous collectons : votre nom, votre numéro de téléphone, votre adresse e-mail, le nom de votre entreprise (facultatif), la prestation et le lieu concernés, ainsi que le contenu de votre message. Le formulaire n’enregistre pas votre adresse IP. L’hébergeur peut toutefois conserver des journaux techniques de connexion (adresse IP, date) pour assurer la sécurité et le bon fonctionnement du serveur. Le journal de sécurité de l’espace d’administration enregistre, avec la date, l’adresse IP des connexions de l’éditeur uniquement. Si vous nous contactez par WhatsApp, votre numéro et le contenu des échanges sont traités par cette application.

## Finalités et bases légales
- Répondre à votre demande et établir un devis : mesures précontractuelles prises à votre demande.
- Exécuter la prestation, facturer et assurer le suivi de la relation commerciale : exécution du contrat et obligations légales (comptabilité).
- Gérer et sécuriser l’espace d’administration du site : intérêt légitime de l’éditeur.

Vos données ne sont ni vendues ni cédées à des fins publicitaires.

## Destinataires
Vos données sont destinées exclusivement à l’éditeur et à ses prestataires techniques strictement nécessaires : hébergeur du site (Hostinger International Ltd.) et, le cas échéant, service d’envoi d’e-mails. Ces prestataires agissent sur instruction de l’éditeur. Certains peuvent être situés hors de l’Union européenne ; dans ce cas, des garanties appropriées (clauses contractuelles types) encadrent le transfert.

## Durée de conservation
- Demandes de devis restées sans suite : 3 ans maximum, supprimées automatiquement.
- Devis, contrats et factures : 10 ans (obligations comptables).
- Journal de sécurité de l’administration (adresse IP, date) : 12 mois maximum, supprimés automatiquement.

## Vos droits
Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité. Pour l’exercer, écrivez-nous à {{email}} ou appelez le {{phone_display}}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).

## Cookies et traceurs
Ce site n’utilise aucun cookie publicitaire ni de mesure d’audience. Il dépose uniquement des traceurs strictement nécessaires, exemptés de consentement : un cookie de session pour l’espace d’administration (réservé à l’éditeur) et un cookie, ainsi qu’une entrée du stockage local de votre navigateur, qui mémorisent votre choix concernant les cookies pendant 6 mois maximum. Vous pouvez modifier ce choix à tout moment via « Gérer mes cookies » en bas de page. Si des outils de mesure d’audience, des cartes ou des vidéos intégrées sont ajoutés ultérieurement, ils ne seront activés qu’avec votre consentement, que vous pourrez retirer aussi simplement que vous l’avez donné.

## Décisions automatisées
Aucune décision automatisée, ni profilage, n’est réalisée à partir de vos données.

## Directives après décès
Vous pouvez définir des directives relatives au sort de vos données personnelles après votre décès en nous écrivant à {{email}}.

## Mise à jour de cette politique
Cette politique peut être modifiée pour tenir compte des évolutions légales ou du site ; la version publiée en ligne fait foi.

## Sécurité
L’éditeur met en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données (connexion chiffrée HTTPS, accès restreint et authentifié).`,

};

export const LEGAL_PAGES = {
  legal_mentions: { title: 'Mentions légales', path: '/mentions-legales' },
  legal_privacy: { title: 'Politique de confidentialité', path: '/confidentialite' },
};

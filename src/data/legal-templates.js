// Modèles de pages légales. Variables : {{nom_du_champ}} (Paramètres). Syntaxe : "## Titre", "- liste", **gras**.
// IMPORTANT : textes types à faire relire et valider par l'éditeur du site (ou son conseil juridique).

export const LEGAL_KEYS = ['legal_mentions', 'legal_privacy', 'legal_cgv'];

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

  legal_cgv: `## 1. Objet et champ d’application
Les présentes conditions générales de vente (CGV) régissent les prestations de nettoyage et services associés (fin de chantier, ménage et entretien, lavage de véhicules, débarras, vitrerie, etc.) fournies par {{legal_name}} ({{legal_form}}, SIREN {{siren}}, siège : {{legal_address}}), ci-après « le Prestataire », à ses clients, ci-après « le Client ». Certaines clauses distinguent les **clients professionnels** et les **clients particuliers (consommateurs)**. Toute commande implique l’acceptation des CGV, qui prévalent sur tout autre document du Client professionnel, sauf accord écrit.

## 2. Devis et commande
Toute prestation fait l’objet d’un devis gratuit, établi d’après les informations fournies par le Client (nature des lieux, surfaces, état, accès, délais) ou après visite. Le devis est valable {{quote_validity_days}} jours. La commande est formée lorsque le Client retourne le devis daté, signé et portant la mention « Bon pour accord » (remis en main propre, scanné, photographié ou envoyé par e-mail ou message), ou le confirme par écrit. Toute modification du périmètre fait l’objet d’un avenant ou d’un nouveau devis.

## 3. Prix
Les prix sont exprimés en euros. {{vat_mention}} Ils sont fermes pour le périmètre décrit au devis. Des frais supplémentaires peuvent s’appliquer si les conditions réelles diffèrent de celles annoncées (volume ou état de saleté supérieur, difficulté d’accès, attente sur site, intervention en dehors des horaires convenus) ; ils sont alors communiqués au Client et acceptés par lui avant intervention.

## 4. Exécution de la prestation
Le Prestataire réalise la prestation avec soin et selon les règles de l’art ; il est tenu à une obligation de moyens. Le Client garantit un accès libre et sécurisé aux lieux, ainsi que l’eau et l’électricité nécessaires, sauf mention contraire au devis. Les dates d’intervention sont indicatives, sauf engagement exprès. Le Prestataire peut sous-traiter tout ou partie de la prestation en restant responsable de son exécution.

## 5. Obligations du Client
Le Client informe le Prestataire des risques particuliers (surfaces fragiles, objets de valeur, présence d’animaux, matériaux sensibles) et retire ou protège les objets précieux et documents confidentiels. Pour le lavage de véhicule, il signale les dommages préexistants et retire ses effets personnels. Pour un débarras, il déclare être propriétaire des biens ou habilité à en disposer et indique ceux à conserver.

## 6. Déchets, débarras et évacuation
Les déchets issus de la prestation sont triés et évacués par le Prestataire vers les filières adaptées (déchèterie, recyclage) lorsque cela est prévu au devis ; les coûts de traitement peuvent être refacturés. Le Client doit signaler tout déchet dangereux ou réglementé (amiante, produits chimiques, peintures, batteries, déchets d’activités de soins, etc.) : le Prestataire peut refuser de les prendre en charge ou les facturer en supplément. Les objets restés sur place après accord de débarras sont évacués ou conservés par le Prestataire selon les modalités du devis.

## 7. Réception et réclamations
La prestation est réputée acceptée à la fin de l’intervention en l’absence de réserve.
**Clients professionnels.** Toute réclamation est adressée par écrit (e-mail ou message, photos si possible) dans un délai de 48 heures suivant l’intervention.
**Clients particuliers.** Toute réclamation peut être adressée par écrit dans les meilleurs délais, sans préjudice des garanties et recours prévus par la loi.
Dans tous les cas, si le défaut est avéré et imputable au Prestataire, celui-ci reprend sans frais la zone concernée.

## 8. Paiement
Sauf conditions particulières au devis, les factures sont payables sous {{payment_terms_days}} jours à compter de leur émission, par virement ou autre moyen convenu. Un acompte peut être demandé à la commande.
**Clients professionnels.** En cas de retard de paiement, des pénalités sont exigibles de plein droit, au taux de trois fois le taux d’intérêt légal, sans mise en demeure préalable, ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce). Aucun escompte n’est accordé pour paiement anticipé.
**Clients particuliers.** En cas de retard, les sommes dues portent intérêt au taux légal après mise en demeure.
Le Prestataire peut suspendre ses prestations en cas d’impayé.

## 9. Annulation et report
Toute annulation ou report doit être signalé au Prestataire par écrit.
**Clients professionnels.** Moins de 48 heures avant l’intervention, le Prestataire peut facturer les frais engagés dans la limite de 30 % du montant de la prestation ; une prestation annulée le jour même ou rendue impossible faute d’accès aux lieux est due en totalité.
**Clients particuliers.** Sous réserve du droit de rétractation (article 10), l’annulation est gratuite jusqu’à 48 heures avant l’intervention. Au-delà, le Prestataire ne peut facturer que les frais réellement engagés et un dédommagement raisonnable, proportionné au préjudice subi.

## 10. Droit de rétractation (clients particuliers)
Lorsque le contrat est conclu à distance (par e-mail, message ou téléphone) ou hors établissement, le consommateur dispose de **14 jours** à compter de la conclusion du contrat pour se rétracter, sans avoir à motiver sa décision, en notifiant sa décision de façon non équivoque par écrit à {{email}} ou à {{legal_address}} (le formulaire en annexe peut être utilisé). Si le Client demande que la prestation commence avant la fin de ce délai, il en fait la demande expresse ; s’il se rétracte ensuite, il paie un montant proportionnel à ce qui a été fourni jusqu’à la rétractation. Le droit de rétractation ne peut plus être exercé une fois la prestation entièrement exécutée, si elle a commencé avec l’accord préalable exprès du consommateur et sa renonciation à ce droit. Ce droit ne bénéficie pas aux clients professionnels.

## 11. Responsabilité et assurance
Le Prestataire est assuré en responsabilité civile professionnelle. Il répond des dommages directs causés par sa faute dans l’exécution de la prestation.
**Clients professionnels.** La responsabilité du Prestataire est limitée aux dommages directs et prouvés, et plafonnée au montant hors taxes de la prestation concernée. Elle ne couvre pas les dommages résultant d’informations erronées ou omises par le Client, de la fragilité ou de l’usure préexistante des supports, de défauts non apparents, ni des cas de force majeure. Tout sinistre est déclaré par écrit dans les 48 heures.
**Clients particuliers.** Aucune clause des présentes ne limite les droits que la loi reconnaît au consommateur ; la responsabilité du Prestataire reste engagée selon le droit commun, sauf faute ou négligence du Client.

## 12. Force majeure
Aucune partie n’est responsable d’un manquement dû à un cas de force majeure (conditions météorologiques exceptionnelles, fermeture de routes ou de stations, grève, épidémie, décision administrative…). Les prestations sont alors reportées ou, si l’empêchement dure plus de 30 jours, résiliées sans indemnité.

## 13. Protection des données
Les données personnelles du Client sont traitées conformément à la politique de confidentialité du site.

## 14. Médiation, droit applicable et litiges
Les CGV sont soumises au droit français. En cas de litige, les parties recherchent d’abord une solution amiable. Le Client consommateur peut recourir gratuitement au médiateur de la consommation : {{mediator_name}} {{mediator_url}}. À défaut d’accord, le tribunal compétent est celui du lieu du siège du Prestataire pour les clients professionnels, et celui déterminé par la loi pour les consommateurs.

## 15. Acceptation
Le Client reconnaît avoir pris connaissance des présentes CGV et les accepter en signant le devis ou en le confirmant par écrit.

## Annexe – Formulaire type de rétractation
À compléter et renvoyer uniquement si vous souhaitez vous rétracter du contrat (clients particuliers).
À l’attention de {{legal_name}}, {{legal_address}}, {{email}} :
Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services suivante :
- Prestation commandée le :
- Nom du consommateur :
- Adresse du consommateur :
- Date :
- Signature (uniquement en cas de notification sur papier) :`,
};

export const LEGAL_PAGES = {
  legal_mentions: { title: 'Mentions légales', path: '/mentions-legales' },
  legal_privacy: { title: 'Politique de confidentialité', path: '/confidentialite' },
  legal_cgv: { title: 'Conditions générales de vente', path: '/cgv' },
};

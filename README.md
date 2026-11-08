# SavoiClean — site vitrine + back-office

Site web d'une entreprise de nettoyage (Savoie / Haute-Savoie) : SEO local, formulaire de devis, WhatsApp, back-office (demandes, devis & factures PDF, contenu, pages légales), authentification admin avec 2FA.

**Stack** : Next.js 16 (App Router), React 19, MySQL (production) ou SQLite (dev), PDF via pdf-lib.

## Installation chez le client (Hostinger Node.js)

1. Créer une base MySQL dans hPanel (nom, utilisateur, mot de passe).
2. Déployer ce dépôt (Git ou archive) en application **Node.js 20 / Next.js**.
   - Commande de build : `npm run build` (utilise `next build --webpack`, obligatoire sur Hostinger)
   - Dossier de sortie : `.next`
3. Définir les variables d'environnement (voir `.env.example`) : `DB_HOST=127.0.0.1`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `APP_SECRET` (32+ caractères aléatoires), `SETUP_TOKEN`, `SITE_URL`.
   - `ALLOW_INDEXING=false` tant que le vrai domaine n'est pas branché, puis `true`.
   - Facultatif : `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_FROM` pour recevoir les demandes par e-mail.
4. Relancer un build, puis ouvrir `/admin/setup`, saisir le `SETUP_TOKEN` et créer le compte administrateur (activer la 2FA dans Paramètres › Sécurité).
5. Dans l'admin : **Paramètres › Entreprise / Société & facturation** (raison sociale, SIREN, adresse, TVA, capital, RCS, médiateur, IBAN, e-mail). Ces informations alimentent les pages légales et les PDF.
6. Relire les **Pages légales** (Contenu › Pages légales) : ce sont des modèles à faire valider par l'éditeur.

Les tables sont créées automatiquement au premier démarrage et le contenu initial (services, zones, FAQ, articles, diaporama) est inséré une seule fois.

## Développement local

```bash
npm install
USE_SQLITE=1 INSECURE_COOKIES=1 SETUP_TOKEN=dev APP_SECRET=$(openssl rand -hex 24) npm run dev
```

La base SQLite locale est créée dans `data/` (ignorée par Git).

## Sécurité

- Ne jamais committer `.env*`, la base de données ni `SETUP_TOKEN` / `APP_SECRET`.
- Anti-spam du formulaire sans adresse IP (piège anti-robot + plafond global).
- Purge automatique quotidienne : demandes sans suite > 3 ans, journal de sécurité > 12 mois.

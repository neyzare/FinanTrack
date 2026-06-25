# Prompt pour Gamma.app : Diaporama de soutenance Finantrack

Crée un diaporama professionnel de 33 slides pour la soutenance d'un titre RNCP Concepteur Développeur d'Applications (CDA, niveau 6, Bac+3/4). Le projet présenté s'appelle Finantrack. Le candidat est Lucas Narguet. La présentation dure environ 30 minutes devant un jury technique composé de développeurs et de formateurs.

## Charte visuelle

Style sobre et professionnel, fond blanc. Pas de surcharge graphique. Couleurs principales : bleu primaire #2E75B6 pour les accents, vert #16A34A pour les hausses et succès, rouge #DC2626 pour les baisses et alertes, gris foncé #1F2937 pour le texte. Polices sans-serif modernes type Inter ou Geist. Icônes minimalistes type lucide-react. Tous les titres de slide en noir ou gris très foncé, jamais en couleur vive. Une slide, une idée. Préfère les schémas faits maison aux illustrations IA génériques.

## Présentation du projet

Finantrack est une application web de suivi de portefeuille boursier déployée en production sur finantrack.lucasnarguet.fr. L'utilisateur crée un compte, ajoute les actions qu'il détient, et visualise en temps quasi réel la valorisation de son portefeuille via l'API Finnhub. L'application propose aussi une calculatrice d'intérêts composés et une sandbox de trading avec capital fictif de 10 000 euros pour s'entraîner sans risque.

## Stack technique à mettre en avant

Frontend : Next.js 16 avec App Router, React 19, TypeScript strict, Tailwind CSS 4, daisyUI, Radix UI, Recharts pour les graphiques, lucide-react pour les icônes. Backend : Server Actions Next.js, validation Zod systématique sur toutes les entrées, authentification maison par cookie signé HMAC-SHA256, hashage bcrypt 10 rounds. Base de données : PostgreSQL 16 via Prisma 7 avec migrations versionnées. Services externes : Finnhub pour les cours boursiers avec rate-limiter applicatif et cache 5 min, Resend pour les emails de réinitialisation. CI/CD : GitHub Actions avec service Postgres et coverage Vitest. Déploiement : Docker multi-stage non-root sur VPS Hetzner orchestré par Coolify, reverse proxy Traefik, certificat Let's Encrypt automatique.

## Structure des 33 slides

Slide 1, page de titre : Finantrack en grand, sous-titre "Application web de suivi de portefeuille boursier", nom Lucas Narguet, mention Titre professionnel CDA (RNCP 38038), date de soutenance.

Slide 2, sommaire : 4 grandes parties (Contexte et besoin, Conception, Réalisation, Déploiement et bilan).

Slide 3, présentation du candidat : 3 puces courtes (qui je suis, formation suivie, intérêt particulier pour le développement et la sécurité applicative).

Slide 4, contexte et besoin : constat sur les plateformes de courtage trop complexes et les tableurs Excel mal adaptés. Naissance de l'idée Finantrack.

Slide 5, objectifs : 4 objectifs principaux (centraliser le suivi, automatiser la valorisation, proposer des outils de simulation, réellement déployer en production).

Slide 6, périmètre fonctionnel : deux colonnes Inclus et Hors-scope. Inclus : authentification, gestion de portefeuille, cours temps quasi réel, sandbox, calculatrice. Hors-scope : passage d'ordres réels, fiscalité, 2FA.

Slide 7, personas : Virginie 49 ans investisseuse confirmée vs Lucas 23 ans débutant en sandbox. Deux cartes côte à côte avec leurs besoins respectifs.

Slide 8, diagramme de cas d'utilisation : capture du diagramme UML avec Visiteur, Utilisateur connecté, Finnhub API, Resend. Mention de la généralisation entre acteurs et des relations include et extend.

Slide 9, méthodologie Kanban : pourquoi Kanban et pas Scrum quand on est seul (pas de rituels qui font perdre du temps en solo, flux continu). Trois colonnes A faire, En cours, Terminé.

Slide 10, board Jira : capture du board avec 7 epics et 41 tickets. Détailler la répartition (combien terminés, en cours, à faire).

Slide 11, architecture logicielle en couches : schéma simple avec 4 couches empilées de haut en bas (Présentation, Logique métier, Services, Données). Lister les technos pour chaque couche.

Slide 12, modèle de données : diagramme de classes simplifié avec User, Stock, StockSnapshot, CachedQuote, SandboxState, SandboxStock, PasswordResetToken et leurs relations 1-N.

Slide 13, schéma Prisma : extrait de prisma/schema.prisma pour le modèle Stock avec la contrainte d'unicité composite UNIQUE(userId, ticker) et la cascade onDelete.

Slide 14, maquettes principales : aperçus côte à côte du dashboard, de la page action et de la sandbox.

Slide 15, charte graphique : la charte graphique que j'ai produite (4 couleurs, Geist Sans et Mono, lucide-react).

Slide 16, stack technique complète : grille de logos avec versions. Frontend, backend, base de données, services externes, conteneurisation, CI/CD, hébergement.

Slide 17, choix d'architecture : pourquoi Next.js App Router plutôt que SPA et API séparées. Pourquoi Server Actions plutôt que routes REST. Pourquoi cache applicatif PostgreSQL plutôt que Redis.

Slide 18, authentification maison : bcrypt 10 rounds pour le hash, cookie signé HMAC-SHA256 avec comparaison en temps constant. Schéma du flux d'inscription / connexion.

Slide 19, sécurité OWASP Top 10 : matrice 10 lignes qui croise chaque vulnérabilité avec la mesure concrète prise dans Finantrack (injection bloquée par Prisma et Zod, sessions par HMAC, etc.).

Slide 20, focus cookie HMAC : extrait de code de cookie-sign.ts (signature et vérification). Pourquoi timingSafeEqual.

Slide 21, fonctionnalité principale, ajout d'une action : diagramme de séquence simplifié de l'utilisateur saisissant un ticker, la Server Action qui appelle Finnhub, écrit en base, met à jour le cache CachedQuote.

Slide 22, sandbox de trading : capture du graphique en chandeliers japonais. Explication de la simulation locale (variation aléatoire bornée 3%, 20 ticks par bougie). Aucun coût d'API.

Slide 23, calculatrice d'intérêts composés : extrait de la fonction pure interetAvecApportMensuel. Pourquoi une fonction pure facilite le test.

Slide 24, plan de tests : pyramide de tests (unitaire, intégration, end-to-end). Outils utilisés (Vitest, coverage). Périmètre actuellement couvert et à étendre.

Slide 25, jeu d'essai détaillé : tableau de la fonctionnalité ajout d'action avec colonnes Cas, Données entrée, Données attendues, Données obtenues, Verdict. Au moins 4 lignes.

Slide 26, pipeline CI/CD : schéma des étapes GitHub Actions dans l'ordre (checkout, install, prisma generate, lint, tests Vitest, migrate sur service Postgres, build Next). Explication de l'ordre fail fast.

Slide 27, Dockerfile multi-stage : schéma des 3 stages (deps, builder, runner). Mention de l'utilisateur non-root nextjs, du mode standalone de Next, de la taille finale d'image autour de 200 Mo.

Slide 28, déploiement Coolify et Traefik : schéma du flux complet (navigateur, IP Hetzner, Traefik sur ports 80/443, terminaison TLS, forward vers container Next sur port 3000 interne, certificat Let's Encrypt).

Slide 29, configuration DNS : tableau des enregistrements (A pour IPv4, AAAA pour IPv6, TXT pour vérification Google Search Console et signature DKIM Resend, CAA pour limiter l'autorité Let's Encrypt).

Slide 30, bugs trouvés et corrigés : 4 exemples concrets en bullets courtes (proxy bloquait le challenge Let's Encrypt, FOUC du thème localStorage vers cookie, incohérence longueur mot de passe register/login, validation Zod manquante sur quantité).

Slide 31, veille technologique : sources suivies régulièrement (OWASP, ANSSI, blog officiel Next.js, Micode et Underscore pour la sécurité). Comment cette veille a influencé les choix.

Slide 32, bilan et évolutions : ce que le projet m'a apporté (concrétisation d'une stack complète, sécurité, DevOps). Prochaines briques priorisées (sauvegardes BDD chiffrées, Sentry, 2FA, CSP stricte, export PDF du portefeuille).

Slide 33, slide de fin : URL du site live finantrack.lucasnarguet.fr, lien du dépôt GitHub, remerciements au jury, "Place aux questions".

## Ton et style

Phrases courtes et factuelles. Pas de jargon marketing ni d'hyperboles. Pas de mots vides type "leverage", "synergique", "robuste", "innovant". Préfère les chiffres et faits concrets. Aucun double tiret cadratin, utilise des tirets simples ou des virgules. Aucune apostrophe droite ASCII, utilise les apostrophes typographiques françaises. Le candidat parle à la première personne du singulier (j'ai choisi, j'ai mis en place, je gère).

## Format de sortie

PDF exportable, ratio 16:9, transitions sobres, aucune animation gimmick. Chaque slide doit pouvoir être commentée entre 45 et 75 secondes à l'oral. Marges généreuses, pas de texte trop dense.

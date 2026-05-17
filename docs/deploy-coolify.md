# Déploiement sur Coolify (Hetzner)

Ce document explique comment déployer Finantrack sur un serveur Hetzner avec Coolify.

## Prérequis

- Serveur Hetzner avec Coolify installé et accessible.
- Un domaine pointé (enregistrement DNS `A` ou `AAAA`) vers l'IP publique du serveur.
- Le dépôt Git accessible depuis Coolify (GitHub App connectée ou clé de déploiement SSH).
- Une clé API Finnhub valide.

## 1. Créer la base PostgreSQL dans Coolify

1. Dans Coolify, ouvrir le projet cible (ou en créer un nouveau).
2. `New Resource` → `Database` → `PostgreSQL`.
3. Choisir la dernière version `16` (compatible avec la CI).
4. Donner un nom (par exemple `finantrack-db`) et un mot de passe fort.
5. Laisser le port non exposé publiquement : la connexion se fera via le réseau interne Docker.
6. Démarrer le service et récupérer la chaîne de connexion interne, qui ressemble à :
   ```
   postgres://postgres:<password>@<service-name>:5432/postgres
   ```
   Coolify l'affiche dans l'onglet `Connection` du service Postgres.

## 2. Créer l'application

1. `New Resource` → `Application` → `Public Repository` ou `Private Repository (GitHub App)`.
2. Sélectionner le dépôt et la branche `main`.
3. Build Pack : `Dockerfile`. Coolify détectera automatiquement le `Dockerfile` à la racine.
4. Port exposé : `3000`.

## 3. Variables d'environnement

Dans l'onglet `Environment Variables` de l'application, ajouter :

| Clé | Valeur |
|-----|--------|
| `DATABASE_URL` | URL interne fournie par le service Postgres Coolify |
| `AUTH_COOKIE_SECRET` | Secret aléatoire généré localement (32+ octets, voir ci-dessous) |
| `FINNHUB_API_KEY` | Clé Finnhub de production |
| `NODE_ENV` | `production` (souvent ajoutée automatiquement) |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Génération d'un secret de cookie sûr :
```bash
openssl rand -hex 32
```

Marquer `AUTH_COOKIE_SECRET` et `DATABASE_URL` comme `Is Secret` pour qu'ils n'apparaissent pas dans les logs.

## 4. Domaine et SSL

1. Onglet `Domains` → ajouter le domaine final (par exemple `finantrack.example.com`).
2. Coolify provisionne automatiquement le certificat Let's Encrypt si le DNS est correct.
3. Vérifier que `Force HTTPS Redirect` est activé.

## 5. Healthcheck

Le `Dockerfile` expose le port 3000 et l'app Next.js répond sur `/`. Aucun réglage spécial n'est requis : Coolify utilise un check TCP par défaut. Pour un check HTTP plus précis, configurer `/` en path dans l'onglet `Healthchecks`.

## 6. Migrations Prisma

Les migrations sont jouées automatiquement au démarrage du container via `docker-entrypoint.sh` qui exécute `prisma migrate deploy` avant `next start`. Aucune commande pre-deploy à configurer dans Coolify.

> Si une migration échoue, le container ne démarre pas — c'est volontaire pour éviter une app en état incohérent. Consulter les logs Coolify.

## 7. Déploiement

1. Cliquer sur `Deploy`.
2. Suivre les logs : on doit voir successivement `npm ci`, `prisma generate`, `next build`, puis au runtime `Running Prisma migrations...` et le log de démarrage de Next.js.
3. Une fois `Ready`, ouvrir le domaine dans le navigateur.

## 8. Déploiement automatique

Dans l'onglet `Source` de l'application, activer `Automatic Deployment on Git Push`. Chaque push sur `main` déclenchera un build + déploiement.

## Dépannage rapide

- **`Can't reach database server`** : vérifier que `DATABASE_URL` utilise le nom de service interne Postgres de Coolify (pas `localhost`).
- **`PrismaClientInitializationError` au build** : `prisma generate` est lancé pendant le build via le postinstall ET dans le stage builder, c'est normal. Ne pas mettre `DATABASE_URL` dans l'env de build, seulement au runtime.
- **Cookie de session non persistant** : vérifier que `AUTH_COOKIE_SECRET` est identique entre deux déploiements (le perdre invalide toutes les sessions actives).
- **Image trop grosse / build lent** : `output: 'standalone'` est activé dans `next.config.ts`, le stage runner ne contient que le strict nécessaire. Si l'image dépasse 500 MB, vérifier `.dockerignore`.

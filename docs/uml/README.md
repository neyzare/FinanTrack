# Documentation UML - FinanTrack

Cette documentation contient les diagrammes UML de l'application FinanTrack.

## Liste des diagrammes

1. **01-class-diagram.puml** - Diagramme de classes (modèle de données)
2. **02-component-diagram.puml** - Diagramme de composants (architecture)
3. **03-usecase-diagram.puml** - Diagramme de cas d'utilisation
4. **04-sequence-auth.puml** - Diagramme de séquence (authentification)
5. **05-sequence-portfolio.puml** - Diagramme de séquence (gestion du portefeuille)
6. **06-layered-architecture.puml** - Architecture en couches
7. **07-state-diagram.puml** - Diagramme d'états (session utilisateur)

## Comment générer les images

### Option 1: En ligne de commande avec PlantUML

```bash
# Installer PlantUML (nécessite Java)
brew install plantuml  # macOS
# ou
apt-get install plantuml  # Linux

# Générer toutes les images PNG
plantuml docs/uml/*.puml

# Générer en SVG (meilleure qualité)
plantuml -tsvg docs/uml/*.puml
```

### Option 2: Avec VS Code

1. Installer l'extension "PlantUML" de jebbs
2. Ouvrir un fichier .puml
3. Appuyer sur `Alt+D` pour prévisualiser
4. Clic droit → "Export Current Diagram" pour sauvegarder

### Option 3: En ligne

Visitez: https://www.plantuml.com/plantuml/uml/

Copiez-collez le contenu d'un fichier .puml et cliquez sur "Submit"

### Option 4: Avec Docker

```bash
# Générer toutes les images en PNG
docker run --rm -v $(pwd)/docs/uml:/data plantuml/plantuml:latest -tpng /data/*.puml

# Générer toutes les images en SVG
docker run --rm -v $(pwd)/docs/uml:/data plantuml/plantuml:latest -tsvg /data/*.puml
```

## Description des diagrammes

### 1. Diagramme de Classes

Montre les entités principales (User, Stock) et leurs relations dans la base de données.

### 2. Diagramme de Composants

Illustre l'architecture globale de l'application avec les différentes couches et services.

### 3. Diagramme de Cas d'Utilisation

Présente les fonctionnalités accessibles aux utilisateurs et les interactions avec l'API externe.

### 4. Diagramme de Séquence - Authentification

Détaille le processus de connexion d'un utilisateur avec validation et gestion des erreurs.

### 5. Diagramme de Séquence - Portefeuille

Montre le flux d'ajout d'une action au portefeuille avec récupération des prix en temps réel.

### 6. Architecture en Couches

Représente l'organisation en 4 couches distinctes de l'application.

### 7. Diagramme d'États

Illustre les différents états d'une session utilisateur et les transitions possibles.

## Technologies utilisées

- **Frontend**: Next.js 15, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **Base de données**: PostgreSQL + Prisma ORM
- **API externe**: Finnhub (données boursières)
- **Authentification**: Cookie-based avec bcrypt
- **Validation**: Zod

#!/bin/bash

# Script pour générer les images UML à partir des fichiers PlantUML
# Utilise Docker pour éviter d'installer Java et PlantUML localement

echo "🎨 Génération des diagrammes UML..."

# Créer le dossier de sortie s'il n'existe pas
mkdir -p docs/uml/images

# Générer les images PNG avec Docker
docker run --rm \
  -v "$(pwd)/docs/uml:/data" \
  plantuml/plantuml:latest \
  -tpng \
  -o images \
  /data/*.puml

if [ $? -eq 0 ]; then
  echo "✅ Diagrammes générés avec succès dans docs/uml/images/"
  echo ""
  echo "📁 Fichiers générés:"
  ls -lh docs/uml/images/*.png
else
  echo "❌ Erreur lors de la génération des diagrammes"
  echo ""
  echo "💡 Assurez-vous que Docker est installé et en cours d'exécution"
  echo "   Installation: https://www.docker.com/get-started"
  exit 1
fi

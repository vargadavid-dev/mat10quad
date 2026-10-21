#!/bin/bash

# Állj meg hiba esetén
set -e

echo "Deploy folyamat indítása..."

# 1. Minden változás hozzáadása
echo "Változások hozzáadása..."
git add .

# 2. Commit készítése (ha vannak változások)
if ! git diff-index --quiet HEAD --; then
    echo "Commit készítése..."
    git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "Nincs új változás a commit-hoz."
fi

# 3. Feltöltés a main ágra
echo "Feltöltés a GitHub-ra (main ág)..."
git push origin main

# 4. Build készítése
echo "Projekt építése..."
npm run build

# 5. Deploy a gh-pages ágra
echo "Deploy indítása gh-pages-re..."
npm run deploy

echo "Sikeres deployment!"

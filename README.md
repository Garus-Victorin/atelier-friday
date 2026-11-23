# Atelier Friday — Outils 1, 2, 3

Trois outils mobiles-first, sans serveur ni compte, pour l'atelier de démonstration.

## Contenu

- `outil1-reservation/` — Mini-page de réservation WhatsApp pour un salon de coiffure.
- `outil2-presentation/` — Page vitrine pour un cabinet d'avocat (modèle réutilisable).
- `outil3-creances/` — Carnet « Qui me doit ? » pour le même salon.

## Lancer en local

Chaque outil est un site statique autonome. Ouvrez `index.html` ou servez le dossier :

```
python -m http.server 8080
```

Puis `http://localhost:8080/outil1-reservation/`, etc.

## Personnaliser

Chaque outil a un `config.js` unique. Modifiez-le pour changer le nom, le numéro WhatsApp, les services, les horaires, les photos, etc. Aucune modification de code n'est nécessaire.

## Déployer (gratuit)

- GitHub Pages : pousser chaque dossier (ou le monolithe) sur une branche `gh-pages`.
- Netlify : glisser-déposer chaque dossier.

## Démo live

1. Téléphone chargé, données démo pré-remplies.
2. WhatsApp testé avec numéro réel.
3. Mode avion testé (PWA offline).
4. Vidéo de secours < 30 s par outil.

## Stack

HTML / CSS / JS vanilla, PWA minimale (manifest + service worker). Aucune librairie, aucune image lourde.
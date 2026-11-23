# Qui me doit ? — Carnet de créances Camélia Hair

Application autonome, sans compte, sans serveur. Les données sont stockées dans le `localStorage` du téléphone.

## Lancer

Ouvrez `index.html` dans un navigateur, ou :

```
python -m http.server 8081
```

Puis `http://localhost:8081`.

## Fonctions

- Ajouter une créance : nom, montant, échéance, téléphone, motif.
- Liste triée par échéance avec total en haut, badges de couleur (en retard / bientôt / dû / payé).
- Recherche par nom ou motif.
- Tri par date / nom / montant.
- Marquer « Payé » ou « Payé en partie » (avec historique).
- Modifier une créance (recalcul automatique du reste).
- Bouton « Relancer » → ouvre WhatsApp avec message poli prérempli (nécessite un téléphone).
- Export CSV (UTF-8 BOM, séparateur `;`) ouvrable dans Excel FR. Fichier : `creances-camelia-hair-AAAA-MM-JJ.csv`.

## Données

- Clé `localStorage` : `creances-v1`.
- Format : `{ version: 1, clients: [ { id, nom, montant, echeance, telephone?, motif?, reste, statut, historique[] } ] }`.
- Montants stockés en entiers (Francs CFA) pour éviter les erreurs de virgule flottante.
- Toutes les données restent sur ce téléphone (pas de cloud).

## PWA

`manifest.json` + `sw.js` : installable sur l'écran d'accueil, fonctionne hors-ligne après la première visite.

## Limites assumées

- Pas de synchronisation cloud : les données restent sur ce téléphone.
- Pas de factures, pas de statistiques, pas de stock (hors scope).
- Si l'utilisateur vide le stockage du navigateur, les données sont perdues. D'où l'export CSV régulier.

## Message de relance WhatsApp

Modèle (personnalisable dans `config.js` via `msgRelanceTemplate`) :

```
Bonjour [Prénom], j'espère que vous allez bien !

Je me permets de vous rappeler pour [motif].
Il reste [reste] FCFA à régler (échéance : [date]).

N'hésitez pas à passer au salon pour régler. Merci de votre confiance. Camélia Hair.
```

Le message s'adapte automatiquement :
- **Montant** : affiche le *reste à payer* (pas le montant original), donc correct même après un paiement partiel.
- **Motif** : utilise le motif saisi, ou "votre créance" par défaut.
- **Prénom** : extrait du nom complet.
- **Salon** : signé "Camélia Hair" pour professionnaliser l'image.

## Demo

Données de démonstration à saisir en direct :

1. Awa Koné — 15000 F — échéance J+2 — Knotless Braids
2. Fatou Diallo — 8000 F — échéance J+10 — Soin + produit
3. Mariam Traoré — 25000 F — échéance J-1 — Tissage (en retard)

Marquer la 2e en partie (5000 F), relancer la 3e sur WhatsApp.
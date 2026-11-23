# Camélia Hair — Mini-page de réservation WhatsApp

Page unique, sans serveur ni base de données. Le client choisit un style parmi 16 coiffures (avec photo), choisit une date, une heure et son nom, puis un bouton ouvre WhatsApp avec un message prérempli.

## Lancer en local

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```
python -m http.server 8080
```

Puis `http://localhost:8080`.

## Parcours (5 écrans, 1 geste par écran)

1. **Style** — Grille de 16 coiffures avec photo + prix, filtrées par catégorie (Tout / Braids / Cornrows / Twists). Tap → avance.
2. **Date** — Calendrier natif, lundi fermé. Auto-avance si le jour est ouvert.
3. **Heure** — Créneaux en boutons, passés grisés. Si tous passés, message + retour. Tap → avance.
4. **Nom** — Champ texte. Entrée ou bouton Continuer. Tap → avance.
5. **Récap** — Récap non éditable + bouton WhatsApp vert. Message prérempli envoyé.

## Catalogue (16 styles, images WebP < 65 Ko)

| Catégorie | Styles |
|---|---|
| Braids (7) | Boohoo Braids, Coiffure Enfants, French curl, Fulani braids, Fulani crochet, Knotless Braids, Ponytail |
| Cornrows (3) | Coiffure Homme, Fulani sans rajout, Nattes collées |
| Twists (6) | Butterfly Locs, Crochet braid, Island Twists, Minitwist, Passion Twists, Twist |

Images téléchargées depuis ayane.justbraid.com, converties/optimisées en WebP, toutes < 65 Ko.

## Message WhatsApp envoyé

Exactement :

```
Bonjour Camélia Hair, je souhaite réserver [style] le [date] à [heure]. Prix : [prix] FCFA. Nom : [nom]. Merci !
```

Les `[style]`, `[date]`, `[heure]` et `[nom]` sont remplis automatiquement depuis les choix du client.

## DoD (Definition of Done)

Une personne extérieure à l'équipe réussit une réservation en moins d'une minute, sans aide.

## Tester la démo

1. Ouvrez `index.html`.
2. Choisissez une catégorie (Tout / Braids / Cornrows / Twists).
3. Touchez une coiffure (ex. Knotless Braids).
4. Choisissez une date ouverte (mardi-dimanche, lundi fermé).
5. Choisissez une heure non passée.
6. Saisissez un nom.
7. Cliquez "Envoyer sur WhatsApp" → WhatsApp s'ouvre avec le message prérempli vers +229 01 42 10 27 39.
8. Vérifiez que le message correspond exactement au format ci-dessus.

## Personnaliser pour un autre commerçant

Modifiez uniquement `config.js` :

- `nom`, `slogan`, `ville`, `pays`
- `whatsapp` (format international, sans `+` ni espaces, ex. `2290142102739`)
- `devise` (ex. `FCFA`)
- `services` (id, nom, prix, duree_min, image, categorie) — ajoutez/retirez des coiffures
- `jours` (ouvert true/false par jour)
- `creneaux` (heures proposées)
- `jours_anticipation_max` (profondeur du calendrier)
- `textes` (tous les libellés ; `msg_whatsapp` est le modèle du message envoyé)

Aucune modification de `app.js` ou `index.html` n'est nécessaire.

## Déployer (gratuit)

- GitHub Pages : pousser le dossier sur une branche `gh-pages`.
- Netlify : glisser-déposer le dossier.

## Notes

- Le message WhatsApp utilise `https://wa.me/<numéro>?text=<message encodé>`. Le lien ouvre WhatsApp directement (app ou navigateur).
- Un bouton "Copier le message" est prévu en secours si WhatsApp ne s'ouvre pas.
- Les créneaux déjà passés sont grisés automatiquement.
- Si tous les créneaux du jour sont passés, un message invite à choisir un autre jour.
- Le lundi est fermé par défaut (`jours[].ouvert = false`).
- Si `config.js` est manquant ou cassé, un message d'erreur s'affiche au lieu de planter.
- Les images sont en WebP, chargées en lazy, toutes < 65 Ko. Total page < 1 Mo.

## Limites connues (assumées)

- Pas de vérification de disponibilité réelle (pas de serveur) : une demande peut arriver sur un créneau déjà pris. À gérer par le commerçant.
- Pas de paiement, pas de compte.
- La sélection de la date utilise le sélecteur natif du téléphone (pas de désactivation visuelle des jours fermés dans le picker). Le contrôle se fait après sélection.
- Le catalogue est statique (pas de gestion de stock ni de prix dynamiques).
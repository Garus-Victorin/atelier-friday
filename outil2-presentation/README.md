# Cabinet AVERY & Associés — Page de présentation

Page vitrine unique, sans serveur ni base de données. Conçue pour être trouvée sur Google et envoyer un message WhatsApp au cabinet.

## Lancer en local

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```
python -m http.server 8080
```

Puis `http://localhost:8080`.

## Informations du cabinet (fictif)

- **Nom** : Cabinet AVERY & Associés
- **Avocat** : Maître AVERY — Avocat au Barreau de Cotonou
- **Adresse** : Rue des Jardins, Cocody, Cotonou, Bénin
- **Tél** : +229 01 00 00 00 00
- **Email** : contact@cabinet-avery.bj
- **Horaires** : Lun-Ven 08h00-18h00, Sam-Dim fermé
- **Distinction** : Cabinet fondé en 2010, accompagnement de plus de 200 entreprises

## Structure de la page

1. **Hero** — Nom du cabinet, slogan, 2 boutons (WhatsApp / Appeler).
2. **Expertises** — 6 domaines (Droit des affaires, Famille, Travail, Immobilier, Civil, Pénal).
3. **Distinctions** — Fondation 2010, 200+ entreprises, Membre du Barreau.
4. **Le cabinet** — Présentation en 2-3 phrases.
5. **Galerie** — 4 photos avec lightbox.
6. **Horaires** — Tableau lun-ven, sam-dim fermé. Statut en temps réel.
7. **Adresse** — Adresse + bouton Voir sur Maps + téléphone + email.
8. **Footer CTA** — Rappel WhatsApp + mentions légales.

## Message WhatsApp généré

```
Bonjour Maître, je vous contacte depuis votre page internet. Je souhaiterais avoir des informations concernant vos services. Merci.
```

## DoD (Definition of Done)

- La page s'affiche parfaitement sur un petit téléphone.
- Le bouton WhatsApp ouvre bien la discussion avec le bon numéro et le bon message.
- Une personne extérieure comprend l'activité du cabinet en moins de 30 secondes.
- La page charge en moins de 3 secondes sur un réseau lent.

## Personnaliser pour un autre cabinet

Modifiez uniquement `config.js` :

- `nom`, `slogan`, `ville`, `pays`
- `baseline` (nom de l'avocat)
- `whatsapp`, `telephone`, `tel_href`, `email`
- `adresse` (rue, ville, code_postal, lien_carte)
- `horaires` (jour, ouvre, ferme)
- `services` (id, titre, desc)
- `presentation` (texte de présentation)
- `distinctions` (liste de distinctions)
- `footer_texte`, `legal`
- `textes` (libellés et message WhatsApp)

Aucune modification de `app.js` ou `index.html` n'est nécessaire.

## Déployer (gratuit)

- GitHub Pages : pousser le dossier sur une branche `gh-pages`.
- Netlify : glisser-déposer le dossier.

## Notes

- Zéro bibliothèque externe : HTML/CSS/JS natif uniquement.
- Images WebP, toutes < 93 Ko. Total page < 1 Mo.
- SEO : title, description, JSON-LD LegalService, sitemap, robots.
- Le lien Google Maps utilise `maps.google.com/?q=` (pas d'embed iframe lourd).
- Mentions légales : "Site vitrine — informations non contractuelles, pas de conseil juridique en ligne."

## Limites connues (assumées)

- Pas de paiement, pas de compte, pas de réservation en ligne.
- Les honoraires sont sur devis (pas de prix affichés, conformément à la déontologie).
- Pas de formulaire de contact (tout passe par WhatsApp).
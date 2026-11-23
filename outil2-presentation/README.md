# Cabinet Maître Akoha — Page de présentation

Page vitrine unique, sans serveur ni base de données. Conçue pour être trouvée sur Google et envoyer un message WhatsApp au cabinet.

## Lancer en local

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```
python -m http.server 8080
```

Puis `http://localhost:8080`.

## Informations du cabinet

- **Nom** : Cabinet Maître Akoha
- **Avocat** : Maître Valentin AKOHA — Avocat au Barreau du Bénin depuis 2012
- **Adresse** : Carré 0357, Quartier Akpakpa Suru-Léré, 04 BP 1507 Cadjèhoun, Cotonou, Bénin
- **Tél** : +229 97 44 66 06
- **Email** : valentin.akoha@barreaudubenin.bj
- **Horaires** : Lun-Ven 08h00-18h00, Sam-Dim fermé
- **Distinction** : Avocat-conseil principal de l'association Roi de Paix (aide aux démunis et orphelins). Lauréat des Trophées Pro Bono 2023.

## Structure de la page

1. **Hero** — Nom du cabinet, slogan, 2 boutons (WhatsApp / Appeler).
2. **Expertises** — 8 domaines (Droit civil, Famille, Travail, Affaires, Pénal, Fiscal, Immobilier, International).
3. **L'équipe** — Maître Valentin AKOHA.
4. **Distinctions** — Avocat au Barreau depuis 2012, Roi de Paix, Trophées Pro Bono 2023.
5. **Le cabinet** — Présentation en 2-3 phrases.
6. **Galerie** — 4 photos avec lightbox.
7. **Horaires** — Tableau lun-ven, sam-dim fermé.
8. **Adresse** — Adresse + bouton Itinéraire (Google Maps) + téléphone + email.
9. **Footer CTA** — Rappel WhatsApp + mentions légales.

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
- Images WebP, toutes < 140 Ko. Total page < 1 Mo.
- SEO : title, description, JSON-LD LegalService, sitemap, robots.
- Le lien Google Maps utilise `maps.google.com/?q=` (pas d'embed iframe lourd).
- Mentions légales : "Site vitrine — informations non contractuelles, pas de conseil juridique en ligne."

## Limites connues (assumées)

- Pas de paiement, pas de compte, pas de réservation en ligne.
- Les honoraires sont sur devis (pas de prix affichés, conformément à la déontologie).
- Pas de formulaire de contact (tout passe par WhatsApp).
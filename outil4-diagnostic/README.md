# Assistant IA de diagnostic — LEBIATECH

Chatbot IA qui pose 7 questions à un commerçant et génère un diagnostic en 3 pistes concrètes. Page unique, fonctionne hors-ligne après la première visite.

## Lancer en local

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```
python -m http.server 8080
```

Puis `http://localhost:8080`.

## Comment ça marche

1. L'assistant se présente comme IA et pose 7 questions (activité, équipe, clients, paiements, souci principal, présence web, temps admin).
2. Chaque question propose 3-4 boutons de réponse rapide + zone de texte libre.
3. À la fin, l'IA génère **3 pistes concrètes** classées par priorité, avec ce que le commerçant peut faire seul et où LEBIATECH peut aider.
4. Boutons finaux : Réserver un diagnostic gratuit / Contacter sur WhatsApp / Recommencer.

## Règles respectées

- ✅ Se présente clairement comme assistant IA
- ✅ Ne promet aucun résultat, ne donne aucun prix
- ✅ Ne demande jamais de mot de passe ni d'infos bancaires
- ✅ Réponses courtes, en français simple
- ✅ Limites : max 20 messages par session
- ✅ Données : rien n'est stocké sans accord
- ✅ Fallback : en cas d'erreur, bouton WhatsApp affiché

## Personnaliser

Modifiez uniquement `config.js` :

- `nom`, `slogan`, `whatsapp`, `contact_url`
- `max_messages` (plafond de messages par session)
- `questions` (liste des questions et options)
- `textes` (libellés et messages)

Aucune modification de `app.js` ou `index.html` n'est nécessaire.

## Déployer (gratuit)

- GitHub Pages : pousser le dossier sur une branche `gh-pages`.
- Netlify : glisser-déposer le dossier.

## Notes

- Fonctionne sans serveur ni API (diagnostic rule-based, pas d'appel externe).
- PWA : installable sur l'écran d'accueil, fonctionne hors-ligne.
- Zéro bibliothèque externe : HTML/CSS/JS natif uniquement.
- Test : un cas fictif (cabinet de conseil) se complète en moins de 3 minutes.

## Limites connues (assumées)

- Le diagnostic est rule-based (pas de vrai LLM). Pour un vrai chatbot IA, il faudrait un backend avec API OpenAI/Claude.
- Pas de stockage des résultats (tout reste dans la session).
- Pas de personnalisation avancée (le diagnostic se base sur des règles prédéfinies).
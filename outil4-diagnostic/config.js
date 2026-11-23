window.CONFIG = {
  nom: "LEBIATECH",
  slogan: "Assistant IA de diagnostic",
  whatsapp: "2290162555818",
  contact_url: "https://lebiatech.com/contact",
  max_messages: 20,
  max_questions: 7,

  questions: [
    {
      id: "activite",
      texte: "Bonjour ! Je suis l'assistant IA de LEBIATECH. Je vais vous poser quelques questions pour vous aider à identifier vos priorités. Commençons.\n\nQuelle est votre activité principale ?",
      type: "choix",
      options: [
        { label: "Commerce / Vente", value: "commerce" },
        { label: "Services (coiffure, réparation...)", value: "services" },
        { label: "Artisanat / Production", value: "artisanat" },
        { label: "Autre", value: "autre" }
      ]
    },
    {
      id: "equipe",
      texte: "Combien de personnes travaillent avec vous (y compris vous) ?",
      type: "choix",
      options: [
        { label: "Seul(e)", value: "solo" },
        { label: "2 à 5", value: "petit" },
        { label: "6 à 10", value: "moyen" },
        { label: "Plus de 10", value: "grand" }
      ]
    },
    {
      id: "clients",
      texte: "Comment vos clients vous trouvent-ils principalement ?",
      type: "choix",
      options: [
        { label: "Bouche-à-oreille", value: "bouche" },
        { label: "Réseaux sociaux", value: "reseaux" },
        { label: "Passage / Vitrine", value: "passage" },
        { label: "Autre", value: "autre" }
      ]
    },
    {
      id: "paiements",
      texte: "Comment suivez-vous vos paiements et créances ?",
      type: "choix",
      options: [
        { label: "Cahier / Carnet papier", value: "cahier" },
        { label: "Téléphone (notes, photos)", value: "telephone" },
        { label: "Logiciel / Application", value: "logiciel" },
        { label: "Pas de suivi", value: "aucun" }
      ]
    },
    {
      id: "souci",
      texte: "Quel est votre plus gros souci actuellement ?",
      type: "choix",
      options: [
        { label: "Paiements en retard / créances", value: "creances" },
        { label: "Trouver de nouveaux clients", value: "clients" },
        { label: "Organisation / Temps", value: "orga" },
        { label: "Autre", value: "autre" }
      ]
    },
    {
      id: "web",
      texte: "Avez-vous un site web ou une page en ligne pour votre activité ?",
      type: "choix",
      options: [
        { label: "Oui", value: "oui" },
        { label: "Non", value: "non" },
        { label: "Pas encore", value: "pas_encore" }
      ]
    },
    {
      id: "admin",
      texte: "Combien de temps par semaine passez-vous sur l'administratif (comptes, relances, organisation) ?",
      type: "choix",
      options: [
        { label: "Moins d'1 heure", value: "peu" },
        { label: "1 à 3 heures", value: "moyen" },
        { label: "3 à 5 heures", value: "beaucoup" },
        { label: "Plus de 5 heures", value: "trop" }
      ]
    }
  ],

  textes: {
    titre: "Assistant IA de diagnostic",
    intro: "Je suis un assistant IA. Je vous pose quelques questions pour vous aider à prioriser vos actions. Je ne promets aucun résultat et ne donne aucun prix.",
    placeholder: "Tapez votre réponse...",
    btn_envoyer: "Envoyer",
    btn_recommencer: "Recommencer",
    btn_reserver: "Réserver mon diagnostic gratuit",
    btn_whatsapp: "Contacter sur WhatsApp",
    msg_limite: "Vous avez atteint la limite de messages pour cette session. Pour aller plus loin, réservez un diagnostic gratuit.",
    msg_erreur: "L'assistant rencontre un problème technique. Vous pouvez nous contacter directement sur WhatsApp.",
    msg_fin: "Voici votre diagnostic en 3 pistes, classées par priorité :",
    disclaimer: "Cet assistant est propulsé par une IA. Les recommandations sont données à titre indicatif. Aucune donnée n'est stockée sans votre accord."
  }
};
window.CONFIG = {
  nom: "Camélia Hair",
  slogan: "Coiffure et Tresses — Beauté, élégance et style",
  ville: "Cotonou, Akpakpa Yénawa",
  pays: "Bénin",
  whatsapp: "2290142102739",
  devise: "FCFA",

  jours: [
    { key: "mon", label: "Lundi", ouvert: false },
    { key: "tue", label: "Mardi", ouvert: true },
    { key: "wed", label: "Mercredi", ouvert: true },
    { key: "thu", label: "Jeudi", ouvert: true },
    { key: "fri", label: "Vendredi", ouvert: true },
    { key: "sat", label: "Samedi", ouvert: true },
    { key: "sun", label: "Dimanche", ouvert: true }
  ],

  creneaux: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"],

  services: [
    { id: "boohoo-braids", nom: "Boohoo Braids", prix: 18000, duree_min: 180, image: "assets/boohoo-braids.webp", categorie: "Braids" },
    { id: "coiffure-enfants", nom: "Coiffure Enfants", prix: 6000, duree_min: 60, image: "assets/coiffure-enfants.webp", categorie: "Braids" },
    { id: "french-curl", nom: "French curl", prix: 12000, duree_min: 150, image: "assets/french-curl.webp", categorie: "Braids" },
    { id: "fulani-braids", nom: "Fulani braids", prix: 15000, duree_min: 150, image: "assets/fulani-braids.webp", categorie: "Braids" },
    { id: "fulani-crochet", nom: "Fulani crochet", prix: 13000, duree_min: 120, image: "assets/fulani-crochet.webp", categorie: "Braids" },
    { id: "knotless-braids", nom: "Knotless Braids", prix: 15000, duree_min: 180, image: "assets/knotless-braids.webp", categorie: "Braids" },
    { id: "ponytail", nom: "Ponytail", prix: 12000, duree_min: 90, image: "assets/ponytail.webp", categorie: "Braids" },
    { id: "coiffure-homme", nom: "Coiffure Homme", prix: 5000, duree_min: 45, image: "assets/coiffure-homme.webp", categorie: "Cornrows" },
    { id: "fulani-sans-rajout", nom: "Fulani sans rajout", prix: 10000, duree_min: 90, image: "assets/fulani-sans-rajout.webp", categorie: "Cornrows" },
    { id: "nattes-collees", nom: "Nattes collées", prix: 8000, duree_min: 90, image: "assets/nattes-collees.webp", categorie: "Cornrows" },
    { id: "butterfly-locs", nom: "Butterfly Locs", prix: 15000, duree_min: 180, image: "assets/butterfly-locs.webp", categorie: "Twists" },
    { id: "crochet-braid", nom: "Crochet braid", prix: 8000, duree_min: 90, image: "assets/crochet-braid.webp", categorie: "Twists" },
    { id: "island-twists", nom: "Island Twists", prix: 18000, duree_min: 210, image: "assets/island-twists.webp", categorie: "Twists" },
    { id: "minitwist", nom: "Minitwist", prix: 12000, duree_min: 120, image: "assets/minitwist.webp", categorie: "Twists" },
    { id: "passion-twists", nom: "Passion Twists", prix: 14000, duree_min: 150, image: "assets/passion-twists.webp", categorie: "Twists" },
    { id: "twist", nom: "Twist", prix: 10000, duree_min: 90, image: "assets/twist.webp", categorie: "Twists" }
  ],

  jours_anticipation_max: 30,

  textes: {
    titre: "Réservez votre rendez-vous",
    etape_service: "Quel style ?",
    hint_service: "Touchez une coiffure pour la choisir.",
    etape_date: "Quel jour ?",
    etape_heure: "Quelle heure ?",
    etape_nom: "Votre nom",
    etape_recap: "Vérifiez et envoyez",
    btn_suivant: "Continuer",
    btn_retour: "Retour",
    btn_whatsapp: "Envoyer sur WhatsApp",
    btn_copier: "Copier le message",
    champ_nom_placeholder: "Ex. Awa Koné",
    recap_service: "Style",
    recap_date: "Date",
    recap_heure: "Heure",
    recap_nom: "Nom",
    msg_whatsapp: "Bonjour Camélia Hair, je souhaite réserver {service} le {date} à {heure}. Prix : {prix} {devise}. Nom : {nom}. Merci !",
    msg_ferme: "Le salon est fermé ce jour-là. Choisissez un autre jour.",
    msg_passe: "Cette heure est déjà passée. Choisissez un autre créneau.",
    msg_nom_vide: "Entrez votre nom pour continuer.",
    err_whatsapp: "WhatsApp ne s'ouvre pas ? Copiez le message ci-dessous et envoyez-le au {tel}."
  }
};
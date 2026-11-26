window.CONFIG = {
  nomSalon: "Camélia Hair",
  ville: "Cotonou, Akpakpa Yénawa",
  devise: "FCFA",
  whatsapp: "2290142102739",
  msgRelanceSuffix: "Merci de votre confiance. Camélia Hair.",
  msgRelanceTemplate: "Bonjour {prenom}, j'espère que vous allez bien !\n\nJe me permets de vous rappeler pour {motif}.\nIl reste {reste} {devise} à régler (échéance : {echeance}).\n\nN'hésitez pas à passer au salon pour régler. {suffix}",
  exportNomFichier: "creances-camelia-hair",
  bandeauDonnees: "Vos données restent sur ce téléphone.",

  // Exemples chargés à la première ouverture seulement. echeance et jour sont comptés en jours à partir d'aujourd'hui.
  demo: [
    { nom: "Rachida Bello", motif: "Knotless braids", montant: 25000, echeance: -6, telephone: "2290142102739", paiements: [{ jour: -12, montant: 10000 }] },
    { nom: "Fifamè Houngbo", motif: "Fulani braids + mèches", montant: 18500, echeance: -2, telephone: "2290142102739" },
    { nom: "Sènami Agossou", motif: "Butterfly locs", montant: 22000, echeance: 2, telephone: "2290142102739", paiements: [{ jour: -3, montant: 7000 }] },
    { nom: "Prisca Dossou", motif: "Twist pour sa fille", montant: 7000, echeance: 5, telephone: "2290142102739" },
    { nom: "Mariam Soulé", motif: "Crochet braid", montant: 12000, echeance: 9 },
    { nom: "Nadège Ahouansou", motif: "Passion twists", montant: 15000, echeance: -10, telephone: "2290142102739", paiements: [{ jour: -15, montant: 5000 }, { jour: -8, montant: 10000 }] }
  ]
};
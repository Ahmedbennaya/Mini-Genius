export type FaqItem = { q: string; a: string };

/**
 * Home-page FAQ content. Shared between the visual <FAQ/> component and the
 * FAQPage JSON-LD on the home page so the two never drift apart.
 */
export const HOME_FAQS: FaqItem[] = [
  {
    q: "Les jouets sont-ils sûrs pour les enfants ?",
    a: "Tous nos jouets sont sélectionnés selon des critères stricts : matériaux non toxiques, finitions soignées et âge minimum recommandé clairement indiqué sur chaque fiche produit.",
  },
  {
    q: "Comment choisir un jouet adapté à l'âge de mon enfant ?",
    a: "Utilisez le filtre « par âge » sur la collection. Chaque produit affiche aussi la tranche d'âge recommandée et les compétences qu'il développe (logique, motricité, créativité…).",
  },
  {
    q: "Quels sont les délais de livraison en Tunisie ?",
    a: "Livraison partout en Tunisie en 24 à 72 heures selon la région. Vous recevez un suivi par WhatsApp dès l'expédition.",
  },
  {
    q: "Puis-je payer à la livraison ?",
    a: "Oui — le paiement à la livraison est disponible partout en Tunisie. Vous payez uniquement à la réception, en espèces.",
  },
  {
    q: "Avez-vous des coffrets cadeaux ?",
    a: "Oui, nos coffrets sont prêts à offrir, avec emballage soigné. Idéal pour anniversaire, naissance ou occasion spéciale.",
  },
  {
    q: "Comment vous contacter rapidement ?",
    a: "Nous sommes joignables 7j/7 par WhatsApp. Notre équipe répond habituellement en quelques minutes.",
  },
];

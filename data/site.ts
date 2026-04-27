import type { Palette, ToyShape } from "./products";

export const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Jouets par âge", href: "/collection?age=all" },
  { label: "Montessori", href: "/collection?cat=montessori" },
  { label: "STEM", href: "/collection?cat=stem" },
  { label: "Sensoriel", href: "/collection?cat=sensoriel" },
  { label: "Cadeaux", href: "/collection?cat=cadeaux" },
  { label: "Contact", href: "/contact" },
];

export type CategoryDef = {
  id: "montessori" | "stem" | "sensoriel" | "puzzles" | "construction" | "cadeaux";
  name: string;
  desc: string;
  count: number;
  palette: Palette;
  shape: ToyShape;
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: "montessori",
    name: "Jouets Montessori",
    desc: "Apprendre par l'autonomie et l'expérience.",
    count: 32,
    palette: "mint",
    shape: "ring",
  },
  {
    id: "stem",
    name: "Jouets STEM",
    desc: "Sciences, technologie, ingénierie, maths.",
    count: 18,
    palette: "sky",
    shape: "rocket",
  },
  {
    id: "sensoriel",
    name: "Jouets sensoriels",
    desc: "Éveil des sens et de la motricité.",
    count: 24,
    palette: "coral",
    shape: "board",
  },
  {
    id: "puzzles",
    name: "Puzzles éducatifs",
    desc: "Logique, observation, patience.",
    count: 27,
    palette: "butter",
    shape: "puzzle",
  },
  {
    id: "construction",
    name: "Jeux de construction",
    desc: "Bâtir, imaginer, recommencer.",
    count: 21,
    palette: "lavender",
    shape: "blocks",
  },
  {
    id: "cadeaux",
    name: "Cadeaux enfants",
    desc: "Coffrets prêts à offrir.",
    count: 14,
    palette: "coral",
    shape: "gift",
  },
];

export type AgeDef = {
  id: string;
  label: string;
  desc: string;
  min: number;
  max: number;
  palette: Palette;
  shape: ToyShape;
};

export const AGES: AgeDef[] = [
  { id: "1-2", label: "1–2 ans", desc: "Éveil sensoriel et premiers gestes", min: 1, max: 2, palette: "coral", shape: "ball" },
  { id: "3-5", label: "3–5 ans", desc: "Imagination et apprentissages", min: 3, max: 5, palette: "butter", shape: "cube" },
  { id: "6-8", label: "6–8 ans", desc: "Logique, lecture et créativité", min: 6, max: 8, palette: "sky", shape: "rocket" },
  { id: "9+", label: "9+ ans", desc: "STEM, défis et grands projets", min: 9, max: 99, palette: "mint", shape: "ring" },
];

export const TESTIMONIALS = [
  {
    name: "Yasmine B.",
    city: "Tunis",
    text: "Très belle qualité, mon fils adore les puzzles. La planche sensorielle est devenue son jouet préféré.",
    rating: 5,
    palette: "mint" as Palette,
  },
  {
    name: "Mohamed S.",
    city: "Sfax",
    text: "Livraison rapide et jouets vraiment éducatifs. On voit que c'est sélectionné avec soin.",
    rating: 5,
    palette: "butter" as Palette,
  },
  {
    name: "Amel K.",
    city: "Sousse",
    text: "Parfait pour offrir, le packaging est très joli. Ma nièce était ravie de son coffret cadeau.",
    rating: 5,
    palette: "coral" as Palette,
  },
];

export const TRUST_BADGES = [
  { icon: "truck", title: "Livraison partout en Tunisie", desc: "24–72h selon la région" },
  { icon: "shield", title: "Jouets sélectionnés", desc: "Sûrs, éducatifs, testés" },
  { icon: "wallet", title: "Paiement à la livraison", desc: "Vous payez à réception" },
  { icon: "chat", title: "Support rapide", desc: "WhatsApp 7j/7" },
  { icon: "gift", title: "Idées cadeaux par âge", desc: "Le cadeau parfait, garanti" },
];

export const BENEFITS = [
  { title: "Développe la logique", desc: "Des défis adaptés à chaque âge.", palette: "sky" as Palette },
  { title: "Améliore la concentration", desc: "Le jeu prolongé, sans écran.", palette: "mint" as Palette },
  { title: "Encourage la créativité", desc: "Des matériaux ouverts et inspirants.", palette: "butter" as Palette },
  { title: "Moins d'écrans", desc: "Plus de jeu, plus de présence.", palette: "coral" as Palette },
  { title: "Apprendre par le jeu", desc: "La meilleure façon d'apprendre.", palette: "lavender" as Palette },
];

export const PALETTE_HEX: Record<Palette, { bg: string; deep: string }> = {
  mint: { bg: "#B8E0C9", deep: "#7CC299" },
  sky: { bg: "#A8D0E6", deep: "#6FA8C9" },
  coral: { bg: "#F4A78F", deep: "#E07F62" },
  butter: { bg: "#F5D77A", deep: "#E9BE4A" },
  lavender: { bg: "#D9C8F0", deep: "#A988D8" },
};

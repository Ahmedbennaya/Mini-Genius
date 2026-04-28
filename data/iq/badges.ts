import type { Badge } from "./types";

export const BADGES: Badge[] = [
  {
    id: "first-game",
    title: { fr: "Premier jeu", ar: "أول لعبة", en: "First Game" },
    description: {
      fr: "Bravo, tu as terminé ton premier jeu !",
      ar: "أحسنت! أنهيت أول لعبة لك.",
      en: "Great! You finished your first game.",
    },
    icon: "🎉",
    color: "#F4A78F",
  },
  {
    id: "memory-star",
    title: { fr: "Étoile mémoire", ar: "نجمة الذاكرة", en: "Memory Star" },
    description: {
      fr: "Tu as réussi 5 défis de mémoire.",
      ar: "أنهيت 5 تحديات للذاكرة.",
      en: "You cleared 5 memory challenges.",
    },
    icon: "🌟",
    color: "#D9C8F0",
  },
  {
    id: "math-hero",
    title: { fr: "Héros des maths", ar: "بطل الرياضيات", en: "Math Hero" },
    description: {
      fr: "Tu as gagné 200 points en maths.",
      ar: "حصلت على 200 نقطة في الرياضيات.",
      en: "You earned 200 points in math.",
    },
    icon: "🦸",
    color: "#F5D77A",
  },
  {
    id: "logic-master",
    title: { fr: "Maître de la logique", ar: "سيد المنطق", en: "Logic Master" },
    description: {
      fr: "Tu maîtrises 10 défis de logique.",
      ar: "أتقنت 10 تحديات منطقية.",
      en: "You mastered 10 logic challenges.",
    },
    icon: "🧠",
    color: "#A8D0E6",
  },
  {
    id: "focus-champion",
    title: { fr: "Champion de la concentration", ar: "بطل التركيز", en: "Focus Champion" },
    description: {
      fr: "Tu restes concentré comme un pro.",
      ar: "تحافظ على تركيزك كالمحترفين.",
      en: "You stay focused like a pro.",
    },
    icon: "🎯",
    color: "#6FA8C9",
  },
  {
    id: "pattern-detective",
    title: { fr: "Détective des motifs", ar: "محقق الأنماط", en: "Pattern Detective" },
    description: {
      fr: "Tu trouves les motifs cachés !",
      ar: "تكتشف الأنماط المخفية!",
      en: "You spot hidden patterns!",
    },
    icon: "🔎",
    color: "#B8E0C9",
  },
  {
    id: "creative-builder",
    title: { fr: "Bâtisseur créatif", ar: "بناء مبدع", en: "Creative Builder" },
    description: {
      fr: "Tu transformes les idées en créations.",
      ar: "تحوّل الأفكار إلى إبداعات.",
      en: "You turn ideas into creations.",
    },
    icon: "🎨",
    color: "#F4A78F",
  },
  {
    id: "stem-explorer",
    title: { fr: "Explorateur STEM", ar: "مستكشف العلوم", en: "STEM Explorer" },
    description: {
      fr: "Tu explores la science et la technologie.",
      ar: "تستكشف العلوم والتكنولوجيا.",
      en: "You explore science and technology.",
    },
    icon: "🚀",
    color: "#7CC299",
  },
  {
    id: "seven-day-learner",
    title: { fr: "7 jours d'apprentissage", ar: "متعلم لمدة 7 أيام", en: "7-Day Learner" },
    description: {
      fr: "Tu as joué 7 jours d'affilée. Bravo !",
      ar: "لعبت 7 أيام متتالية. أحسنت!",
      en: "You played 7 days in a row. Great job!",
    },
    icon: "📅",
    color: "#A988D8",
  },
  {
    id: "mini-genius",
    title: { fr: "Badge Mini Génie", ar: "شارة العبقري الصغير", en: "Mini Genius Badge" },
    description: {
      fr: "Le badge ultime des Mini Génies !",
      ar: "الشارة العليا لعباقرة Mini Genius!",
      en: "The ultimate Mini Genius badge!",
    },
    icon: "🏆",
    color: "#E9BE4A",
  },
];

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

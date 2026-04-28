import type { AgeGroup, CategoryId, ColorPalette, Difficulty, Zone } from "./types";

export const CATEGORY_IDS: CategoryId[] = [
  "logic",
  "math",
  "memory",
  "pattern",
  "language",
  "attention",
  "spatial",
  "creativity",
  "problem",
  "stem",
];

export const AGE_GROUPS: AgeGroup[] = ["3-5", "6-8", "9-12", "13+"];

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "genius"];

export const DIFFICULTY_RANK: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  genius: 4,
};

export const CATEGORY_PALETTES: Record<CategoryId, ColorPalette> = {
  logic: { primary: "#A8D0E6", secondary: "#6FA8C9", accent: "#1F2433" },
  math: { primary: "#F5D77A", secondary: "#E9BE4A", accent: "#1F2433" },
  memory: { primary: "#D9C8F0", secondary: "#A988D8", accent: "#1F2433" },
  pattern: { primary: "#B8E0C9", secondary: "#7CC299", accent: "#1F2433" },
  language: { primary: "#F4A78F", secondary: "#E07F62", accent: "#1F2433" },
  attention: { primary: "#A8D0E6", secondary: "#6FA8C9", accent: "#1F2433" },
  spatial: { primary: "#B8E0C9", secondary: "#7CC299", accent: "#1F2433" },
  creativity: { primary: "#F4A78F", secondary: "#E07F62", accent: "#1F2433" },
  problem: { primary: "#D9C8F0", secondary: "#A988D8", accent: "#1F2433" },
  stem: { primary: "#F5D77A", secondary: "#E9BE4A", accent: "#1F2433" },
};

export const CATEGORY_ICON: Record<CategoryId, string> = {
  logic: "🧠",
  math: "🔢",
  memory: "🌟",
  pattern: "🧩",
  language: "📚",
  attention: "🎯",
  spatial: "🪐",
  creativity: "🎨",
  problem: "💡",
  stem: "🚀",
};

export const ZONES: Zone[] = [
  { id: "logic", category: "logic", icon: "🧠", color: CATEGORY_PALETTES.logic, rotation: -3, delay: 0 },
  { id: "math", category: "math", icon: "🔢", color: CATEGORY_PALETTES.math, rotation: 2, delay: 0.05 },
  { id: "memory", category: "memory", icon: "🌟", color: CATEGORY_PALETTES.memory, rotation: -2, delay: 0.1 },
  { id: "language", category: "language", icon: "📚", color: CATEGORY_PALETTES.language, rotation: 3, delay: 0.15 },
  { id: "focus", category: "attention", icon: "🎯", color: CATEGORY_PALETTES.attention, rotation: -1, delay: 0.2 },
  { id: "creativity", category: "creativity", icon: "🎨", color: CATEGORY_PALETTES.creativity, rotation: 4, delay: 0.25 },
  { id: "puzzle", category: "spatial", icon: "🧩", color: CATEGORY_PALETTES.spatial, rotation: -4, delay: 0.3 },
  { id: "pattern", category: "pattern", icon: "🔷", color: CATEGORY_PALETTES.pattern, rotation: 1, delay: 0.35 },
  { id: "stem", category: "stem", icon: "🚀", color: CATEGORY_PALETTES.stem, rotation: -2, delay: 0.4 },
  { id: "challenge", category: "problem", icon: "🏆", color: CATEGORY_PALETTES.problem, rotation: 3, delay: 0.45 },
];

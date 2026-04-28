import type { Locale } from "@/lib/iq/i18n";

export type LocalizedString = Record<Locale, string>;

export type CategoryId =
  | "logic"
  | "math"
  | "memory"
  | "pattern"
  | "language"
  | "attention"
  | "spatial"
  | "creativity"
  | "problem"
  | "stem";

export type AgeGroup = "3-5" | "6-8" | "9-12" | "13+";

export type Difficulty = "easy" | "medium" | "hard" | "genius";

export type SkillId = CategoryId;

export type ZoneId =
  | "logic"
  | "math"
  | "memory"
  | "language"
  | "focus"
  | "creativity"
  | "puzzle"
  | "pattern"
  | "stem"
  | "challenge";

export type GameTemplate =
  | "multipleChoice"
  | "memoryCards"
  | "patternSequence"
  | "dragMatch"
  | "oddOneOut"
  | "mathChallenge"
  | "shapeRecognition"
  | "wordMatching"
  | "sortingGame"
  | "mazeLogic";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Game {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  instructions: LocalizedString;
  category: CategoryId;
  skill: SkillId;
  ageGroup: AgeGroup;
  difficulty: Difficulty;
  durationMinutes: number;
  gameType: GameTemplate;
  thumbnailPrompt: string;
  icon: string;
  colorPalette: ColorPalette;
  points: number;
  recommended: boolean;
  premium: boolean;
}

export type QuestionType =
  | "multipleChoice"
  | "imageChoice"
  | "sequence"
  | "pattern"
  | "math"
  | "logic"
  | "vocabulary"
  | "attention";

export interface QuestionOption {
  id: string;
  label: LocalizedString;
}

export interface TestQuestion {
  id: string;
  category: CategoryId;
  ageGroup: AgeGroup;
  difficulty: Difficulty;
  type: QuestionType;
  question: LocalizedString;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: LocalizedString;
  points: number;
  timeLimitSeconds?: number;
}

export interface Badge {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  color: string;
}

export interface Zone {
  id: ZoneId;
  category: CategoryId;
  icon: string;
  color: ColorPalette;
  rotation: number;
  delay: number;
}

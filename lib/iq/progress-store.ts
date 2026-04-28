"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import type { TestScoreResult } from "@/lib/iq/test-scoring";

export interface RecentGame {
  slug: string;
  title: string;
  score: number;
  maxScore: number;
  category: CategoryId;
  playedAt: string;
}

interface ChildProfile {
  name: string;
  ageGroup: string;
  locale: Locale;
}

interface ProgressState {
  child: ChildProfile;
  recentGames: RecentGame[];
  completedTests: TestScoreResult[];
  skillProgress: Record<CategoryId, number>;
  badges: string[];
  addGameResult: (game: RecentGame) => void;
  saveTestResult: (result: TestScoreResult) => void;
  setChild: (child: Partial<ChildProfile>) => void;
}

const DEFAULT_PROGRESS: Record<CategoryId, number> = {
  logic: 42,
  math: 38,
  memory: 46,
  pattern: 40,
  language: 35,
  attention: 44,
  spatial: 32,
  creativity: 50,
  problem: 37,
  stem: 34,
};

function updateSkillProgress(
  current: Record<CategoryId, number>,
  category: CategoryId,
  value: number,
) {
  return {
    ...current,
    [category]: Math.min(100, Math.max(current[category] ?? 0, value)),
  };
}

export const useIqProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      child: { name: "Mini Genius", ageGroup: "6-8", locale: "fr" },
      recentGames: [],
      completedTests: [],
      skillProgress: DEFAULT_PROGRESS,
      badges: ["first-game", "memory-star", "logic-master"],
      addGameResult: (game) =>
        set((state) => {
          const percentage = game.maxScore ? Math.round((game.score / game.maxScore) * 100) : 0;
          const nextBadges = new Set(state.badges);
          nextBadges.add("first-game");
          if (game.category === "memory" && percentage >= 70) nextBadges.add("memory-star");
          if (game.category === "math" && percentage >= 70) nextBadges.add("math-hero");
          if (game.category === "logic" && percentage >= 70) nextBadges.add("logic-master");
          if (game.category === "attention" && percentage >= 70) nextBadges.add("focus-champion");
          if (game.category === "pattern" && percentage >= 70) nextBadges.add("pattern-detective");
          if (game.category === "creativity" && percentage >= 70) nextBadges.add("creative-builder");
          if (game.category === "stem" && percentage >= 70) nextBadges.add("stem-explorer");

          return {
            recentGames: [game, ...state.recentGames.filter((item) => item.slug !== game.slug)].slice(0, 8),
            skillProgress: updateSkillProgress(state.skillProgress, game.category, percentage),
            badges: Array.from(nextBadges),
          };
        }),
      saveTestResult: (result) =>
        set((state) => {
          const progress = { ...state.skillProgress };
          result.breakdown.forEach((item) => {
            progress[item.category] = Math.max(progress[item.category] ?? 0, item.percentage);
          });
          const nextBadges = new Set(state.badges);
          if (result.percentage >= 75) nextBadges.add("mini-genius");
          return {
            completedTests: [result, ...state.completedTests].slice(0, 5),
            skillProgress: progress,
            badges: Array.from(nextBadges),
          };
        }),
      setChild: (child) =>
        set((state) => ({
          child: { ...state.child, ...child },
        })),
    }),
    { name: "mini-genius-iq-progress" },
  ),
);

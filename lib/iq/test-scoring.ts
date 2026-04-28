import { recommendByWeakSkills } from "@/data/iq/games";
import type { CategoryId, TestQuestion } from "@/data/iq/types";
import { CATEGORY_IDS } from "@/data/iq/constants";
import { t } from "@/lib/iq/i18n";
import type { Locale } from "@/lib/iq/i18n";

export type TestAnswers = Record<string, string>;

export interface SkillScore {
  category: CategoryId;
  correct: number;
  total: number;
  points: number;
  maxPoints: number;
  percentage: number;
}

export interface TestScoreResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  levelLabel: string;
  durationSeconds: number;
  breakdown: SkillScore[];
  strongSkills: CategoryId[];
  weakSkills: CategoryId[];
  recommendedGameSlugs: string[];
}

function levelKey(percentage: number) {
  if (percentage >= 92) return "champion";
  if (percentage >= 78) return "mini";
  if (percentage >= 62) return "logic";
  if (percentage >= 42) return "thinker";
  return "explorer";
}

export function scoreTest(
  questions: TestQuestion[],
  answers: TestAnswers,
  locale: Locale,
  durationSeconds: number,
): TestScoreResult {
  const rows = CATEGORY_IDS.map((category) => {
    const categoryQuestions = questions.filter((question) => question.category === category);
    const total = categoryQuestions.length;
    const maxPoints = categoryQuestions.reduce((sum, question) => sum + question.points, 0);
    const correctQuestions = categoryQuestions.filter(
      (question) => answers[question.id] === question.correctAnswer,
    );
    const points = correctQuestions.reduce((sum, question) => sum + question.points, 0);

    return {
      category,
      correct: correctQuestions.length,
      total,
      points,
      maxPoints,
      percentage: maxPoints ? Math.round((points / maxPoints) * 100) : 0,
    };
  }).filter((row) => row.total > 0);

  const totalScore = rows.reduce((sum, row) => sum + row.points, 0);
  const maxScore = rows.reduce((sum, row) => sum + row.maxPoints, 0);
  const percentage = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;
  const sorted = [...rows].sort((a, b) => b.percentage - a.percentage);
  const strongSkills = sorted.slice(0, 3).map((row) => row.category);
  const weakSkills = [...rows]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)
    .map((row) => row.category);

  return {
    totalScore,
    maxScore,
    percentage,
    levelLabel: t(locale, `results.levels.${levelKey(percentage)}`),
    durationSeconds,
    breakdown: rows,
    strongSkills,
    weakSkills,
    recommendedGameSlugs: recommendByWeakSkills(weakSkills, 6).map((game) => game.slug),
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${mins}:${String(rest).padStart(2, "0")}`;
}

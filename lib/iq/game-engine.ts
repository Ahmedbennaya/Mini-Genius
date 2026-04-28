import type { Game } from "@/data/iq/types";

export interface EngineQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctAnswer: string;
  explanation?: string;
}

export interface EngineState {
  index: number;
  total: number;
  score: number;
  correct: number;
  incorrect: number;
  startedAt: number;
  finished: boolean;
  selectedAnswer?: string;
  feedback?: "correct" | "incorrect";
}

export interface EngineConfig {
  questions: EngineQuestion[];
  pointsPerCorrect?: number;
}

export function createInitialState(config: EngineConfig): EngineState {
  return {
    index: 0,
    total: config.questions.length,
    score: 0,
    correct: 0,
    incorrect: 0,
    startedAt: Date.now(),
    finished: false,
  };
}

export function answerQuestion(
  state: EngineState,
  config: EngineConfig,
  optionId: string,
): EngineState {
  if (state.finished) return state;
  const q = config.questions[state.index];
  if (!q) return state;
  const isCorrect = optionId === q.correctAnswer;
  return {
    ...state,
    selectedAnswer: optionId,
    feedback: isCorrect ? "correct" : "incorrect",
    correct: state.correct + (isCorrect ? 1 : 0),
    incorrect: state.incorrect + (isCorrect ? 0 : 1),
    score: state.score + (isCorrect ? config.pointsPerCorrect ?? 10 : 0),
  };
}

export function nextQuestion(state: EngineState, config: EngineConfig): EngineState {
  if (state.finished) return state;
  const isLast = state.index >= config.questions.length - 1;
  if (isLast) {
    return { ...state, finished: true, selectedAnswer: undefined, feedback: undefined };
  }
  return {
    ...state,
    index: state.index + 1,
    selectedAnswer: undefined,
    feedback: undefined,
  };
}

export function progressPercent(state: EngineState): number {
  if (state.total === 0) return 0;
  return Math.round(((state.index + (state.finished ? 1 : 0)) / state.total) * 100);
}

export function gameTitleFor(game: Game, locale: "fr" | "ar" | "en"): string {
  return game.title[locale] ?? game.title.fr;
}

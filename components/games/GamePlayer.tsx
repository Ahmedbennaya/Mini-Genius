"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Game } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { t } from "@/lib/iq/i18n";
import {
  answerQuestion,
  createInitialState,
  nextQuestion,
  progressPercent,
  type EngineQuestion,
} from "@/lib/iq/game-engine";
import { useIqProgressStore } from "@/lib/iq/progress-store";
import GameResultCard from "@/components/games/GameResultCard";

export default function GamePlayer({
  game,
  locale,
}: {
  game: Game;
  locale: Locale;
}) {
  const questions = useMemo(() => makeGameQuestions(game, locale), [game, locale]);
  const config = useMemo(() => ({ questions, pointsPerCorrect: game.points }), [game.points, questions]);
  const [state, setState] = useState(() => createInitialState(config));
  const addGameResult = useIqProgressStore((store) => store.addGameResult);
  const current = questions[state.index];
  const maxScore = questions.length * game.points;

  function choose(optionId: string) {
    if (state.selectedAnswer) return;
    setState((prev) => answerQuestion(prev, config, optionId));
  }

  function goNext() {
    setState((prev) => {
      const updated = nextQuestion(prev, config);
      if (updated.finished && !prev.finished) {
        addGameResult({
          slug: game.slug,
          title: game.title[locale],
          score: updated.score,
          maxScore,
          category: game.category,
          playedAt: new Date().toISOString(),
        });
      }
      return updated;
    });
  }

  if (state.finished) {
    return (
      <GameResultCard
        game={game}
        locale={locale}
        score={state.score}
        maxScore={maxScore}
        correct={state.correct}
        total={questions.length}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 rounded-[1.5rem] border border-cream-300 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-mute">
              {t(locale, `categories.${game.category}`)}
            </p>
            <h1 className="mt-1 text-2xl">{game.title[locale]}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-ink-soft">
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1">
              <Clock size={15} />
              {game.durationMinutes} {t(locale, "games.minutes")}
            </span>
            <span className="rounded-full bg-butter/70 px-3 py-1">{state.score} pts</span>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-cream-200">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-mint-deep via-sky-deep to-coral-deep"
            style={{ width: `${progressPercent(state)}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-lift sm:p-7"
        >
          <div
            className="rounded-[1.5rem] p-5"
            style={{
              background: `linear-gradient(135deg, ${game.colorPalette.primary}55, #fff 58%, ${game.colorPalette.secondary}40)`,
            }}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white/80 text-3xl shadow-soft">
                {game.icon}
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-soft">
                  {game.gameType}
                </p>
                <h2 className="mt-1 text-2xl leading-tight">{current.prompt}</h2>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => {
              const selected = state.selectedAnswer === option.id;
              const correct = state.selectedAnswer && option.id === current.correctAnswer;
              const wrong = selected && state.feedback === "incorrect";
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  className={[
                    "min-h-16 rounded-[1.25rem] border px-4 py-4 text-left text-base font-extrabold shadow-soft transition",
                    correct
                      ? "border-mint-deep bg-mint/50 text-ink"
                      : wrong
                        ? "border-coral-deep bg-coral/35 text-ink"
                        : "border-cream-300 bg-cream-50 text-ink-soft hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-card",
                  ].join(" ")}
                >
                  <span className="flex items-center justify-between gap-3">
                    {option.label}
                    {correct ? <CheckCircle2 size={18} className="text-mint-deep" /> : null}
                    {wrong ? <XCircle size={18} className="text-coral-deep" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          {state.feedback ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-[1.25rem] bg-cream-100 p-4 text-sm font-semibold text-ink-soft"
            >
              <strong className="text-ink">
                {state.feedback === "correct"
                  ? t(locale, "test.feedbackCorrect")
                  : t(locale, "test.feedbackIncorrect")}
              </strong>{" "}
              {current.explanation}
            </motion.div>
          ) : null}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={goNext}
              disabled={!state.selectedAnswer}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-card transition hover:bg-[#2b3144] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {state.index === questions.length - 1 ? t(locale, "cta.finish") : t(locale, "cta.next")}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function makeGameQuestions(game: Game, locale: Locale): EngineQuestion[] {
  const category = game.title[locale];
  const base = [
    question(
      "q1",
      locale,
      {
        fr: `Quel choix aide a gagner dans ${category} ?`,
        ar: `ما الخيار الذي يساعد على الفوز في ${category}؟`,
        en: `Which choice helps you win ${category}?`,
      },
      [
        ["A", "Observer puis repondre", "لاحظ ثم أجب", "Observe, then answer"],
        ["B", "Cliquer au hasard", "انقر عشوائياً", "Click randomly"],
        ["C", "Fermer les yeux", "أغلق عينيك", "Close your eyes"],
        ["D", "Ignorer les indices", "تجاهل الأدلة", "Ignore clues"],
      ],
      "A",
    ),
  ];

  const templateSets: Record<string, EngineQuestion[]> = {
    mathChallenge: [
      simpleMath("q2", "4 + 5", "9", ["7", "8", "9", "10"]),
      simpleMath("q3", "6 x 3", "18", ["12", "15", "18", "21"]),
      simpleMath("q4", "20 - 6", "14", ["12", "13", "14", "16"]),
      simpleMath("q5", "12 / 3", "4", ["2", "3", "4", "6"]),
    ],
    patternSequence: [
      optionQuestion("q2", "2, 4, 6, 8, ?", ["9", "10", "11", "12"], "10"),
      optionQuestion("q3", "red, blue, red, blue, ?", ["red", "blue", "green", "yellow"], "red"),
      optionQuestion("q4", "A, C, E, G, ?", ["H", "I", "J", "K"], "I"),
      optionQuestion("q5", "1, 2, 4, 8, ?", ["10", "12", "16", "20"], "16"),
    ],
    memoryCards: [
      optionQuestion("q2", "Remember: sun, moon, star. Which was second?", ["sun", "moon", "star", "cloud"], "moon"),
      optionQuestion("q3", "Remember: 7, 2, 9, 4. Which was last?", ["7", "2", "9", "4"], "4"),
      optionQuestion("q4", "Remember: cat, book, bike. Which was missing?", ["cat", "book", "apple", "bike"], "apple"),
      optionQuestion("q5", "Remember: blue, red, green. Which was third?", ["blue", "red", "green", "yellow"], "green"),
    ],
    oddOneOut: [
      optionQuestion("q2", "Dog, cat, car, rabbit", ["dog", "cat", "car", "rabbit"], "car"),
      optionQuestion("q3", "Apple, banana, chair, orange", ["apple", "banana", "chair", "orange"], "chair"),
      optionQuestion("q4", "2, 4, 6, 7", ["2", "4", "6", "7"], "7"),
      optionQuestion("q5", "Circle, square, triangle, spoon", ["circle", "square", "triangle", "spoon"], "spoon"),
    ],
    shapeRecognition: [
      optionQuestion("q2", "Which shape has 3 sides?", ["circle", "triangle", "square", "star"], "triangle"),
      optionQuestion("q3", "Which shape is round?", ["circle", "cube", "square", "line"], "circle"),
      optionQuestion("q4", "Which shape has 4 equal sides?", ["square", "triangle", "oval", "heart"], "square"),
      optionQuestion("q5", "Which shape can roll?", ["cube", "sphere", "pyramid", "book"], "sphere"),
    ],
    wordMatching: [
      optionQuestion("q2", "Which word names an animal?", ["table", "dog", "pen", "door"], "dog"),
      optionQuestion("q3", "Opposite of big", ["small", "fast", "hot", "old"], "small"),
      optionQuestion("q4", "A place to read books", ["library", "kitchen", "garden", "garage"], "library"),
      optionQuestion("q5", "A word that means happy", ["sad", "joyful", "tired", "slow"], "joyful"),
    ],
    sortingGame: [
      optionQuestion("q2", "Correct order", ["1-2-3-4", "4-3-2-1", "1-3-2-4", "2-1-3-4"], "1-2-3-4"),
      optionQuestion("q3", "Small to big", ["cat-elephant-mouse", "mouse-cat-elephant", "elephant-cat-mouse", "cat-mouse-elephant"], "mouse-cat-elephant"),
      optionQuestion("q4", "Morning to night", ["breakfast-lunch-dinner", "dinner-lunch-breakfast", "lunch-breakfast-dinner", "breakfast-dinner-lunch"], "breakfast-lunch-dinner"),
      optionQuestion("q5", "Alphabet order", ["A-B-C", "B-A-C", "C-B-A", "A-C-B"], "A-B-C"),
    ],
    dragMatch: [
      optionQuestion("q2", "Bee matches with...", ["honey", "snow", "book", "moon"], "honey"),
      optionQuestion("q3", "Key matches with...", ["lock", "cloud", "shoe", "star"], "lock"),
      optionQuestion("q4", "Brush matches with...", ["paint", "sand", "rain", "stone"], "paint"),
      optionQuestion("q5", "Fish matches with...", ["water", "sky", "desk", "lamp"], "water"),
    ],
    mazeLogic: [
      optionQuestion("q2", "Best maze move when blocked", ["go back", "stop forever", "jump screen", "close map"], "go back"),
      optionQuestion("q3", "Shortest path usually has", ["fewer turns", "more loops", "no exit", "random steps"], "fewer turns"),
      optionQuestion("q4", "A map helps you", ["plan", "sleep", "hide clues", "lose points"], "plan"),
      optionQuestion("q5", "A dead end means", ["try another path", "you win", "ignore exit", "erase map"], "try another path"),
    ],
    multipleChoice: [
      optionQuestion("q2", "Which is a good learning habit?", ["focus", "rush", "guess", "quit"], "focus"),
      optionQuestion("q3", "What helps solve a puzzle?", ["clues", "noise", "random clicks", "closed eyes"], "clues"),
      optionQuestion("q4", "Which skill does this game train?", ["thinking", "running", "sleeping", "jumping"], "thinking"),
      optionQuestion("q5", "What should you do after a mistake?", ["try again", "give up", "hide", "skip learning"], "try again"),
    ],
  };

  return [...base, ...(templateSets[game.gameType] ?? templateSets.multipleChoice)].map((item, index) => ({
    ...item,
    id: `${game.slug}-${item.id}-${index}`,
  }));
}

function question(
  id: string,
  locale: Locale,
  prompt: Record<Locale, string>,
  options: Array<[string, string, string, string]>,
  correct: string,
): EngineQuestion {
  return {
    id,
    prompt: prompt[locale],
    options: options.map(([optionId, fr, ar, en]) => ({
      id: optionId,
      label: ({ fr, ar, en } as Record<Locale, string>)[locale],
    })),
    correctAnswer: correct,
    explanation: prompt[locale],
  };
}

function optionQuestion(id: string, prompt: string, values: string[], correctValue: string): EngineQuestion {
  const optionIds = ["A", "B", "C", "D"];
  const correctIndex = values.indexOf(correctValue);
  return {
    id,
    prompt,
    options: values.map((value, index) => ({ id: optionIds[index], label: value })),
    correctAnswer: optionIds[correctIndex] ?? "A",
    explanation: correctValue,
  };
}

function simpleMath(id: string, expression: string, correctValue: string, values: string[]): EngineQuestion {
  return optionQuestion(id, `${expression} = ?`, values, correctValue);
}

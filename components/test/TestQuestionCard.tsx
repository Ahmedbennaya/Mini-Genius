"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { TestQuestion } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";
import { scoreTest, type TestAnswers } from "@/lib/iq/test-scoring";
import { useIqProgressStore } from "@/lib/iq/progress-store";
import TestProgress from "@/components/test/TestProgress";

export default function TestQuestionCard({
  locale,
  questions,
}: {
  locale: Locale;
  questions: TestQuestion[];
}) {
  const router = useRouter();
  const saveTestResult = useIqProgressStore((store) => store.saveTestResult);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const current = questions[index];
  const progress = useMemo(() => Object.keys(answers).length + (selected ? 1 : 0), [answers, selected]);

  function choose(optionId: string) {
    if (selected) return;
    setSelected(optionId);
  }

  function next() {
    if (!selected) return;
    const nextAnswers = { ...answers, [current.id]: selected };
    setAnswers(nextAnswers);
    setSelected(null);
    if (index >= questions.length - 1) {
      const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      const result = scoreTest(questions, nextAnswers, locale, durationSeconds);
      saveTestResult(result);
      router.push(localizedPath(locale, "/test/results"));
      return;
    }
    setIndex((value) => value + 1);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <TestProgress locale={locale} current={Math.min(progress, questions.length)} total={questions.length} />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          className="mt-5 rounded-[2rem] border border-white/70 bg-white p-5 shadow-lift sm:p-7"
        >
          <div className="rounded-[1.5rem] bg-gradient-to-br from-cream-100 via-white to-sky/25 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-mute">
              {t(locale, "test.question")} {index + 1} {t(locale, "test.of")} {questions.length}
            </p>
            <h1 className="mt-3 text-2xl leading-tight sm:text-3xl">
              {current.question[locale]}
            </h1>
            <p className="mt-3 text-sm font-bold text-ink-soft">
              {t(locale, `categories.${current.category}`)} - {t(locale, `difficulty.${current.difficulty}`)}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => {
              const isSelected = selected === option.id;
              const isCorrect = selected && option.id === current.correctAnswer;
              const isWrong = isSelected && selected !== current.correctAnswer;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  className={[
                    "min-h-16 rounded-[1.25rem] border px-4 py-4 text-left text-base font-extrabold shadow-soft transition",
                    isCorrect
                      ? "border-mint-deep bg-mint/50 text-ink"
                      : isWrong
                        ? "border-coral-deep bg-coral/35 text-ink"
                        : "border-cream-300 bg-cream-50 text-ink-soft hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-card",
                  ].join(" ")}
                >
                  <span className="flex items-center justify-between gap-3">
                    {option.label[locale]}
                    {isCorrect ? <CheckCircle2 size={18} className="text-mint-deep" /> : null}
                    {isWrong ? <XCircle size={18} className="text-coral-deep" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          {selected ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-[1.25rem] bg-cream-100 p-4 text-sm leading-6 text-ink-soft"
            >
              <strong className="text-ink">{t(locale, "test.explanation")}:</strong>{" "}
              {current.explanation[locale]}
            </motion.div>
          ) : null}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={!selected}
              onClick={next}
              className="rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-card transition hover:bg-[#2b3144] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {index >= questions.length - 1 ? t(locale, "test.finishTest") : t(locale, "test.nextQuestion")}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

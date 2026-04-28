"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { AGE_GROUPS, CATEGORY_IDS, DIFFICULTIES, DIFFICULTY_RANK } from "@/data/iq/constants";
import type { AgeGroup, CategoryId, Difficulty, Game } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { t } from "@/lib/iq/i18n";
import GameCard3D from "@/components/games/GameCard3D";

type SortKey = "recommended" | "newest" | "difficultyAsc" | "difficultyDesc";

export default function GameFilters({
  games,
  locale,
  initialSkill,
}: {
  games: Game[];
  locale: Locale;
  initialSkill?: string;
}) {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState<CategoryId | "all">(
    CATEGORY_IDS.includes(initialSkill as CategoryId) ? (initialSkill as CategoryId) : "all",
  );
  const [age, setAge] = useState<AgeGroup | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [duration, setDuration] = useState<"all" | "short" | "medium" | "long">("all");
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return games
      .filter((game) => {
        const title = `${game.title.fr} ${game.title.ar} ${game.title.en}`.toLowerCase();
        const matchesQuery = !normalizedQuery || title.includes(normalizedQuery);
        const matchesSkill = skill === "all" || game.category === skill;
        const matchesAge = age === "all" || game.ageGroup === age;
        const matchesDifficulty = difficulty === "all" || game.difficulty === difficulty;
        const matchesDuration =
          duration === "all" ||
          (duration === "short" && game.durationMinutes <= 5) ||
          (duration === "medium" && game.durationMinutes > 5 && game.durationMinutes <= 8) ||
          (duration === "long" && game.durationMinutes > 8);

        return matchesQuery && matchesSkill && matchesAge && matchesDifficulty && matchesDuration;
      })
      .sort((a, b) => {
        if (sort === "newest") return b.id.localeCompare(a.id);
        if (sort === "difficultyAsc") return DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
        if (sort === "difficultyDesc") return DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[a.difficulty];
        return Number(b.recommended) - Number(a.recommended);
      });
  }, [age, difficulty, duration, games, query, skill, sort]);

  return (
    <div>
      <div className="rounded-[1.75rem] border border-cream-300 bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.3fr)_repeat(5,minmax(140px,1fr))]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t(locale, "games.searchPlaceholder")}
              className="h-12 w-full rounded-2xl border border-cream-300 bg-cream-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-coral-deep focus:ring-4 focus:ring-coral-deep/15"
            />
          </label>
          <Select label={t(locale, "games.filterSkill")} value={skill} onChange={(value) => setSkill(value as CategoryId | "all")}>
            <option value="all">{t(locale, "games.filterAll")}</option>
            {CATEGORY_IDS.map((item) => (
              <option key={item} value={item}>{t(locale, `categories.${item}`)}</option>
            ))}
          </Select>
          <Select label={t(locale, "games.filterAge")} value={age} onChange={(value) => setAge(value as AgeGroup | "all")}>
            <option value="all">{t(locale, "games.filterAll")}</option>
            {AGE_GROUPS.map((item) => (
              <option key={item} value={item}>{t(locale, `ageGroups.${item}`)}</option>
            ))}
          </Select>
          <Select label={t(locale, "games.filterDifficulty")} value={difficulty} onChange={(value) => setDifficulty(value as Difficulty | "all")}>
            <option value="all">{t(locale, "games.filterAll")}</option>
            {DIFFICULTIES.map((item) => (
              <option key={item} value={item}>{t(locale, `difficulty.${item}`)}</option>
            ))}
          </Select>
          <Select label={t(locale, "games.filterDuration")} value={duration} onChange={(value) => setDuration(value as "all" | "short" | "medium" | "long")}>
            <option value="all">{t(locale, "games.filterAll")}</option>
            <option value="short">0-5</option>
            <option value="medium">6-8</option>
            <option value="long">9+</option>
          </Select>
          <Select label={t(locale, "games.sort")} value={sort} onChange={(value) => setSort(value as SortKey)}>
            <option value="recommended">{t(locale, "games.sortRecommended")}</option>
            <option value="newest">{t(locale, "games.sortNewest")}</option>
            <option value="difficultyAsc">{t(locale, "games.sortDifficultyAsc")}</option>
            <option value="difficultyDesc">{t(locale, "games.sortDifficultyDesc")}</option>
          </Select>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-ink-soft">
        <Filter size={16} />
        {filtered.length} {t(locale, "games.countResults")}
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((game) => (
            <GameCard3D key={game.id} game={game} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.5rem] border border-cream-300 bg-white p-8 text-center font-semibold text-ink-soft shadow-soft">
          {t(locale, "games.noResults")}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-cream-300 bg-cream-50 px-3 text-sm font-bold text-ink-soft outline-none transition focus:border-coral-deep focus:ring-4 focus:ring-coral-deep/15"
      >
        {children}
      </select>
    </label>
  );
}

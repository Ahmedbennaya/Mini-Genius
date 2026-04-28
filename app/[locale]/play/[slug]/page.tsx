import { notFound } from "next/navigation";
import { getGame } from "@/data/iq/games";
import GamePlayer from "@/components/games/GamePlayer";
import BackButton from "@/components/ui/BackButton";
import { isLocale, t } from "@/lib/iq/i18n";

export default function PlayPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const game = getGame(params.slug);
  if (!game) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream-200 py-8">
      <div className="container-mg">
        <BackButton label={t(locale, "cta.backToGames")} />
        <div className="mt-6">
          <GamePlayer game={game} locale={locale} />
        </div>
      </div>
    </div>
  );
}

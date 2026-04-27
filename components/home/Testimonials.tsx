import { Quote } from "lucide-react";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import SectionHeading from "@/components/ui/SectionHeading";
import Stars from "@/components/ui/Stars";
import { TESTIMONIALS, PALETTE_HEX } from "@/data/site";

export default function Testimonials() {
  return (
    <section className="bg-cream-200/80 py-14 sm:py-20 lg:py-24">
      <div className="container-mg">
        <SectionHeading
          eyebrow="Avis de parents"
          title="Ils ont essayé Mini Genius"
          description="Des familles partout en Tunisie nous font confiance pour offrir le meilleur à leurs enfants."
        />

        <StaggerGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => {
            const tint = PALETTE_HEX[t.palette];
            return (
              <StaggerItem
                as="li"
                key={t.name}
                className="card-base relative p-6 transition hover:-translate-y-1 hover:shadow-card lg:p-8"
              >
                <span
                  className="absolute -top-3 left-6 inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-card"
                  style={{ background: tint.deep }}
                >
                  <Quote size={16} />
                </span>
                <Stars value={t.rating} />
                <p className="mt-4 text-[16.5px] leading-relaxed text-ink">“{t.text}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
                    style={{ background: tint.deep }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{t.name}</div>
                    <div className="text-sm text-ink-soft">{t.city}</div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

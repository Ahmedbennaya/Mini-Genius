import { Check } from "lucide-react";
import Parallax from "@/components/motion/Parallax";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { BENEFITS, PALETTE_HEX } from "@/data/site";

export default function BenefitsSection() {
  return (
    <section className="container-mg py-14 sm:py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
        {/* Visual */}
        <div className="relative order-last lg:order-first">
          <Parallax
            distance={24}
            scale
            className="relative mx-auto h-[280px] w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint/60 via-butter/40 to-coral/50 shadow-card sm:h-[360px] lg:h-[420px]"
          >
            <div className="absolute -top-6 left-6 animate-float-a">
              <ToyVisual shape="puzzle" palette="mint" size={130} />
            </div>
            <div className="absolute right-6 top-1/3 animate-float-c">
              <ToyVisual shape="cube" palette="butter" size={110} />
            </div>
            <div className="absolute bottom-4 left-1/4 animate-float-b">
              <ToyVisual shape="rocket" palette="coral" size={120} />
            </div>
            <div className="absolute right-2 bottom-2 animate-float-a">
              <ToyVisual shape="ring" palette="lavender" size={90} />
            </div>
          </Parallax>
        </div>

        {/* Copy + benefits */}
        <div>
          <SectionHeading
            eyebrow="Pourquoi les parents nous adorent"
            title="Des jouets qui font la différence, jour après jour"
            description="Choisis avec rigueur, nos jouets sont conçus pour faire grandir l'enfant — la concentration, la confiance et la curiosité — sans écrans."
          />

          <StaggerGroup as="ul" className="mt-8 space-y-3">
            {BENEFITS.map((b) => {
              const tint = PALETTE_HEX[b.palette];
              return (
                <StaggerItem
                  as="li"
                  key={b.title}
                  className="flex items-start gap-4 rounded-2xl border border-cream-300 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: tint.deep }}
                  >
                    <Check size={18} />
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{b.title}</div>
                    <p className="text-sm text-ink-soft">{b.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}

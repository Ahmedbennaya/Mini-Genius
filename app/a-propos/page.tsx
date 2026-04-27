import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Truck, Smile, Leaf } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Mini Genius accompagne les parents en Tunisie avec des jouets éducatifs sélectionnés avec soin pour soutenir l'apprentissage, la créativité et le développement des enfants.",
};

const VALUES = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Sécurité d'abord",
    desc: "Nous sélectionnons exclusivement des jouets conformes aux normes, sans BPA, sans pièces dangereuses.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Apprendre en jouant",
    desc: "Chaque jouet est choisi pour développer une compétence : motricité, logique, langage, créativité.",
  },
  {
    icon: <Leaf size={20} />,
    title: "Matières nobles",
    desc: "Bois certifié, peintures à l'eau, tissus doux. Le moins de plastique possible, jamais à n'importe quel prix.",
  },
  {
    icon: <Smile size={20} />,
    title: "Pensé pour les familles",
    desc: "Des jouets qui plaisent aux enfants, rassurent les parents et grandissent avec l'enfant.",
  },
  {
    icon: <Truck size={20} />,
    title: "Livraison en Tunisie",
    desc: "Livraison rapide partout en Tunisie, paiement à la livraison disponible.",
  },
  {
    icon: <Heart size={20} />,
    title: "Service attentionné",
    desc: "Une vraie équipe, joignable sur WhatsApp 7j/7 pour vous conseiller le bon jouet.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-mint/45 blur-3xl" />
          <div className="absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-butter/45 blur-3xl" />
        </div>
        <div className="container-mg grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center sm:py-24">
          <div>
            <span className="eyebrow">Notre histoire</span>
            <h1 className="mt-4 font-display text-[clamp(34px,5vw,60px)] leading-[1.05]">
              Aider les enfants tunisiens à grandir, jouer après jouet
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Mini Genius est né d&apos;une conviction simple&nbsp;: le bon jouet, au bon
              moment, change tout. Nous aidons les parents en Tunisie à trouver des jouets
              sûrs, intelligents et éducatifs qui soutiennent l&apos;apprentissage,
              la créativité et le développement de leur enfant.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/collection" className="btn-coral btn-lg">
                Découvrir la collection
              </Link>
              <Link href="/contact" className="btn-ghost btn-lg">
                Nous écrire
              </Link>
            </div>
          </div>

          <div className="relative h-[360px]">
            <div className="absolute left-2 top-2 animate-float-a">
              <ToyVisual shape="puzzle" palette="mint" size={170} />
            </div>
            <div className="absolute right-4 top-12 animate-float-c">
              <ToyVisual shape="rocket" palette="sky" size={150} />
            </div>
            <div className="absolute left-10 bottom-2 animate-float-b">
              <ToyVisual shape="cube" palette="butter" size={140} />
            </div>
            <div className="absolute right-2 bottom-6 animate-float-a">
              <ToyVisual shape="ring" palette="coral" size={130} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cream-200/80 py-20 sm:py-24">
        <div className="container-mg grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <span className="eyebrow">Notre mission</span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Moins d&apos;écrans, plus d&apos;éveil
            </h2>
          </div>
          <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
            <p className="text-[16.5px] leading-relaxed text-ink">
              Nos enfants méritent des jouets qui leur apprennent quelque chose, qui les
              calment, qui les concentrent. Nous testons chaque produit avec des familles
              avant de le proposer — et nous refusons tout ce qui ne nous convaincrait pas
              pour nos propres enfants.
            </p>
            <p className="text-[16.5px] leading-relaxed text-ink">
              Pédagogie Montessori, défis STEM, éveil sensoriel ou simple plaisir de jouer&nbsp;:
              nous sélectionnons des jouets qui développent la logique, la concentration
              et l&apos;imagination, au rythme de l&apos;enfant.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-mg py-20 sm:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow">Nos valeurs</span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Ce qui nous tient à cœur
          </h2>
          <p className="mt-3 text-ink-soft">
            Six engagements concrets, jamais négociables.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <li
              key={v.title}
              className="rounded-3xl border border-cream-300 bg-white p-6 shadow-soft transition hover:shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200 text-coral-deep">
                {v.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-ink-soft">{v.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="container-mg pb-24">
        <div className="rounded-[2rem] bg-gradient-to-br from-mint via-mint/90 to-mint-deep p-10 text-ink shadow-card sm:p-14 lg:p-16">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Prêts à offrir un jouet qui fait grandir&nbsp;?
              </h2>
              <p className="mt-3 max-w-xl text-ink/90">
                Parcourez notre sélection — par âge, par catégorie ou par occasion.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/collection" className="btn bg-ink text-white hover:bg-[#2C3247] btn-lg">
                Voir la collection
              </Link>
              <Link href="/collection?cat=cadeaux" className="btn bg-white text-ink hover:bg-cream-100 btn-lg">
                Coffrets cadeaux
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

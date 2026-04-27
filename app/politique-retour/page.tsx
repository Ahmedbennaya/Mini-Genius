import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Mail, PackageCheck, Phone, RotateCcw, Truck } from "lucide-react";
import { whatsappOrderLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Politique de retour",
  description:
    "Consultez les conditions de retour, d'echange et de remboursement de Mini Genius pour vos commandes de jouets educatifs en Tunisie.",
};

const RETURN_STEPS = [
  {
    icon: <Mail size={18} />,
    title: "1. Contactez-nous",
    text: "Envoyez votre numero de commande, votre nom et une photo du produit si necessaire.",
  },
  {
    icon: <PackageCheck size={18} />,
    title: "2. Nous validons la demande",
    text: "Notre equipe confirme si le produit est eligible a un retour, un echange ou un remboursement.",
  },
  {
    icon: <Truck size={18} />,
    title: "3. Retour ou echange",
    text: "Nous vous indiquons l'adresse ou la methode de retour selon votre ville et votre commande.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <main className="container-mg py-12 sm:py-16">
      <section className="max-w-3xl">
        <span className="eyebrow">Service client</span>
        <h1 className="mt-3 font-display text-[clamp(30px,5vw,54px)] leading-tight">
          Politique de retour
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          Nous voulons que chaque commande Mini Genius arrive en bon etat et corresponde a vos
          attentes. Cette page explique comment demander un retour, un echange ou une assistance
          apres livraison.
        </p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        <PolicyCard icon={<Clock size={20} />} title="Delai de retour">
          Vous pouvez nous contacter dans les 7 jours suivant la reception de votre commande pour
          demander un retour ou un echange.
        </PolicyCard>
        <PolicyCard icon={<RotateCcw size={20} />} title="Etat du produit">
          Le produit doit etre non utilise, complet, propre et retourne avec son emballage d'origine
          lorsque cela est possible.
        </PolicyCard>
        <PolicyCard icon={<CheckCircle2 size={20} />} title="Produit abime">
          Si un article arrive abime ou incorrect, contactez-nous rapidement avec des photos afin que
          nous puissions proposer une solution.
        </PolicyCard>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-cream-300 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Conditions de retour</h2>
          <div className="mt-5 space-y-6 text-ink-soft">
            <TextBlock title="Articles eligibles">
              Les retours sont acceptes pour les articles recus endommages, incorrects, incomplets,
              ou pour les articles non utilises qui respectent le delai indique ci-dessus.
            </TextBlock>
            <TextBlock title="Articles non eligibles">
              Pour des raisons d'hygiene et de securite, nous pouvons refuser un retour si le produit
              a ete utilise, endommage apres livraison, incomplet, ou s'il manque des accessoires
              importants.
            </TextBlock>
            <TextBlock title="Frais de retour">
              Si l'erreur vient de Mini Genius ou si le produit arrive abime, nous prenons en charge
              la solution adaptee. Dans les autres cas, les frais de retour peuvent rester a la charge
              du client.
            </TextBlock>
            <TextBlock title="Remboursement ou echange">
              Apres reception et verification du produit retourne, nous vous proposons un echange,
              un avoir ou un remboursement selon la situation et le mode de paiement utilise.
            </TextBlock>
            <TextBlock title="Annulation de commande">
              Vous pouvez demander l'annulation d'une commande avant son expedition en nous contactant
              le plus rapidement possible.
            </TextBlock>
          </div>
        </div>

        <aside className="self-start rounded-3xl border border-cream-300 bg-cream-200/70 p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Demander un retour</h2>
          <ol className="mt-5 space-y-4">
            {RETURN_STEPS.map((step) => (
              <li key={step.title} className="flex gap-3 rounded-2xl bg-white p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-coral-deep">
                  {step.icon}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{step.title}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-3">
            <a href={whatsappOrderLink()} target="_blank" rel="noopener" className="btn-whatsapp btn-lg">
              <Phone size={18} />
              WhatsApp
            </a>
            <Link href="/contact" className="btn-ghost btn-lg">
              Nous contacter
              <ArrowRight size={18} />
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function PolicyCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-cream-300 bg-white p-6 shadow-soft">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200 text-coral-deep">
        {icon}
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-ink-soft">{children}</p>
    </article>
  );
}

function TextBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 leading-relaxed">{children}</p>
    </section>
  );
}

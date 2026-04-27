import Link from "next/link";
import { Instagram, Facebook, MessageCircle, Truck, Phone, Mail, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import Reveal from "@/components/motion/Reveal";
import { whatsappOrderLink } from "@/lib/utils";

const COLS = [
  {
    title: "Boutique",
    links: [
      { label: "Toute la collection", href: "/collection" },
      { label: "Jouets Montessori", href: "/collection?cat=montessori" },
      { label: "Jouets STEM", href: "/collection?cat=stem" },
      { label: "Jouets sensoriels", href: "/collection?cat=sensoriel" },
      { label: "Coffrets cadeaux", href: "/collection?cat=cadeaux" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Livraison & paiement", href: "/a-propos#livraison" },
      { label: "Politique de retour", href: "/politique-retour" },
      { label: "Conseils par âge", href: "/collection?age=all" },
      { label: "FAQ", href: "/contact#faq" },
    ],
  },
  {
    title: "Mini Genius",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Mentions légales", href: "/a-propos#legal" },
      { label: "Confidentialité", href: "/a-propos#privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-cream-300 bg-gradient-to-b from-cream to-cream-200">
      <div className="container-mg py-16">
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo variant="footer" />
            <p className="mt-4 text-ink-soft leading-relaxed">
              Mini Genius accompagne les parents en Tunisie avec des jouets éducatifs
              choisis avec soin&nbsp;: Montessori, sensoriels, STEM et coffrets cadeaux.
              Apprendre en jouant, en toute confiance.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <SocialLink href="https://instagram.com" label="Instagram">
                <Instagram size={18} />
              </SocialLink>
              <SocialLink href="https://facebook.com" label="Facebook">
                <Facebook size={18} />
              </SocialLink>
              <SocialLink href={whatsappOrderLink()} label="WhatsApp">
                <MessageCircle size={18} />
              </SocialLink>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink hover:text-coral-deep transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-14 grid gap-3 rounded-3xl border border-cream-300 bg-white p-5 sm:grid-cols-3">
          <Mini icon={<Truck size={18} />} title="Livraison en Tunisie" desc="24–72h selon la région" />
          <Mini icon={<ShieldCheck size={18} />} title="Paiement à la livraison" desc="Vous payez à réception" />
          <Mini icon={<Phone size={18} />} title="Support 7j/7" desc="WhatsApp & téléphone" />
        </Reveal>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cream-300 pt-6 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Mini Genius. Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            <Mail size={14} /> bonjour@minigenius.tn · <Phone size={14} /> +216 00 000 000
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cream-300 bg-white text-ink hover:text-coral-deep hover:shadow-soft transition"
    >
      {children}
    </a>
  );
}

function Mini({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl px-3 py-2">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-ink">
        {icon}
      </span>
      <div>
        <div className="font-semibold text-ink">{title}</div>
        <div className="text-sm text-ink-soft">{desc}</div>
      </div>
    </div>
  );
}

import { Truck, ShieldCheck, Wallet, MessageCircle, Gift } from "lucide-react";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { TRUST_BADGES } from "@/data/site";

const ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  wallet: Wallet,
  chat: MessageCircle,
  gift: Gift,
} as const;

export default function TrustBadges() {
  return (
    <section className="border-y border-cream-300 bg-white/60">
      <div className="container-mg py-8">
        <StaggerGroup as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_BADGES.map((b) => {
            const Icon = ICONS[b.icon as keyof typeof ICONS];
            return (
              <StaggerItem
                as="li"
                key={b.title}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-soft"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-coral-deep">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink">{b.title}</div>
                  <div className="truncate text-sm text-ink-soft">{b.desc}</div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

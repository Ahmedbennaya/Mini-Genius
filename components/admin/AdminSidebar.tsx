import Link from "next/link";
import { BrainCircuit, FileJson, Gamepad2, Languages, Layers3, SlidersHorizontal } from "lucide-react";

const IQ_ADMIN_NAV = [
  { href: "/admin#iq-overview", label: "IQ overview", icon: BrainCircuit },
  { href: "/admin#iq-games", label: "Games", icon: Gamepad2 },
  { href: "/admin#iq-questions", label: "Questions", icon: Layers3 },
  { href: "/admin#iq-translations", label: "Translations", icon: Languages },
  { href: "/admin#iq-difficulty", label: "Difficulty", icon: SlidersHorizontal },
  { href: "/admin#iq-export", label: "JSON export", icon: FileJson },
];

export default function AdminSidebar() {
  return (
    <nav className="grid gap-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
      {IQ_ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

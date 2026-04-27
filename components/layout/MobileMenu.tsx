"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, MessageCircle, ShoppingBag, User, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV } from "@/data/site";
import { createMetaEventId, trackMetaEvent } from "@/lib/meta-pixel";
import { whatsappOrderLink } from "@/lib/utils";
import Logo from "./Logo";

type Props = { open: boolean; onClose: () => void };

export default function MobileMenu({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const trackContact = () => {
    trackMetaEvent(
      "Contact",
      { content_name: "mobile-whatsapp" },
      {
        eventId: createMetaEventId("Contact", "mobile-whatsapp"),
        sendToServer: true,
      }
    );
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/collection?q=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm bg-cream lg:hidden flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between px-5 h-[68px] border-b border-cream-300">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cream-200"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-5 pt-5">
              <form onSubmit={submitSearch} className="relative block">
                <span className="sr-only">Rechercher</span>
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un jouet…"
                  className="input pl-11"
                />
              </form>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-medium text-ink hover:bg-white"
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={18} className="text-ink-mute group-hover:translate-x-0.5 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-cream-300 p-5 space-y-3">
              <a
                href={whatsappOrderLink()}
                className="btn-whatsapp w-full"
                target="_blank"
                rel="noopener"
                onClick={trackContact}
              >
                <MessageCircle size={18} />
                Besoin d&apos;aide&nbsp;? WhatsApp
              </a>
              <div className="flex items-center gap-3">
                <Link href="/panier" onClick={onClose} className="btn-ghost flex-1">
                  <ShoppingBag size={16} />
                  Panier
                </Link>
                <Link href="/contact" onClick={onClose} className="btn-ghost flex-1">
                  <User size={16} />
                  Contact
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrainCircuit, Search, User, ShoppingBag, Menu, MessageCircle } from "lucide-react";
import { NAV } from "@/data/site";
import { useCart } from "@/lib/cart-context";
import { createMetaEventId, trackMetaEvent } from "@/lib/meta-pixel";
import { whatsappOrderLink } from "@/lib/utils";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const trackContact = () => {
    trackMetaEvent(
      "Contact",
      { content_name: "header-whatsapp" },
      {
        eventId: createMetaEventId("Contact", "header-whatsapp"),
        sendToServer: true,
      }
    );
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/70 bg-cream/82 shadow-soft backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-cream/0"
        }`}
      >
        <div
          className={`container-mg flex items-center justify-between gap-4 transition-[height] duration-300 ${
            scrolled ? "h-[62px]" : "h-[68px]"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden -ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-cream-200"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.href === "/fr"
                    ? "inline-flex items-center gap-1.5 rounded-full bg-coral/25 px-3.5 py-2 text-[14.5px] font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-coral/40"
                    : "relative inline-flex items-center px-3.5 py-2 text-[14.5px] font-medium text-ink-soft transition-colors hover:text-ink after:absolute after:left-3.5 after:right-3.5 after:bottom-1 after:h-[2px] after:scale-x-0 after:rounded after:bg-coral-deep after:transition-transform hover:after:scale-x-100"
                }
              >
                {item.href === "/fr" ? <BrainCircuit size={15} /> : null}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={whatsappOrderLink()}
              target="_blank"
              rel="noopener"
              onClick={trackContact}
              aria-label="Besoin d'aide ? Contactez-nous sur WhatsApp"
              title="Besoin d'aide ? WhatsApp"
              className="hidden md:inline-flex btn-whatsapp btn-sm hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageCircle size={16} />
              Aide
            </a>

            <IconButton aria-label="Rechercher">
              <Search size={20} />
            </IconButton>
            <IconButton aria-label="Mon compte" className="hidden sm:inline-flex">
              <User size={20} />
            </IconButton>
            <Link
              href="/panier"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:-translate-y-0.5 hover:bg-cream-200"
              aria-label={`Panier (${count})`}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-coral-deep px-1 text-[11px] font-semibold text-white shadow">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function IconButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...rest}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:-translate-y-0.5 hover:bg-cream-200 active:scale-[0.96] ${className}`}
    >
      {children}
    </button>
  );
}

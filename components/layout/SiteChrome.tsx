"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import BackToTop from "@/components/ui/BackToTop";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const isAdmin = currentPath.startsWith("/admin");
  const isIqRoom = /^\/(fr|ar|en)(\/|$)/.test(currentPath);

  if (isAdmin || isIqRoom) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </>
  );
}

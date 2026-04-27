import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import SiteChrome from "@/components/layout/SiteChrome";
import MetaPixel from "@/components/analytics/MetaPixel";
import { getSiteUrl } from "@/lib/site-url";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Mini Genius | Jouets Éducatifs & Montessori en Tunisie",
    template: "%s | Mini Genius",
  },
  description:
    "Découvrez des jouets éducatifs, Montessori, sensoriels et créatifs pour enfants. Livraison partout en Tunisie. Apprendre en jouant avec Mini Genius.",
  keywords: [
    "jouets éducatifs Tunisie",
    "jouets Montessori Tunisie",
    "jouets enfants Tunisie",
    "jeux éducatifs enfants",
    "jouets sensoriels",
    "cadeaux enfants Tunisie",
    "jouets STEM",
    "jeux de construction enfants",
    "jouets bébé éducatifs",
  ],
  openGraph: {
    type: "website",
    locale: "fr_TN",
    title: "Mini Genius | Jouets Éducatifs & Montessori en Tunisie",
    description:
      "Découvrez des jouets éducatifs, Montessori, sensoriels et créatifs pour enfants. Livraison partout en Tunisie. Apprendre en jouant avec Mini Genius.",
    siteName: "Mini Genius",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Mini Genius logo",
      },
    ],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  verification: {
    google: "8vkwXJjdctB5KqQln7cx9PANRqTfxoNmozIR3E8h8to",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <MetaPixel />
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}

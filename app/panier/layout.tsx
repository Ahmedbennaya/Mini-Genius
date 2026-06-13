import type { Metadata } from "next";

// Cart page has no SEO value and should not appear in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return children;
}

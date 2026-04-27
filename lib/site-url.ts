const DEFAULT_SITE_URL = "https://mini-genius-chi.vercel.app";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  return DEFAULT_SITE_URL;
}
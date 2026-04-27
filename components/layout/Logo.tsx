import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Mini Genius — Accueil">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-coral-deep text-white shadow-clay">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path d="M5 12c0-3 3-5 7-5s7 2 7 5-3 5-7 5c-1 0-2 0-3-.3L5 18l1-3c-.6-.9-1-2-1-3z" fill="currentColor"/>
          <circle cx="9.5" cy="12" r="1.2" fill="#1F2433"/>
          <circle cx="14.5" cy="12" r="1.2" fill="#1F2433"/>
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Mini <span className="text-coral-deep">Genius</span>
      </span>
    </Link>
  );
}

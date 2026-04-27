import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";

export default function NotFound() {
  return (
    <div className="container-mg py-20 text-center sm:py-28">
      <div className="mx-auto inline-flex animate-float-a">
        <ToyVisual shape="rocket" palette="coral" size={180} />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">Page introuvable</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        On dirait que cette page s&apos;est envolée. Revenons à l&apos;accueil pour découvrir
        nos jouets.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary btn-lg">
          <Home size={18} />
          Retour à l&apos;accueil
        </Link>
        <Link href="/collection" className="btn-ghost btn-lg">
          Voir la collection
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

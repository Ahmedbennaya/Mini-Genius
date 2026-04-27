"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { ArrowRight, Brain, Gift, MapPin, Sparkles, Star } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";
import { allProducts, getPrimaryProductImage, type Palette, type ToyShape } from "@/data/products";

const HERO_VIDEO = "/videos/mini-genius-hero.mp4";
const HERO_POSTER = "/images/hero-poster.jpg";

type HeroProduct = {
  label: string;
  image?: string;
  shape: ToyShape;
  palette: Palette;
  category: string;
};

export default function PremiumHero3D() {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 120, damping: 20, mass: 0.35 });
  const rotateY = useSpring(rotateYValue, { stiffness: 120, damping: 20, mass: 0.35 });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 46]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.72]);

  const products = useMemo(() => {
    const puzzle = allProducts.find((product) => product.id === "puzzle-bois");
    const blocks = allProducts.find((product) => product.id === "blocs-magnetiques");
    const alphabet = allProducts.find((product) => product.id === "cubes-alphabet");

    return [
      {
        label: puzzle?.name || "Puzzle Montessori en Bois",
        image: puzzle ? getPrimaryProductImage(puzzle) : undefined,
        shape: "puzzle",
        palette: "mint",
        category: "Montessori",
      },
      {
        label: blocks?.name || "Blocs Magnetiques Creatifs",
        image: blocks ? getPrimaryProductImage(blocks) : undefined,
        shape: "blocks",
        palette: "sky",
        category: "STEM",
      },
      {
        label: alphabet?.name || "Cubes Alphabet Francais",
        image: alphabet ? getPrimaryProductImage(alphabet) : undefined,
        shape: "cube",
        palette: "butter",
        category: "Alphabet",
      },
    ] satisfies HeroProduct[];
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateYValue.set(x * 14);
    rotateXValue.set(y * -12);
  }

  function resetPointer() {
    rotateXValue.set(0);
    rotateYValue.set(0);
  }

  const stackStyle: MotionStyle = shouldReduceMotion ? {} : { rotateX, rotateY };
  const visualScrollStyle: MotionStyle = shouldReduceMotion
    ? {}
    : { y: visualY, scale: visualScale, opacity: visualOpacity };

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#fffaf3_0%,#fbf6ee_52%,#edf7f2_100%)] py-10 sm:py-16 lg:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(31,36,51,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(31,36,51,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(244,167,143,.18),transparent_34%,rgba(168,208,230,.18)_66%,transparent)]" />
      </div>

      <div className="container-mg grid gap-8 sm:gap-10 lg:min-h-[calc(100svh-88px)] lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,1.08fr)] lg:items-center">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-soft shadow-soft backdrop-blur-md"
          >
            <Sparkles size={14} className="text-coral-deep" />
            Nouvelle collection Montessori
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 max-w-[780px] font-display text-[clamp(30px,7vw,76px)] leading-[1.04] tracking-tight text-ink sm:mt-5 sm:leading-[0.98]"
          >
            Des jouets éducatifs qui développent l&apos;intelligence de votre enfant
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed text-ink-soft sm:mt-5 sm:text-[17px]"
          >
            Découvrez une sélection de jouets Montessori, sensoriels et créatifs
            pour apprendre en jouant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link href="/collection" className="btn-coral btn-lg w-full justify-center sm:w-auto">
              Découvrir la collection
              <ArrowRight size={18} />
            </Link>
            <Link href="/collection?age=all" className="btn-ghost btn-lg w-full justify-center sm:w-auto">
              Choisir par âge
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center gap-2 sm:mt-10 sm:gap-3"
          >
            <GlassBadge icon={<Brain size={15} />} label="Apprendre en jouant" />
            <GlassBadge icon={<Gift size={15} />} label="+750 jouets éducatifs" />
            <GlassBadge icon={<MapPin size={15} />} label="Livraison en Tunisie" />
          </motion.div>
        </div>

        <motion.div
          style={visualScrollStyle}
          className="relative mx-auto h-[360px] w-full max-w-[620px] overflow-visible sm:h-[560px] lg:h-[620px] lg:max-w-none"
        >
          <HeroCardStack
            style={stackStyle}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
          >
            <div aria-hidden className="absolute bottom-10 left-1/2 h-12 w-[62%] -translate-x-1/2 rounded-full bg-ink/12 blur-2xl" />
            <motion.div
              className="absolute left-1/2 top-[43%] z-30 w-[82%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 sm:w-[74%]"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -14, 0], rotateZ: [-1.4, 1.2, -1.4] }
              }
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <HeroCard3D
                type="video"
                label="Vidéo 3D de jouets éducatifs Mini Genius"
                shape="rocket"
                palette="sky"
                className="hero-card-glow"
              />
            </motion.div>

            <StackedCard
              className="left-[2%] top-[16%] z-20 w-[40%] max-w-[250px] [transform:translateZ(-80px)_rotateY(16deg)_rotateZ(-10deg)] sm:left-[5%]"
              delay="-2.2s"
            >
              <HeroCard3D type="image" product={products[0]} flip />
            </StackedCard>

            <StackedCard
              className="right-[0%] top-[12%] z-10 w-[37%] max-w-[230px] [transform:translateZ(-150px)_rotateY(-18deg)_rotateZ(9deg)] sm:right-[4%]"
              delay="-5.4s"
            >
              <HeroCard3D type="image" product={products[1]} flip />
            </StackedCard>

            <StackedCard
              className="bottom-[10%] left-[10%] z-20 w-[34%] max-w-[210px] [transform:translateZ(-40px)_rotateX(6deg)_rotateY(14deg)_rotateZ(7deg)] sm:left-[14%]"
              delay="-3.5s"
            >
              <HeroCard3D type="image" product={products[2]} />
            </StackedCard>

            <div className="absolute bottom-[18%] right-[7%] z-40 hidden sm:block">
              <GlassBadge icon={<Star size={15} fill="currentColor" strokeWidth={0} />} label="4,9/5 parents" />
            </div>

            <FloatingToyShape kind="cube" className="left-[9%] top-[8%] hidden sm:block" delay="-1s" />
            <FloatingToyShape kind="star" className="right-[13%] top-[5%] hidden sm:block" delay="-4s" />
            <FloatingToyShape kind="ring" className="bottom-[18%] right-[2%] hidden sm:block" delay="-6s" />
            <FloatingToyShape kind="sphere" className="bottom-[7%] left-[40%] hidden sm:block" delay="-2.8s" />
            <FloatingToyShape kind="block" className="left-[1%] bottom-[36%] hidden sm:block" delay="-7s" />
            </HeroCardStack>
        </motion.div>
      </div>
    </section>
  );
}

function HeroCardStack({
  children,
  style,
  onPointerMove,
  onPointerLeave,
}: {
  children: React.ReactNode;
  style: MotionStyle;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
}) {
  return (
    <motion.div
      aria-label="Présentation 3D de jouets éducatifs Mini Genius"
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="perspective-hero preserve-3d relative h-full w-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function StackedCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className="animate-hero-card-float preserve-3d" style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

function HeroCard3D({
  type,
  label,
  product,
  shape,
  palette,
  flip = false,
  className = "",
}: {
  type: "video" | "image";
  label?: string;
  product?: HeroProduct;
  shape?: ToyShape;
  palette?: Palette;
  flip?: boolean;
  className?: string;
}) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const fallbackShape = product?.shape || shape || "puzzle";
  const fallbackPalette = product?.palette || palette || "mint";
  const mediaLabel = label || product?.label || "Jouet éducatif Mini Genius";

  return (
    <div className={`preserve-3d relative w-full ${type === "video" ? "aspect-video" : "aspect-[4/5]"} ${flip ? "animate-hero-card-flip" : ""}`}>
      <div className={`backface-hidden absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 shadow-lift backdrop-blur-xl ${className}`}>
        {type === "video" && !mediaFailed ? (
          <video
            aria-label="Vidéo 3D de jouets éducatifs Mini Genius"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setMediaFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : product?.image && !mediaFailed ? (
          <Image
            src={product.image}
            alt={mediaLabel}
            fill
            sizes="(max-width: 768px) 45vw, 260px"
            className="object-cover"
            onError={() => setMediaFailed(true)}
          />
        ) : (
          <ToyFallback shape={fallbackShape} palette={fallbackPalette} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-white/18" />
        <ShineOverlay />
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/72 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft shadow-soft backdrop-blur">
          {type === "video" ? "Mini Genius" : product?.category}
        </span>
      </div>

      {flip ? (
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_30%_20%,rgba(245,215,122,.72),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.88),rgba(184,224,201,.68))] p-5 shadow-lift [transform:rotateY(180deg)]">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(31,36,51,.12)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <ToyVisual shape={fallbackShape} palette={fallbackPalette} size={104} />
            <span className="mt-3 rounded-full bg-white/72 px-3 py-1 text-xs font-bold text-ink-soft shadow-soft">
              {product?.category || "Jeu éducatif"}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToyFallback({ shape, palette }: { shape: ToyShape; palette: Palette }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#fffaf3,#f5eddf)]">
      <ToyVisual shape={shape} palette={palette} size={160} />
    </div>
  );
}

function GlassBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/62 px-3.5 py-2 text-sm font-bold text-ink shadow-soft backdrop-blur-md">
      <span className="text-coral-deep">{icon}</span>
      {label}
    </span>
  );
}

function ShineOverlay() {
  return <span aria-hidden className="shine-overlay" />;
}

function FloatingToyShape({
  kind,
  className,
  delay,
}: {
  kind: "cube" | "star" | "ring" | "sphere" | "block";
  className: string;
  delay: string;
}) {
  const shapeClass =
    kind === "cube"
      ? "h-10 w-10 rounded-xl bg-butter/70 rotate-12"
      : kind === "star"
        ? "h-10 w-10 bg-coral/70 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
        : kind === "ring"
          ? "h-12 w-12 rounded-full border-[10px] border-mint/70"
          : kind === "sphere"
            ? "h-9 w-9 rounded-full bg-sky/70"
            : "h-9 w-12 rounded-xl bg-lavender/70";

  return (
    <span
      aria-hidden
      className={`floating-toy-shape absolute ${className} ${shapeClass}`}
      style={{ animationDelay: delay }}
    />
  );
}

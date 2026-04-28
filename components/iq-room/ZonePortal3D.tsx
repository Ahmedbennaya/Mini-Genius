"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Zone } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";

export default function ZonePortal3D({
  zone,
  locale,
}: {
  zone: Zone;
  locale: Locale;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay: zone.delay, duration: 0.5 }}
      whileHover={{ y: -8, rotateX: 4, rotateY: zone.rotation, scale: 1.02 }}
      className="perspective-hero"
    >
      <Link
        href={`${localizedPath(locale, "/games")}?skill=${zone.category}`}
        className="group block min-h-[190px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-card transition"
        style={{
          background: `linear-gradient(145deg, ${zone.color.primary}55, #ffffff 54%, ${zone.color.secondary}35)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-clay transition group-hover:scale-105"
            style={{ backgroundColor: zone.color.primary }}
          >
            {zone.icon}
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-ink-soft shadow-soft">
            3D
          </span>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-ink">
          {t(locale, `zones.${zone.id}`)}
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          {t(locale, `categories.${zone.category}`)}
        </p>
        <div className="mt-5 h-2 rounded-full bg-white/70">
          <div
            className="h-2 rounded-full"
            style={{ width: "72%", backgroundColor: zone.color.secondary }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

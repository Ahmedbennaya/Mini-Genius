"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
  };

  return (
    <section className="container-mg py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-cream-300 bg-white p-8 shadow-card sm:p-12 text-center"
      >
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-mint/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-coral/35 blur-3xl" />

        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-200 text-coral-deep">
          <Mail size={22} />
        </span>
        <h2 className="relative mt-5 font-display text-[clamp(26px,3.4vw,40px)] leading-tight">
          Recevez nos nouveautés et idées cadeaux
        </h2>
        <p className="relative mt-3 text-ink-soft">
          Une newsletter douce et utile, environ une fois par mois. Pas de spam.
        </p>

        <form
          onSubmit={submit}
          className="relative mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">Email</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Votre adresse email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn-coral btn-lg sm:px-6">
            {done ? <Check size={18} /> : <Send size={18} />}
            {done ? "Merci !" : "S'inscrire"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { createMetaEventId, trackMetaEvent } from "@/lib/meta-pixel";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
  whatsappOrderLink,
} from "@/lib/utils";

export default function ContactPage() {
  const [done, setDone] = useState(false);

  const trackContact = (method: string) => {
    trackMetaEvent(
      "Contact",
      { content_name: method },
      {
        eventId: createMetaEventId("Contact", method),
        sendToServer: true,
      }
    );
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackContact("contact-form");
    setDone(true);
  };

  return (
    <div className="container-mg py-12 sm:py-16">
      <Reveal as="header" className="max-w-2xl">
        <span className="eyebrow">Contact</span>
        <h1 className="mt-3 font-display text-[clamp(30px,5vw,52px)] leading-[1.05]">
          On vous répond avec plaisir
        </h1>
        <p className="mt-3 text-ink-soft">
          Une question, un conseil cadeau, une commande&nbsp;? Notre équipe est joignable
          sur WhatsApp 7j/7 et par email.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.22 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-cream-300 bg-white p-6 shadow-card sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold">Envoyer un message</h2>
          <p className="mt-1 text-ink-soft">Réponse sous 24h en moyenne.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" name="name" required />
            <Field label="Téléphone" name="phone" type="tel" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required />
            <Field label="Sujet" name="subject" required />
          </div>
          <div className="mt-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-soft">Message</span>
              <textarea
                name="message"
                required
                placeholder="Comment pouvons-nous vous aider ?"
                className="input"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="btn-primary btn-lg sm:flex-1">
              {done ? <Check size={18} /> : <Send size={18} />}
              {done ? "Message envoyé" : "Envoyer le message"}
            </button>
            <a
              href={whatsappOrderLink()}
              target="_blank"
              rel="noopener"
              onClick={() => trackContact("whatsapp-contact-page")}
              className="btn-whatsapp btn-lg sm:flex-1"
            >
              <MessageCircle size={18} />
              WhatsApp direct
            </a>
          </div>
          <p className="mt-3 text-xs text-ink-mute">
            En envoyant ce formulaire, vous acceptez d&apos;être contacté(e) par Mini Genius.
          </p>
        </motion.form>

        <StaggerGroup className="space-y-4">
          <StaggerItem>
            <ContactCard
              icon={<MessageCircle size={20} />}
              title="WhatsApp"
              value={SUPPORT_PHONE_DISPLAY}
              href={whatsappOrderLink()}
              cta="Discuter sur WhatsApp"
              onClick={() => trackContact("whatsapp-card")}
            />
          </StaggerItem>
          <StaggerItem>
            <ContactCard
              icon={<Phone size={20} />}
              title="Téléphone"
              value={SUPPORT_PHONE_DISPLAY}
              href={`tel:${SUPPORT_PHONE_TEL}`}
              cta="Appeler"
              onClick={() => trackContact("phone-card")}
            />
          </StaggerItem>
          <StaggerItem>
            <ContactCard
              icon={<Mail size={20} />}
              title="Email"
              value="bonjour@minigenius.tn"
              href="mailto:bonjour@minigenius.tn"
              onClick={() => trackContact("email-card")}
              cta="Écrire un email"
            />
          </StaggerItem>

          <StaggerItem className="rounded-3xl border border-cream-300 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cream-200 text-coral-deep">
                <MapPin size={18} />
              </span>
              <h3 className="font-display text-lg font-semibold">Réseaux sociaux</h3>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream-300 transition hover:text-coral-deep hover:shadow-soft"
              >
                <Instagram size={18} />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream-300 transition hover:text-coral-deep hover:shadow-soft"
              >
                <Facebook size={18} />
              </a>
            </div>
          </StaggerItem>

          <StaggerItem className="rounded-3xl border border-cream-300 bg-cream-200/60 p-6">
            <h3 className="font-display text-lg font-semibold">Livraison & paiement</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-ink">
              <li className="flex items-center gap-2">
                <Truck size={15} className="text-coral-deep" />
                Livraison partout en Tunisie (24-72h)
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-coral-deep" />
                Paiement à la livraison disponible
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={15} className="text-coral-deep" />
                Suivi de commande sur WhatsApp
              </li>
            </ul>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-soft">
        {label}
        {required && <span className="text-coral-deep"> *</span>}
      </span>
      <input type={type} name={name} required={required} className="input" />
    </label>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
  cta,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
  cta: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener"
      onClick={onClick}
      className="group flex items-center justify-between gap-4 rounded-3xl border border-cream-300 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200 text-coral-deep">
          {icon}
        </span>
        <div>
          <div className="text-sm text-ink-soft">{title}</div>
          <div className="font-semibold">{value}</div>
        </div>
      </div>
      <span className="hidden text-sm font-semibold text-coral-deep transition group-hover:translate-x-1 sm:block">
        {cta} →
      </span>
    </a>
  );
}

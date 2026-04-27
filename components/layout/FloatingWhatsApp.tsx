"use client";

import { MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createMetaEventId, trackMetaEvent } from "@/lib/meta-pixel";
import { whatsappOrderLink } from "@/lib/utils";

export default function FloatingWhatsApp() {
  const trackContact = () => {
    trackMetaEvent(
      "Contact",
      { content_name: "floating-whatsapp" },
      {
        eventId: createMetaEventId("Contact", "floating-whatsapp"),
        sendToServer: true,
      }
    );
  };

  return (
    <motion.a
      href={whatsappOrderLink()}
      target="_blank"
      rel="noopener"
      onClick={trackContact}
      aria-label="Besoin d'aide ? Contactez-nous sur WhatsApp"
      title="Besoin d'aide ? Contactez-nous sur WhatsApp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-whatsapp sm:px-5 sm:py-3.5"
    >
      <span className="relative inline-flex">
        <span className="absolute inset-0 -m-1 rounded-full bg-[#25D366] opacity-50 animate-ping" />
        <MessageCircle size={20} className="relative" />
      </span>
      <span className="hidden sm:inline-flex sm:items-center sm:gap-1.5">
        <HelpCircle size={14} className="opacity-80" />
        Besoin d&apos;aide&nbsp;?
      </span>
    </motion.a>
  );
}

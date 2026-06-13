"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

/**
 * Site-wide automatic event tracking via event delegation — no need to edit
 * individual buttons/links and zero design impact. Captures:
 *   click_cta, click_menu_link, click_footer_link, click_phone_number,
 *   click_whatsapp, click_email, click_social_link, click_product,
 *   outbound_link_click, scroll_depth (25/50/75/90), form_start, form_submit.
 *
 * Privacy: only element metadata is captured (text label, href, form name and
 * field count). No form field VALUES are ever read or sent.
 */

const SOCIAL_HOSTS: Array<[RegExp, string]> = [
  [/instagram\./, "instagram"],
  [/(facebook|fb)\./, "facebook"],
  [/tiktok\./, "tiktok"],
  [/(youtube|youtu)\./, "youtube"],
  [/(twitter|x)\.com/, "twitter"],
  [/linkedin\./, "linkedin"],
];

function label(el: Element): string {
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  const aria = el.getAttribute("aria-label") || el.getAttribute("title") || "";
  return (text || aria).slice(0, 80);
}

export default function AutoEvents() {
  useEffect(() => {
    /* ----------------------------- clicks ----------------------------- */
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const el = target?.closest("a, button") as HTMLElement | null;
      if (!el) return;

      const anchor = el.closest("a") as HTMLAnchorElement | null;
      const href = anchor?.getAttribute("href") || "";
      const text = label(el);

      // tel / mailto / whatsapp ------------------------------------------
      if (href.startsWith("tel:")) {
        track("click_phone_number", { link_text: text });
        return;
      }
      if (href.startsWith("mailto:")) {
        track("click_email", { link_text: text });
        return;
      }
      if (/wa\.me|whatsapp|api\.whatsapp/i.test(href)) {
        track("click_whatsapp", { link_text: text, location: el.closest("header") ? "header" : el.closest("footer") ? "footer" : "page" });
        return;
      }

      // external links ----------------------------------------------------
      if (/^https?:\/\//i.test(href)) {
        let host = "";
        try {
          host = new URL(href).hostname.replace(/^www\./, "");
        } catch {
          host = "";
        }
        const sameOrigin = host === window.location.hostname.replace(/^www\./, "");
        if (!sameOrigin && host) {
          const social = SOCIAL_HOSTS.find(([re]) => re.test(host));
          if (social) {
            track("click_social_link", { network: social[1], link_url: href });
          } else {
            track("outbound_link_click", { link_url: href, link_domain: host, link_text: text });
          }
          return;
        }
      }

      // internal product card --------------------------------------------
      if (href.startsWith("/produit/")) {
        track("click_product", { slug: href.replace("/produit/", "").split("?")[0], link_text: text });
        return;
      }

      // header / footer navigation ---------------------------------------
      if (anchor && href.startsWith("/")) {
        if (el.closest("header")) {
          track("click_menu_link", { link_text: text, link_url: href });
          return;
        }
        if (el.closest("footer")) {
          track("click_footer_link", { link_text: text, link_url: href });
          return;
        }
      }

      // primary CTA buttons (coral / primary styles) ----------------------
      const cls = el.className?.toString?.() || "";
      if (/btn-(primary|coral)/.test(cls)) {
        track("click_cta", { cta_text: text, cta_href: href || undefined });
      }
    };

    /* -------------------------- scroll depth -------------------------- */
    const milestones = [25, 50, 75, 90];
    const fired = new Set<number>();
    let ticking = false;
    const computeDepth = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track("scroll_depth", { percent: m });
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(computeDepth);
    };

    /* ----------------------------- forms ------------------------------ */
    const startedForms = new WeakSet<HTMLFormElement>();
    const formName = (form: HTMLFormElement) =>
      form.getAttribute("name") || form.getAttribute("id") || form.getAttribute("data-form") || "form";

    const onFocusIn = (event: FocusEvent) => {
      const field = event.target as HTMLElement | null;
      if (!field || !/^(input|textarea|select)$/i.test(field.tagName)) return;
      // skip non-data inputs
      const type = (field as HTMLInputElement).type;
      if (type === "submit" || type === "button" || type === "hidden") return;
      const form = field.closest("form") as HTMLFormElement | null;
      if (!form || startedForms.has(form)) return;
      startedForms.add(form);
      track("form_start", { form_name: formName(form) });
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.tagName !== "FORM") return;
      const fields = form.querySelectorAll("input, textarea, select").length;
      track("form_submit", { form_name: formName(form), field_count: fields });
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("submit", onSubmit, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}

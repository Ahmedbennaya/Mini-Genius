# Mini Genius

A premium, conversion-focused **Next.js 14** e-commerce site for **Mini Genius**, a Tunisian educational toys brand (Montessori, STEM, sensory, puzzles, construction, gift boxes).

Built with **Next.js · React · TypeScript · Tailwind CSS · Framer Motion · Lucide React**.

> ⚠️ The legacy static project at the project root (`index.html`, `app.jsx`, `data.jsx`, `home.jsx`, `pages.jsx`, `primitives.jsx`, `shell.jsx`, `tweaks-panel.jsx`, `styles.css`) is preserved untouched. The Next.js project lives alongside in `app/`, `components/`, `data/`, `lib/`, and the standard config files. Once you no longer need the legacy version, those files can be deleted safely.

---

## Run the project

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → http://localhost:3000

# 3. Production build
npm run build
npm run start
```

Node 18.18+ recommended.

---

## Routes

| Route                       | Description                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `/`                         | Homepage — hero, trust badges, age categories, categories, featured products, benefits, gift box, testimonials, newsletter |
| `/collection`               | Filterable product grid with sort, age filter, category filter, price max, search                 |
| `/produit/[slug]`           | Product detail — gallery, price, benefits, develops, material, safety, delivery, related          |
| `/panier`                   | Cart — line items, quantity, subtotal, WhatsApp + checkout, recommendations                       |
| `/a-propos`                 | Brand story, mission, values                                                                      |
| `/contact`                  | Contact form, WhatsApp, phone, email, social, delivery info                                       |

---

## Project structure

```
app/
  layout.tsx                root layout, fonts, metadata, Header/Footer/FloatingWhatsApp
  globals.css               Tailwind base + component classes (.btn-*, .pill, .input, .card-base)
  page.tsx                  Homepage
  not-found.tsx             404 page
  collection/page.tsx
  produit/[slug]/page.tsx
  panier/page.tsx
  a-propos/page.tsx
  contact/page.tsx

components/
  layout/
    Logo.tsx
    Header.tsx
    MobileMenu.tsx
    Footer.tsx
    FloatingWhatsApp.tsx
  home/
    Hero.tsx
    TrustBadges.tsx
    AgeCategories.tsx
    CategoryCards.tsx
    FeaturedProducts.tsx
    BenefitsSection.tsx
    GiftBoxSection.tsx
    Testimonials.tsx
    Newsletter.tsx
  product/
    ProductCard.tsx
    ProductGrid.tsx
    ProductGallery.tsx
    QuantitySelector.tsx
    AddToCartActions.tsx
    FilterSidebar.tsx
  cart/
    CartItem.tsx
  ui/
    ToyVisual.tsx           SVG-based "3D-style" toy renderer (10 shapes × 5 palettes)
    SectionHeading.tsx
    Stars.tsx

data/
  products.ts               Typed product mock-DB (8 products with full detail)
  site.ts                   NAV, CATEGORIES, AGES, TESTIMONIALS, TRUST_BADGES, BENEFITS

lib/
  cart-context.tsx          React Context cart with localStorage persistence
  utils.ts                  cn(), formatTND(), whatsappOrderLink(), WHATSAPP_NUMBER
```

---

## Design system

- **Background**: cream `#FBF6EE`
- **Pastel palette**: butter, sky, mint, coral, lavender (each with a `deep` variant) — wired into Tailwind via `tailwind.config.ts`
- **Type**: Bricolage Grotesque (display) + Plus Jakarta Sans (body), loaded via `next/font/google`
- **Shape language**: large radii (`rounded-3xl`/`rounded-4xl`), soft layered shadows, "clay" inset for 3D-style toys
- **Animations**: lightweight CSS keyframes (`animate-float-a/b/c`, `animate-spin-slow`) for floating toy elements + Framer Motion for entrance reveals (`whileInView`)
- **3D toys**: rendered as SVGs with radial gradients + a soft ground shadow — see `components/ui/ToyVisual.tsx`. No heavy 3D library; stays fast.

---

## Conversion features

- Floating WhatsApp pill on every page (`FloatingWhatsApp`)
- "Commander sur WhatsApp" CTA on every product card and product detail page
- Trust badges row right under the hero (livraison, paiement à la livraison, sélection, support, idées cadeaux)
- "Idées cadeaux par âge" + dedicated coffret cadeau banner section
- Cart persists in `localStorage`, with item count badge in the header
- Strong primary CTAs: "Découvrir la collection", "Choisir par âge", "Trouver le cadeau parfait", "Ajouter au panier"

---

## SEO

- Per-route `<title>` via the `metadata` export
- Homepage default title: **Mini Genius | Jouets Éducatifs & Montessori en Tunisie**
- Description and keywords tailored for Tunisia: jouets éducatifs Tunisie, Montessori Tunisie, jouets sensoriels, STEM, etc.
- Open Graph + canonical + viewport themeColor in `app/layout.tsx`
- Static params + dynamic metadata for product pages (`generateStaticParams` + `generateMetadata`)

---

## Configuration

- **WhatsApp number**: edit `WHATSAPP_NUMBER` in `lib/utils.ts`.
- **Site URL** for SEO: edit `metadataBase` in `app/layout.tsx`.
- **Products**: edit `data/products.ts` — typed `Product[]`. The `ToyVisual` palette + shape combination is what renders the visual.
- **Categories / ages / testimonials / trust badges / benefits**: `data/site.ts`.

---

## Verification checklist

After `npm install && npm run dev`:

1. `/` — hero, trust row, age cards, categories, 8 products, benefits, gift box, testimonials, newsletter all render and animate in.
2. `/collection` — try filters: `?cat=montessori`, `?age=3-5`, `?sort=price-asc`. Mobile (below `lg`): tap **Filtres** → drawer opens.
3. `/produit/blocs-magnetiques-creatifs` — gallery cycles palettes, breadcrumb, age pill, develops, safety, delivery, related products.
4. Cart — click **Ajouter** on a card → header badge increments → reload → cart still there. Open `/panier` → quantity +/-, remove, vider, WhatsApp link opens with order summary.
5. `/a-propos` — brand story + values grid + CTA banner.
6. `/contact` — form (renders success state on submit), info cards, social, delivery info.
7. Resize to ~375px: header collapses to hamburger, mobile menu slides in, cards stack, no horizontal scroll.

---

## Next steps

- Wire WhatsApp number, site URL, and any payment flow integration.
- Replace SVG toy visuals with real product photography by adding an `imageSrc` field to `Product` and an `<Image>` fallback inside `ProductCard` / `ProductGallery`.
- Hook the contact form + newsletter to a real provider (Resend, MailerLite, etc.) via Server Actions.
- Add product reviews section if needed.
- Once happy: remove the legacy root files (`index.html`, `*.jsx`, `styles.css`).

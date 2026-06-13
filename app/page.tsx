import Hero from "@/components/home/Hero";
import TrustBadges from "@/components/home/TrustBadges";
import AgeCategories from "@/components/home/AgeCategories";
import Scroll3DShowcase from "@/components/home/Scroll3DShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BenefitsSection from "@/components/home/BenefitsSection";
import CategoryCards from "@/components/home/CategoryCards";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import GiftBoxSection from "@/components/home/GiftBoxSection";
import FAQ from "@/components/home/FAQ";
import Reveal from "@/components/motion/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo/structured-data";
import { HOME_FAQS } from "@/data/faq";
import { listCollections } from "@/lib/admin/storage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const collections = await listCollections();

  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <Hero />
      <Reveal>
        <TrustBadges />
      </Reveal>
      <Reveal>
        <AgeCategories collections={collections.filter((collection) => collection.active)} />
      </Reveal>
      <Reveal variant="scaleIn">
        <Scroll3DShowcase />
      </Reveal>
      <Reveal>
        <FeaturedProducts />
      </Reveal>
      <Reveal>
        <BenefitsSection />
      </Reveal>
      <Reveal>
        <CategoryCards />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal variant="scaleIn">
        <GiftBoxSection />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
    </>
  );
}

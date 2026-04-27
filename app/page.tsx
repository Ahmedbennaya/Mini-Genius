import Hero from "@/components/home/Hero";
import Scroll3DShowcase from "@/components/home/Scroll3DShowcase";
import TrustBadges from "@/components/home/TrustBadges";
import AgeCategories from "@/components/home/AgeCategories";
import CategoryCards from "@/components/home/CategoryCards";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BenefitsSection from "@/components/home/BenefitsSection";
import GiftBoxSection from "@/components/home/GiftBoxSection";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Scroll3DShowcase />
      <TrustBadges />
      <AgeCategories />
      <CategoryCards />
      <FeaturedProducts />
      <BenefitsSection />
      <GiftBoxSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}

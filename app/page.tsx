import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Differentials } from "@/components/Differentials";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Marquee } from "@/components/Marquee";
import { Footer } from "@/components/Footer";
import { SocialDock } from "@/components/SocialDock";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Header />
      <main id="inicio" className="overflow-x-clip">
        <Hero />
        <Marquee />
        <Services />
        <Differentials />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <SocialDock />
    </>
  );
}

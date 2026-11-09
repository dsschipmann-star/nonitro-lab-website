import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Differentials } from "@/components/Differentials";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Header />
      <main id="inicio">
        <Hero />
        <Services />
        <Differentials />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

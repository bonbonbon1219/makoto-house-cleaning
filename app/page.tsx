import { Hero } from "@/components/Hero";
import { Trust } from "@/components/Trust";
import { Featured } from "@/components/Featured";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Estimate } from "@/components/Estimate";
import { Area } from "@/components/Area";
import { Flow } from "@/components/Flow";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <Trust />
      <Featured />
      <BeforeAfter />
      <Services />
      <Pricing />
      <Estimate />
      <Area />
      <Flow />
      <Faq />
      <Contact />
    </>
  );
}

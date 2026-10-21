import { Hero } from "@/components/Hero";
import { Trust } from "@/components/Trust";
import { Featured } from "@/components/Featured";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Estimate } from "@/components/Estimate";
import { Area } from "@/components/Area";
import { Owner } from "@/components/Owner";
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
      <Services />
      <Pricing />
      <Estimate />
      <Area />
      <Owner />
      <Flow />
      <Faq />
      <Contact />
    </>
  );
}

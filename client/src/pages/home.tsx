import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partnerships from "@/components/Partnerships";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import SEO from "@/components/SEO";
import SolutionsPreview from "@/components/SolutionsPreview";
import Process from "@/components/Process";
import VelocityTicker from "@/components/design/VelocityTicker";

export default function Home() {
  const { data: heroContent } = useQuery<HeroContent>({ queryKey: ["/api/hero"], staleTime: 1000 * 60 * 5 });
  const tickerLines = heroContent?.typingTexts?.length ? heroContent.typingTexts : ["Software Developer & Problem Solver"];

  return (
    <MarketingLayout flush>
      <SEO
        title="Malek Fouda | Shopify, WordPress & Custom Software Developer"
        description="Commercial full-stack development for Shopify, WordPress, WooCommerce, custom business systems, integrations, and ongoing technical support."
        keywords={["Shopify developer", "WordPress developer", "WooCommerce developer", "custom software developer", "full-stack developer", "Malek Fouda"]}
      />
      <Hero />
      <VelocityTicker items={tickerLines} />
      <About />
      <Partnerships />
      <SolutionsPreview />
      <Process />
      <Projects />
      <Skills />
      <Contact headingLevel="h2" />
    </MarketingLayout>
  );
}

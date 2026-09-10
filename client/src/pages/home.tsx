import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partnerships from "@/components/Partnerships";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MatrixBackground from "@/components/MatrixBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import SolutionsPreview from "@/components/SolutionsPreview";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <SEO 
        title="Malek Fouda | Shopify, WordPress & Custom Software Developer"
        description="Commercial full-stack development for Shopify, WordPress, WooCommerce, custom business systems, integrations, and ongoing technical support."
        keywords={["Shopify developer", "WordPress developer", "WooCommerce developer", "custom software developer", "full-stack developer", "Malek Fouda"]}
      />
      <a href="#main-content" className="sr-only z-[100] rounded-lg bg-green-400 px-4 py-3 font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <MatrixBackground />
      <Navigation />
      <main id="main-content">
        <Hero />
        <About />
        <Partnerships />
        <SolutionsPreview />
        <Projects />
        <Skills />
        <Contact headingLevel="h2" />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

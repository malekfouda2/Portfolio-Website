import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServiceOffers from "@/components/ServiceOffers";
import Partnerships from "@/components/Partnerships";
import Projects from "@/components/Projects";
import WorkingProcess from "@/components/WorkingProcess";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MatrixBackground from "@/components/MatrixBackground";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <SEO 
        title="Malek Fouda | WooCommerce, WordPress & Custom Web Development"
        description="Malek Fouda helps businesses and agencies build, improve, and support WooCommerce stores, custom web applications, dashboards, portals, and integrations."
        keywords={["Malek Fouda", "WooCommerce developer", "WordPress developer", "custom web application development", "business dashboards", "web development support", "website technical audit", "Egypt web developer"]}
      />
      <MatrixBackground />
      <Navigation />
      <Hero />
      <About />
      <ServiceOffers />
      <Partnerships />
      <Projects />
      <WorkingProcess />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}

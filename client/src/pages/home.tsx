import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partnerships from "@/components/Partnerships";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MatrixBackground from "@/components/MatrixBackground";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <MatrixBackground />
      <Navigation />
      <Hero />
      <About />
      <Partnerships />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}

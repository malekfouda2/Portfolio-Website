import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partnerships from "@/components/Partnerships";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MatrixBackground from "@/components/MatrixBackground";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <SEO 
        title="Malek Fouda - Full Stack Developer & Software Engineer"
        description="Experienced full stack developer specializing in React, Node.js, and modern web technologies. Available for freelance projects and custom software development."
        keywords={["full stack developer", "react developer", "node.js", "web development", "javascript", "typescript", "freelance developer", "software engineer", "malek fouda"]}
      />
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

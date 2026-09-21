import { useQuery } from "@tanstack/react-query";
import type { AboutContent } from "@shared/schema";
import RevealText from "./design/RevealText";
import CountUp from "./design/CountUp";
import WaveText from "./design/WaveText";
import { Code, ShoppingCart, Smartphone } from "lucide-react";
import ArtPanel from "./art/ArtPanel";
import { StackScene } from "./art/Scenes";

const expertise = [
  { Icon: Code, fill: "bg-signal", title: "Full-Stack Development", desc: "End-to-end web applications with modern frameworks" },
  { Icon: Smartphone, fill: "bg-flow", title: "Mobile Applications", desc: "Cross-platform mobile apps for iOS and Android" },
  { Icon: ShoppingCart, fill: "bg-violet", title: "E-commerce Solutions", desc: "Custom online stores and payment integrations" },
];

const stats = [
  { value: "3+", label: "Years Experience", color: "text-signal" },
  { value: "50+", label: "Projects Delivered", color: "text-flow" },
  { value: "15+", label: "Technologies", color: "text-violet" },
  { value: "98%", label: "Client Satisfaction", color: "text-bone" },
];

export default function About() {
  const { data: aboutContent } = useQuery<AboutContent>({
    queryKey: ["/api/about"],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section id="about" className="section relative border-t border-white/10" aria-labelledby="about-heading">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <RevealText id="about-heading" text="About Me" gradientFrom={1} className="display-l" />
            <p className="mt-6 max-w-[40ch] text-lg leading-8 text-fog">
              Transforming ideas into dependable digital products through expert development and practical problem-solving
            </p>
          <p className="display-s mt-10 font-semibold leading-[1.3] text-bone/90" style={{ fontStretch: "100%", fontWeight: 500 }}>
            {aboutContent?.description ||
              "With over 3 years of dedicated experience in software development, I specialize in creating high-quality digital solutions that drive business growth and enhance user experiences. My approach combines technical expertise with creative problem-solving to deliver projects that not only meet requirements but exceed expectations."}
          </p>
          </div>
          <ArtPanel className="mx-auto w-full max-w-md"><StackScene className="w-full" /></ArtPanel>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h3 className="text-sm font-semibold text-bone">My Expertise</h3>
            <ul className="mt-5">
              {expertise.map((item) => (
                <li key={item.title} className="group flex items-start gap-4 border-t border-white/10 py-5 last:border-b">
                  <span aria-hidden="true" className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-black transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110 ${item.fill}`}><item.Icon className="h-6 w-6" /></span>
                  <div>
                    <WaveText as="h4" text={item.title} className="display-s transition-colors duration-300 group-hover:text-signal" />
                    <p className="mt-1.5 text-fog">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-2 self-end border-l border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-b border-r border-white/10 p-6 sm:p-8">
                <dt className="mt-2 text-sm text-fog sm:text-base">{stat.label}</dt>
                <dd className={`display text-[clamp(2.6rem,6vw,4.75rem)] leading-none ${stat.color}`}><CountUp value={stat.value} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

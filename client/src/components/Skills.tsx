import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiLaravel,
  SiDotnet,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiGit,
  SiDocker,
  SiAmazonwebservices,
  SiReact as SiReactNative,
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiShopify,
  SiWordpress,
  SiDjango,
  SiFastapi,
  SiVercel,
  SiNetlify,
} from "react-icons/si";
import type { ReactNode } from "react";
import SectionHead from "./design/SectionHead";
import Marquee from "./design/Marquee";

type Skill = { name: string; icon: ReactNode };

const icon = "h-7 w-7 sm:h-8 sm:w-8";

const skillCategories: Array<{ title: string; skills: Skill[] }> = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: <SiReact className={`${icon} text-[#61DAFB]`} /> },
      { name: "Next.js", icon: <SiNextdotjs className={`${icon} text-white`} /> },
      { name: "Vue.js", icon: <SiVuedotjs className={`${icon} text-[#42B883]`} /> },
      { name: "Angular", icon: <SiAngular className={`${icon} text-[#DD0031]`} /> },
      { name: "JavaScript", icon: <SiJavascript className={`${icon} text-[#F7DF1E]`} /> },
      { name: "TypeScript", icon: <SiTypescript className={`${icon} text-[#3178C6]`} /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className={`${icon} text-[#38BDF8]`} /> },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: <SiNodedotjs className={`${icon} text-[#5FA04E]`} /> },
      { name: "Express.js", icon: <SiExpress className={`${icon} text-gray-300`} /> },
      { name: "Python", icon: <SiPython className={`${icon} text-[#FFD43B]`} /> },
      { name: "PHP", icon: <SiPhp className={`${icon} text-[#8892BF]`} /> },
      { name: "Laravel", icon: <SiLaravel className={`${icon} text-[#FF2D20]`} /> },
      { name: ".NET", icon: <SiDotnet className={`${icon} text-[#9B6BDF]`} /> },
    ],
  },
  {
    title: "Database",
    skills: [
      { name: "MySQL", icon: <SiMysql className={`${icon} text-[#F29111]`} /> },
      { name: "MongoDB", icon: <SiMongodb className={`${icon} text-[#47A248]`} /> },
      { name: "PostgreSQL", icon: <SiPostgresql className={`${icon} text-[#4169E1]`} /> },
      { name: "Firebase", icon: <SiFirebase className={`${icon} text-[#FFCA28]`} /> },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "Git", icon: <SiGit className={`${icon} text-[#F05032]`} /> },
      { name: "Docker", icon: <SiDocker className={`${icon} text-[#2496ED]`} /> },
      { name: "AWS", icon: <SiAmazonwebservices className={`${icon} text-[#FF9900]`} /> },
      { name: "React Native", icon: <SiReactNative className={`${icon} text-[#61DAFB]`} /> },
    ],
  },
];

const extraSkills: Skill[] = [
  { name: "Shopify", icon: <SiShopify className={`${icon} text-[#95BF47]`} /> },
  { name: "WordPress", icon: <SiWordpress className={`${icon} text-[#21759B]`} /> },
  { name: "Django", icon: <SiDjango className={`${icon} text-[#44B78B]`} /> },
  { name: "FastAPI", icon: <SiFastapi className={`${icon} text-[#009688]`} /> },
  { name: "Vercel", icon: <SiVercel className={`${icon} text-white`} /> },
  { name: "Netlify", icon: <SiNetlify className={`${icon} text-[#32E6E2]`} /> },
];

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <span className="group/skill mr-10 inline-flex items-center gap-3 sm:mr-14">
      <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/skill:-rotate-6 group-hover/skill:scale-125">{skill.icon}</span>
      <span className="display whitespace-nowrap [font-stretch:100%] text-[clamp(1.4rem,2.8vw,2.3rem)] transition-colors duration-300 group-hover/skill:text-signal">{skill.name}</span>
    </span>
  );
}

/** Repeats short lists so each marquee row is wide enough to loop without gaps. */
function fill(skills: Skill[]) {
  return skills.length >= 6 ? skills : [...skills, ...skills];
}

export default function Skills() {
  return (
    <section id="skills" className="section overflow-hidden border-t border-white/10" aria-labelledby="skills-heading">
      <div className="shell">
        <SectionHead id="skills-heading" title="Tech Stack" gradientFrom={1} intro="Technologies and tools I use to bring ideas to life" />
      </div>

      <div className="mt-14 border-b border-white/10">
        {skillCategories.map((category, index) => (
          <div key={category.title} className="grid border-t border-white/10 lg:grid-cols-[17rem_1fr]">
            <h3 className="flex items-center px-5 pt-5 sm:px-8 lg:border-r lg:border-white/10 lg:px-12 lg:py-0">
              <span className="tag whitespace-nowrap">{category.title}</span>
            </h3>
            <ul className="sr-only">{category.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}</ul>
            <div aria-hidden="true" className="py-6 sm:py-8">
              <Marquee reverse={index % 2 === 1} duration={34 + index * 6}>
                {fill(category.skills).map((skill, skillIndex) => <SkillItem key={`${skill.name}-${skillIndex}`} skill={skill} />)}
              </Marquee>
            </div>
          </div>
        ))}
      </div>

      <div className="shell mt-20">
        <SectionHead title="More Technologies" size="m" intro="Complete technology stack I work with" />
      </div>
      <ul className="sr-only">{extraSkills.map((skill) => <li key={skill.name}>{skill.name}</li>)}</ul>
      <div aria-hidden="true" className="mt-10 border-y border-white/10 py-8">
        <Marquee duration={30}>
          {extraSkills.map((skill) => <SkillItem key={skill.name} skill={skill} />)}
        </Marquee>
      </div>
    </section>
  );
}

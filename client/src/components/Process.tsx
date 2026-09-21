import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import SectionHead from "./design/SectionHead";
import { AuditScene, MaintenanceScene, SendScene, SystemsScene, type SceneProps } from "./art/Scenes";

type Step = { title: string; copy: string; Art: (props: SceneProps) => JSX.Element; tint: string };

// Wording is drawn from the site's existing enquiry, solution and delivery copy.
const steps: Step[] = [
  { title: "Share the problem", copy: "Tell me what needs to work better. A short explanation is enough.", Art: SendScene, tint: "from-[rgba(26,255,110,0.16)]" },
  { title: "Diagnose and scope", copy: "Each engagement starts with diagnosis and is scoped around the responsible technical layer.", Art: AuditScene, tint: "from-[rgba(33,150,243,0.2)]" },
  { title: "Build with updates", copy: "Documented decisions and written progress updates while the work moves.", Art: SystemsScene, tint: "from-[rgba(192,132,252,0.18)]" },
  { title: "Hand over and support", copy: "Clear handover notes, with ongoing maintenance available.", Art: MaintenanceScene, tint: "from-[rgba(26,255,110,0.16)]" },
];

/** A visual walk through how an engagement runs, one illustration per step. */
export default function Process() {
  return (
    <section id="process" className="section border-t border-white/10" aria-labelledby="process-heading">
      <div className="shell">
        <SectionHead
          id="process-heading"
          tag="How it works"
          title="From first message to dependable software."
          gradientFrom={4}
          aside={<Link href="/contact" className="text-link">Start with step one <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>}
        />
        <ol className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {steps.map(({ title, copy, Art, tint }, index) => (
            <li key={title} className="group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-white/10 transition-colors duration-300 hover:border-white/25 sm:w-auto">
              <div className={`relative bg-gradient-to-b ${tint} to-transparent px-5 pb-2 pt-6`}>
                <span className="absolute left-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-bone text-sm font-extrabold text-black">{index + 1}</span>
                <Art className="mx-auto w-full max-w-[15rem] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105" />
              </div>
              <div className="p-6 pt-4">
                <h3 className="display-s">{title}</h3>
                <p className="mt-3 leading-7 text-fog">{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

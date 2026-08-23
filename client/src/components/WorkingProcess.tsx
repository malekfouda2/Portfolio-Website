import { CheckCircle2, FlaskConical, MessageSquareText, Rocket, Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

const steps = [
  { icon: MessageSquareText, title: "Discovery", copy: "We clarify the business need, current setup, and the outcome that matters." },
  { icon: Search, title: "Scope", copy: "You get a focused plan with priorities, assumptions, and a scoped estimate before work begins." },
  { icon: Rocket, title: "Implementation", copy: "The work is built carefully around the agreed requirements and existing systems." },
  { icon: FlaskConical, title: "Testing & launch", copy: "Changes are tested before release so the result is dependable, not just delivered." },
  { icon: CheckCircle2, title: "Ongoing support", copy: "For teams that need it, the work can continue with maintenance and next-step improvements." },
];

export default function WorkingProcess() {
  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const stepsRef = useStaggeredReveal<HTMLOListElement>(steps.length);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  const startConversation = () => {
    trackEvent("process_consultation_request", "conversion", "working_process");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="process" className="py-12 sm:py-16 lg:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-blue-400 font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">A clear way to work together</p>
            <h2 ref={headingRef} className="reveal text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="text-white">From the first question to</span>
              <span className="gradient-text"> reliable delivery</span>
            </h2>
          </div>

          <ol ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
            {steps.map(({ icon: Icon, title, copy }, index) => (
              <li key={title} className="reveal relative bg-gray-900/70 border border-gray-800 rounded-2xl p-5 sm:p-6">
                <span className="text-xs font-semibold text-gray-500">0{index + 1}</span>
                <Icon aria-hidden="true" className="w-6 h-6 text-green-400 mt-4 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{copy}</p>
              </li>
            ))}
          </ol>

          <div ref={ctaRef} className="reveal text-center mt-10">
            <button type="button" onClick={startConversation} className="text-green-400 font-semibold hover:text-white transition-colors">
              Start with a short project conversation <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
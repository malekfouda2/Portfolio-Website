import { ArrowRight, ArrowUpRight, Handshake, LayoutDashboard, ShoppingBag, Workflow } from "lucide-react";
import { Link } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import RevealText from "@/components/design/RevealText";
import Chevron from "@/components/design/Chevron";
import { getCalendlyUrl } from "@/lib/leadLinks";
import { trackEvent } from "@/lib/analytics";
import WaveText from "@/components/design/WaveText";
import ArtPanel from "@/components/art/ArtPanel";
import { GlobeScene } from "@/components/art/Scenes";

const principles = ["Understand the business before choosing the implementation", "Keep communication direct and decisions documented", "Design for the people operating the product after launch", "Treat security, performance, and maintainability as delivery requirements"];

const areas = [
  { title: "Commerce", copy: "Shopify, WordPress, WooCommerce, payments, shipping, and storefront integrations.", Icon: ShoppingBag, tone: "bg-signal" },
  { title: "Applications", copy: "React, Node.js, PHP, Laravel, dashboards, portals, and authenticated workflows.", Icon: LayoutDashboard, tone: "bg-flow" },
  { title: "Operations", copy: "APIs, automation, role-based access, reporting, deployment, and maintenance.", Icon: Workflow, tone: "bg-violet" },
  { title: "Partnerships", copy: "Direct delivery for businesses and white-label implementation for agencies.", Icon: Handshake, tone: "bg-bone" },
];

export default function AboutPage() {
  return <MarketingLayout>
    <SEO title="About Malek Fouda | Full-Stack Developer" description="Meet Malek Fouda, a Cairo-based full-stack developer delivering e-commerce platforms, business systems, integrations, and white-label development." canonicalPath="/about" />
    <PageHero
      tag="About Malek"
      title="A developer who cares about what happens after launch."
      gradientFrom={4}
      intro="I build software for real businesses—where reliability, clear communication, and maintainable decisions matter as much as the interface."
      art={<ArtPanel><GlobeScene className="w-full" /></ArtPanel>}
    />

    <section className="section border-t border-white/10">
      <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <RevealText text="Based in Cairo, working internationally." className="display-m max-w-[16ch]" />
          <p className="mt-7 text-lg leading-8 text-bone/85">My work spans e-commerce, learning platforms, logistics, dashboards, portals, and integrations. I work directly with growing businesses and founders, and discreetly with agencies that need dependable development capacity.</p>
          <p className="mt-5 text-lg leading-8 text-bone/85">I am most useful when the requirements are complicated but the final experience needs to feel straightforward.</p>
        </div>
        <div className="rounded-[2rem] bg-flow p-7 text-black sm:p-10">
          <p className="tag tag-dark">Working principles</p>
          <ul className="mt-7">
            {principles.map((principle) => (
              <li key={principle} className="flex gap-4 border-t border-black/20 py-5 text-lg font-medium leading-7 first:border-t-0 first:pt-0">
                <Chevron side="right" tone="void" strokeWidth={32} className="mt-1.5 h-4 w-auto shrink-0" />{principle}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="section border-t border-white/10">
      <div className="shell">
        <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(({ title, copy, Icon, tone }) => (
            <article key={title} className="group border-b border-r border-white/10 p-7 transition-colors duration-500 hover:bg-white/[0.03] sm:p-8">
              <span aria-hidden="true" className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl text-black transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110 ${tone}`}><Icon className="h-7 w-7" /></span>
              <WaveText as="h2" text={title} className="display text-[clamp(1.45rem,2vw,1.85rem)] text-signal [font-stretch:104%]" />
              <p className="mt-5 leading-7 text-fog">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-signal">Send Project Details <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          <a href={getCalendlyUrl("about")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "about")} className="btn btn-line">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  </MarketingLayout>;
}

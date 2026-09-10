import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl } from "@/lib/leadLinks";

export default function SolutionsPage() {
  return <MarketingLayout>
    <SEO
      title="E-commerce & Business Software Solutions | Malek Fouda"
      description="Focused Shopify, WooCommerce, dashboard, integration, technical audit, maintenance, and white-label development solutions."
      canonicalPath="/solutions"
      keywords={["Shopify solutions", "WooCommerce development", "custom dashboard development", "website technical audit"]}
    />
    <header className="marketing-hero"><div className="marketing-shell text-center">
      <p className="marketing-eyebrow">Focused solutions</p>
      <h1 className="marketing-title">Start with the problem that is <span className="gradient-text">blocking the business.</span></h1>
      <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">Specific development engagements for stores, operations teams, founders, and agencies that need a reliable technical outcome—not a generic list of technologies.</p>
    </div></header>
    <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section">
      <div className="grid gap-6 md:grid-cols-2">{commercialLandingPages.map((page) => <Link key={page.slug} href={`/solutions/${page.slug}`} className="marketing-card group flex h-full flex-col p-7 transition hover:-translate-y-1 hover:border-green-400/50">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-400">{page.eyebrow}</p>
        <h2 className="mt-4 text-2xl font-bold leading-tight">{page.title}</h2>
        <p className="mt-4 flex-1 leading-7 text-gray-400">{page.intro}</p>
        <span className="mt-7 inline-flex items-center gap-2 font-semibold text-green-400">Explore this solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
      </Link>)}</div>
    </div></section>
    <section className="marketing-section"><div className="marketing-shell"><div className="marketing-card mx-auto max-w-4xl p-8 text-center sm:p-12">
      <p className="marketing-eyebrow">Not sure where it fits?</p>
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Describe what is failing or slowing the team down.</h2>
      <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">A technical brief is optional. The current situation, affected users, business impact, and desired outcome are enough to begin.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4"><a href={getCalendlyUrl("solutions_hub")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "solutions_hub")} className="primary-cta">Book a Call <ArrowUpRight className="h-4 w-4" /></a><Link href="/contact" className="secondary-cta">Send project details <ArrowRight className="h-4 w-4" /></Link></div>
    </div></div></section>
  </MarketingLayout>;
}

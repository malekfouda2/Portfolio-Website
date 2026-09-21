import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import ProblemIndex from "@/components/design/ProblemIndex";
import CtaBand from "@/components/design/CtaBand";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl } from "@/lib/leadLinks";
import ArtPanel from "@/components/art/ArtPanel";
import { AuditScene, sceneFor } from "@/components/art/Scenes";

export default function SolutionsPage() {
  return <MarketingLayout>
    <SEO
      title="E-commerce & Business Software Solutions | Malek Fouda"
      description="Focused Shopify, WooCommerce, dashboard, integration, technical audit, maintenance, and white-label development solutions."
      canonicalPath="/solutions"
      keywords={["Shopify solutions", "WooCommerce development", "custom dashboard development", "website technical audit"]}
    />
    <PageHero
      tag="Focused solutions"
      title="Start with the problem that is blocking the business."
      gradientFrom={6}
      intro="Specific development engagements for stores, operations teams, founders, and agencies that need a reliable technical outcome—not a generic list of technologies."
      art={<ArtPanel><AuditScene className="w-full" /></ArtPanel>}
    />
    <section className="pb-20 sm:pb-28">
      <div className="shell">
        <ProblemIndex items={commercialLandingPages.map((page) => ({ href: `/solutions/${page.slug}`, eyebrow: page.eyebrow, title: page.title, body: page.intro, action: "Explore this solution", art: sceneFor(page.slug) }))} />
      </div>
    </section>
    <CtaBand tag="Not sure where it fits?" title="Describe what is failing or slowing the team down." body="A technical brief is optional. The current situation, affected users, business impact, and desired outcome are enough to begin.">
      <a href={getCalendlyUrl("solutions_hub")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "solutions_hub")} className="btn btn-void">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
      <Link href="/contact" className="btn btn-ink-line">Send project details <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    </CtaBand>
  </MarketingLayout>;
}

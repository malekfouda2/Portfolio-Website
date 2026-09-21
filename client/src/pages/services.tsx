import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import SectionHead from "@/components/design/SectionHead";
import ProblemIndex from "@/components/design/ProblemIndex";
import CtaBand from "@/components/design/CtaBand";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import { getCalendlyUrl } from "@/lib/leadLinks";
import { trackEvent } from "@/lib/analytics";
import ArtPanel from "@/components/art/ArtPanel";
import { StackScene, sceneFor } from "@/components/art/Scenes";

export default function ServicesPage() {
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  return <MarketingLayout>
    <SEO title="Shopify, WordPress & Custom Software Services | Malek Fouda" description="Commercial development services covering Shopify, WordPress, WooCommerce, custom business systems, agency delivery, technical audits, performance, and support." canonicalPath="/services" />
    <PageHero
      tag="Development services"
      title="The technical help your business actually needs."
      gradientFrom={4}
      intro="From e-commerce rescue work to custom operating systems, each engagement starts with the business problem and ends with dependable software."
      art={<ArtPanel><StackScene className="w-full" /></ArtPanel>}
    />

    <section className="pb-20 sm:pb-28">
      <div className="shell">
        <ProblemIndex items={services.map((service) => ({ href: `/services/${service.slug}`, eyebrow: service.eyebrow, title: service.title, body: service.shortDescription, action: "View service", art: sceneFor(service.slug) }))} />
      </div>
    </section>

    <section className="section border-t border-white/10">
      <div className="shell">
        <SectionHead
          tag="Search by problem"
          title="Focused commercial solutions."
          gradientFrom={1}
          size="m"
          intro="Start with the specific storefront, integration, operational, or delivery problem that needs an owner."
        />
        <ProblemIndex compact className="mt-12" items={commercialLandingPages.map((page) => ({ href: `/solutions/${page.slug}`, title: page.title, action: "View focused solution" }))} />
        <Link href="/solutions" className="btn btn-line mt-10">Browse all solutions <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </section>

    <CtaBand title="Not sure how to describe the scope?" body="Tell me what is failing, costing time, or blocking growth. That is enough to start a useful technical conversation.">
      <Link href="/contact" className="btn btn-void">Describe the problem <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      <a href={getCalendlyUrl("services_hub")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "services_hub")} className="btn btn-ink-line">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
    </CtaBand>
  </MarketingLayout>;
}

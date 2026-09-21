import { ArrowLeft, ArrowRight, ArrowUpRight, CircleAlert, Flag, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import type { Service } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import SectionHead from "@/components/design/SectionHead";
import CtaBand from "@/components/design/CtaBand";
import Chevron from "@/components/design/Chevron";
import { PageLoading, PageMissing } from "@/components/design/PageState";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl } from "@/lib/leadLinks";
import ArtPanel from "@/components/art/ArtPanel";
import { sceneFor } from "@/components/art/Scenes";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useQuery<Service>({ queryKey: [`/api/services/${slug}`] });
  if (isLoading) return <MarketingLayout><PageLoading /></MarketingLayout>;
  const ServiceArt = sceneFor(slug);
  if (isError || !service) return <MarketingLayout><PageMissing title="Service not found."><Link href="/services" className="btn btn-line"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to services</Link></PageMissing></MarketingLayout>;

  return <MarketingLayout>
    <SEO title={service.seoTitle} description={service.seoDescription} canonicalPath={`/services/${service.slug}`} />
    <PageHero back={{ href: "/services", label: "All services" }} tag={service.eyebrow} title={service.title} intro={service.shortDescription} art={<ArtPanel><ServiceArt className="w-full" /></ArtPanel>}>
      <a href={getCalendlyUrl(`${service.slug}_hero`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("service_inquiry_click", "lead", service.slug)} className="btn btn-signal">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
    </PageHero>

    <section className="border-y border-white/10">
      <div className="shell grid lg:grid-cols-3">
        {([["Who it’s for", service.audience, Users, "bg-signal"], ["What’s going wrong", service.problem, CircleAlert, "bg-violet"], ["Where we’re heading", service.outcome, Flag, "bg-flow"]] as const).map(([label, copy, Icon, tone]) => (
          <article key={label} className="border-white/10 py-10 lg:border-l lg:px-8 lg:py-14 lg:first:border-l-0 lg:first:pl-0 [&:not(:first-child)]:border-t lg:[&:not(:first-child)]:border-t-0">
            <span aria-hidden="true" className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl text-black ${tone}`}><Icon className="h-6 w-6" /></span>
            <h2 className="tag">{label}</h2>
            <p className="mt-5 text-lg leading-8 text-bone/85">{copy}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section">
      <div className="shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead tag="What the work can include" title="A scope shaped around the real problem." size="m" />
          <p className="mt-6 leading-8 text-fog">{service.description}</p>
        </div>
        <ul className="border-b border-white/10">
          {service.deliverables.map((item) => (
            <li key={item} className="group flex gap-5 border-t border-white/10 py-6 text-lg leading-8 text-bone/90">
              <Chevron side="right" tone="gradient" strokeWidth={30} className="mt-2 h-4 w-auto shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>

    {service.faqs.length > 0 && <section className="section border-t border-white/10">
      <div className="shell grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
        <SectionHead tag="Straight answers" title="Before we scope it." size="m" />
        <div>{service.faqs.map((faq) => <details key={faq.question} className="faq"><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
      </div>
    </section>}

    <CtaBand title="Tell me what needs to work better.">
      <a href={getCalendlyUrl(`${service.slug}_bottom`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", `${service.slug}_bottom`)} className="btn btn-void">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
      <Link href="/contact" className="btn btn-ink-line">Send the details <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    </CtaBand>
  </MarketingLayout>;
}

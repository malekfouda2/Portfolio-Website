import { ArrowLeft, ArrowRight, ArrowUpRight, ClipboardList, Hammer, Rocket, ScanSearch, TrendingUp, TriangleAlert } from "lucide-react";
import ArtPanel from "@/components/art/ArtPanel";
import { sceneFor } from "@/components/art/Scenes";
import { Link, useParams } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import SectionHead from "@/components/design/SectionHead";
import ProblemIndex from "@/components/design/ProblemIndex";
import CtaBand from "@/components/design/CtaBand";
import Chevron from "@/components/design/Chevron";
import RevealText from "@/components/design/RevealText";
import { PageMissing } from "@/components/design/PageState";
import { commercialLandingPageBySlug, commercialLandingPages } from "@shared/commercialLandingPages";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl } from "@/lib/leadLinks";

export default function CommercialLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = commercialLandingPageBySlug.get(slug);

  if (!page) return <MarketingLayout><PageMissing title="Solution not found."><Link href="/solutions" className="btn btn-line"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Browse solutions</Link></PageMissing></MarketingLayout>;

  const relatedPages = commercialLandingPages.filter((candidate) => candidate.slug !== page.slug).slice(0, 3);
  const PageArt = sceneFor(page.slug);
  // Process steps are a sequence: diagnose → plan → build → hand over.
  const stepIcons = [ScanSearch, ClipboardList, Hammer, Rocket];

  return <MarketingLayout>
    <SEO title={page.seoTitle} description={page.seoDescription} canonicalPath={`/solutions/${page.slug}`} keywords={page.keywords} />
    <PageHero back={{ href: "/solutions", label: "All focused solutions" }} tag={page.eyebrow} title={page.title} intro={page.intro} art={<ArtPanel><PageArt className="w-full" /></ArtPanel>}>
      <a href={getCalendlyUrl(`${page.slug}_hero`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("commercial_landing_cta", "lead", page.slug)} className="btn btn-signal">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
    </PageHero>

    <section className="section border-t border-white/10">
      <div className="shell grid gap-12 lg:grid-cols-[0.4fr_0.6fr] lg:gap-20">
        <div>
          <SectionHead tag="Who this is for" title="A focused engagement, not a generic package." size="m" />
          <p className="mt-6 text-lg leading-8 text-bone/85">{page.audience}</p>
        </div>
        <div className="panel p-7 sm:p-10">
          <span aria-hidden="true" className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-violet text-black"><TriangleAlert className="h-6 w-6" /></span>
          <h2 className="display-s">{page.painHeading}</h2>
          <ul className="mt-7 space-y-5">
            {page.painPoints.map((item) => (
              <li key={item} className="flex gap-4 leading-7 text-bone/85">
                <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rotate-45 bg-flow" />{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="section border-t border-white/10">
      <div className="shell grid gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHead tag="What the work can include" title="Scope built around the responsible technical layer." size="m" />
          <ul className="mt-10 border-b border-white/10">
            {page.deliverables.map((item) => (
              <li key={item} className="group flex gap-5 border-t border-white/10 py-5 leading-7 text-bone/90">
                <Chevron side="right" tone="gradient" strokeWidth={30} className="mt-1.5 h-4 w-auto shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHead tag="What changes" title="Outcomes the team can actually use." size="m" />
          <ul className="mt-10 space-y-4">
            {page.outcomes.map((item) => (
              <li key={item} className="flex gap-4 rounded-[1.5rem] border border-white/10 p-6 text-lg leading-8 text-bone/90">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--signal),var(--flow))] text-black"><TrendingUp className="h-5 w-5" /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="section border-t border-white/10">
      <div className="shell">
        <SectionHead tag="Delivery process" title="Enough structure to protect the result." size="m" />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-[linear-gradient(90deg,var(--signal),var(--flow))] lg:block" />
          {page.process.map((step, index) => {
            const StepIcon = stepIcons[index % stepIcons.length];
            return (
            <li key={step.title} className="group relative">
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-black text-sm font-bold ring-2 ring-signal">{index + 1}</span>
              <span aria-hidden="true" className="mt-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/15 text-signal transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110"><StepIcon className="h-7 w-7" /></span>
              <p className="mt-5 text-sm font-semibold text-flow">Step {index + 1}</p>
              <h3 className="display-s mt-2">{step.title}</h3>
              <p className="mt-3 leading-7 text-fog">{step.description}</p>
            </li>
            );
          })}
        </ol>
      </div>
    </section>

    <section className="bg-flow py-16 text-black sm:py-24">
      <div className="shell grid gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
        <div>
          <p className="tag tag-dark">Worldwide delivery</p>
          <RevealText text="Cairo-based, built for international teams." className="display-m mt-4 max-w-[16ch]" />
        </div>
        <p className="text-lg leading-8 text-black/80">I work remotely with businesses and agencies across Egypt, the GCC, Europe, and the USA. Engagements use documented decisions, written progress updates, planned timezone overlap, and clear handover notes so location does not become a delivery risk.</p>
      </div>
    </section>

    <section className="section">
      <div className="shell grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="panel p-7 sm:p-10">
          <SectionHead tag="Relevant experience" title="Evidence before promises." size="m" />
          <p className="mt-6 leading-8 text-bone/85">{page.proof}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {page.relatedCaseStudy && <Link href={`/work/${page.relatedCaseStudy.slug}`} className="btn btn-signal whitespace-normal text-left">{page.relatedCaseStudy.title} <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link>}
            <Link href="/portfolio" className="btn btn-line">Browse projects <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
        <aside className="panel flex flex-col p-7 sm:p-10">
          <p className="tag">Broader service</p>
          <h2 className="display-s mt-4">Need a wider scope?</h2>
          <p className="mt-4 leading-7 text-fog">Review the parent service for adjacent implementation, recovery, and ongoing support work.</p>
          <Link href={`/services/${page.relatedService.slug}`} className="text-link mt-auto pt-8">{page.relatedService.title} <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link>
        </aside>
      </div>
    </section>

    <section className="section border-t border-white/10">
      <div className="shell grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
        <SectionHead tag="Frequently asked" title="Before we scope it." size="m" />
        <div>{page.faqs.map((faq) => <details key={faq.question} className="faq"><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
      </div>
    </section>

    <CtaBand title="Bring the current problem, not a perfect brief." body="Share what is happening now, who it affects, and what a successful outcome would change.">
      <a href={getCalendlyUrl(`${page.slug}_bottom`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("commercial_landing_cta", "lead", `${page.slug}_bottom`)} className="btn btn-void">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
      <Link href="/contact" className="btn btn-ink-line">Send project details <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    </CtaBand>

    <section className="section">
      <div className="shell">
        <p className="tag">Related solutions</p>
        <ProblemIndex compact className="mt-8" items={relatedPages.map((candidate) => ({ href: `/solutions/${candidate.slug}`, title: candidate.title, action: "View solution" }))} />
      </div>
    </section>
  </MarketingLayout>;
}

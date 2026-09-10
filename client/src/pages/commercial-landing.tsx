import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleAlert } from "lucide-react";
import { Link, useParams } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import { commercialLandingPageBySlug, commercialLandingPages } from "@shared/commercialLandingPages";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl } from "@/lib/leadLinks";

export default function CommercialLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = commercialLandingPageBySlug.get(slug);

  if (!page) return <MarketingLayout><div className="marketing-shell min-h-[65vh] py-24"><h1 className="text-5xl font-bold">Solution not found.</h1><Link href="/solutions" className="mt-8 inline-flex items-center gap-2 text-green-400"><ArrowLeft className="h-4 w-4" />Browse solutions</Link></div></MarketingLayout>;

  const relatedPages = commercialLandingPages.filter((candidate) => candidate.slug !== page.slug).slice(0, 3);

  return <MarketingLayout>
    <SEO title={page.seoTitle} description={page.seoDescription} canonicalPath={`/solutions/${page.slug}`} keywords={page.keywords} />
    <header className="marketing-hero"><div className="marketing-shell">
      <Link href="/solutions" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400"><ArrowLeft className="h-4 w-4" />All focused solutions</Link>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.38fr] lg:items-end"><div><p className="marketing-eyebrow">{page.eyebrow}</p><h1 className="marketing-title max-w-5xl">{page.title}</h1></div><div><p className="text-lg leading-8 text-gray-300">{page.intro}</p><a href={getCalendlyUrl(`${page.slug}_hero`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("commercial_landing_cta", "lead", page.slug)} className="primary-cta mt-7">Book a Call <ArrowUpRight className="h-4 w-4" /></a></div></div>
    </div></header>

    <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section grid gap-12 lg:grid-cols-[0.36fr_0.64fr]">
      <div><p className="marketing-eyebrow">Who this is for</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">A focused engagement, not a generic package.</h2><p className="mt-6 leading-8 text-gray-300">{page.audience}</p></div>
      <div className="marketing-card p-7 sm:p-9"><div className="flex items-start gap-4"><CircleAlert aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-blue-400" /><div><h2 className="text-2xl font-bold">{page.painHeading}</h2><ul className="mt-6 space-y-4">{page.painPoints.map((item) => <li key={item} className="flex gap-3 leading-7 text-gray-300"><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-400" />{item}</li>)}</ul></div></div></div>
    </div></section>

    <section className="marketing-section"><div className="marketing-shell grid gap-12 lg:grid-cols-2">
      <div><p className="marketing-eyebrow">What the work can include</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Scope built around the responsible technical layer.</h2><ul className="mt-8 space-y-4">{page.deliverables.map((item) => <li key={item} className="marketing-card flex gap-4 p-5 leading-7 text-gray-300"><Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-green-400" />{item}</li>)}</ul></div>
      <div><p className="marketing-eyebrow">What changes</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Outcomes the team can actually use.</h2><div className="mt-8 space-y-4">{page.outcomes.map((item, index) => <article key={item} className="marketing-card p-6"><p className="text-sm font-semibold text-green-400">0{index + 1}</p><p className="mt-3 text-lg leading-8 text-gray-200">{item}</p></article>)}</div></div>
    </div></section>

    <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section"><div className="max-w-3xl"><p className="marketing-eyebrow">Delivery process</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Enough structure to protect the result.</h2></div><ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{page.process.map((step, index) => <li key={step.title} className="marketing-card p-6"><p className="text-sm font-semibold text-blue-400">Step {index + 1}</p><h3 className="mt-3 text-xl font-bold">{step.title}</h3><p className="mt-4 leading-7 text-gray-400">{step.description}</p></li>)}</ol></div></section>

    <section className="marketing-section"><div className="marketing-shell"><div className="marketing-card grid gap-7 p-7 sm:p-9 lg:grid-cols-[0.38fr_0.62fr] lg:items-center"><div><p className="marketing-eyebrow">Worldwide delivery</p><h2 className="mt-4 text-3xl font-bold">Cairo-based, built for international teams.</h2></div><p className="leading-8 text-gray-300">I work remotely with businesses and agencies across Egypt, the GCC, Europe, and the USA. Engagements use documented decisions, written progress updates, planned timezone overlap, and clear handover notes so location does not become a delivery risk.</p></div></div></section>

    <section className="marketing-section"><div className="marketing-shell grid gap-8 lg:grid-cols-[0.6fr_0.4fr]">
      <div className="marketing-card p-7 sm:p-9"><p className="marketing-eyebrow">Relevant experience</p><h2 className="mt-4 text-3xl font-bold">Evidence before promises.</h2><p className="mt-6 leading-8 text-gray-300">{page.proof}</p><div className="mt-7 flex flex-wrap gap-4">{page.relatedCaseStudy && <Link href={`/work/${page.relatedCaseStudy.slug}`} className="primary-cta">{page.relatedCaseStudy.title} <ArrowRight className="h-4 w-4" /></Link>}<Link href="/portfolio" className="secondary-cta">Browse projects <ArrowRight className="h-4 w-4" /></Link></div></div>
      <aside className="marketing-card p-7 sm:p-9"><p className="marketing-eyebrow">Broader service</p><h2 className="mt-4 text-2xl font-bold">Need a wider scope?</h2><p className="mt-4 leading-7 text-gray-400">Review the parent service for adjacent implementation, recovery, and ongoing support work.</p><Link href={`/services/${page.relatedService.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-green-400">{page.relatedService.title} <ArrowRight className="h-4 w-4" /></Link></aside>
    </div></section>

    <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section grid gap-10 lg:grid-cols-[0.34fr_0.66fr]"><div><p className="marketing-eyebrow">Frequently asked</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Before we scope it.</h2></div><div className="space-y-4">{page.faqs.map((faq) => <details key={faq.question} className="marketing-card group p-6"><summary className="cursor-pointer list-none font-semibold">{faq.question}<span className="float-right text-green-400">+</span></summary><p className="mt-4 leading-7 text-gray-400">{faq.answer}</p></details>)}</div></div></section>

    <section className="marketing-section"><div className="marketing-shell"><div className="marketing-card p-8 text-center sm:p-12"><h2 className="text-3xl font-bold sm:text-4xl">Bring the current problem, not a perfect brief.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">Share what is happening now, who it affects, and what a successful outcome would change.</p><div className="mt-8 flex flex-wrap justify-center gap-4"><a href={getCalendlyUrl(`${page.slug}_bottom`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("commercial_landing_cta", "lead", `${page.slug}_bottom`)} className="primary-cta">Book a Call <ArrowUpRight className="h-4 w-4" /></a><Link href="/contact" className="secondary-cta">Send project details <ArrowRight className="h-4 w-4" /></Link></div></div></div></section>

    <section className="border-t border-gray-800"><div className="marketing-shell py-16"><p className="marketing-eyebrow">Related solutions</p><div className="mt-7 grid gap-4 md:grid-cols-3">{relatedPages.map((candidate) => <Link key={candidate.slug} href={`/solutions/${candidate.slug}`} className="marketing-card group p-6"><h2 className="text-lg font-bold">{candidate.title}</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-400">View solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></div></section>
  </MarketingLayout>;
}

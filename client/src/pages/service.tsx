import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import type { Service } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl } from "@/lib/leadLinks";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useQuery<Service>({ queryKey: [`/api/services/${slug}`] });
  if (isLoading) return <MarketingLayout><div className="marketing-shell min-h-[60vh] py-24 text-gray-400">Loading…</div></MarketingLayout>;
  if (isError || !service) return <MarketingLayout><div className="marketing-shell min-h-[60vh] py-24"><h1 className="text-5xl font-bold">Service not found.</h1><Link href="/services" className="mt-8 inline-flex text-green-400">Back to services</Link></div></MarketingLayout>;

  return <MarketingLayout>
    <SEO title={service.seoTitle} description={service.seoDescription} canonicalPath={`/services/${service.slug}`} />
    <header className="marketing-hero"><div className="marketing-shell"><Link href="/services" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400"><ArrowLeft className="h-4 w-4" />All services</Link><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-end"><div><p className="marketing-eyebrow">{service.eyebrow}</p><h1 className="marketing-title">{service.title}</h1></div><div><p className="text-lg leading-8 text-gray-300">{service.shortDescription}</p><a href={getCalendlyUrl(`${service.slug}_hero`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("service_inquiry_click", "lead", service.slug)} className="primary-cta mt-7">Book a Call <ArrowUpRight className="h-4 w-4" /></a></div></div></div></header>
    <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section"><div className="grid gap-5 lg:grid-cols-3">{[["Who it’s for", service.audience], ["What’s going wrong", service.problem], ["Where we’re heading", service.outcome]].map(([label, copy]) => <article key={label} className="marketing-card p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-400">{label}</p><p className="mt-4 leading-7 text-gray-300">{copy}</p></article>)}</div></div></section>
    <section className="marketing-section"><div className="marketing-shell grid gap-12 lg:grid-cols-[0.4fr_0.6fr]"><div><p className="marketing-eyebrow">What the work can include</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">A scope shaped around the real problem.</h2><p className="mt-5 leading-7 text-gray-400">{service.description}</p></div><ul className="marketing-card divide-y divide-gray-800 px-6">{service.deliverables.map((item) => <li key={item} className="flex gap-4 py-5 text-gray-300"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />{item}</li>)}</ul></div></section>
    {service.faqs.length > 0 && <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section"><div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr]"><div><p className="marketing-eyebrow">Straight answers</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Before we scope it.</h2></div><div className="space-y-4">{service.faqs.map((faq) => <details key={faq.question} className="marketing-card group p-6"><summary className="cursor-pointer list-none font-semibold">{faq.question}<span className="float-right text-green-400">+</span></summary><p className="mt-4 leading-7 text-gray-400">{faq.answer}</p></details>)}</div></div></div></section>}
    <section className="marketing-section"><div className="marketing-shell"><div className="marketing-card p-8 text-center sm:p-12"><h2 className="text-3xl font-bold sm:text-4xl">Tell me what needs to work better.</h2><div className="mt-8 flex flex-wrap justify-center gap-4"><a href={getCalendlyUrl(`${service.slug}_bottom`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", `${service.slug}_bottom`)} className="primary-cta">Book a Call <ArrowUpRight className="h-4 w-4" /></a><Link href="/contact" className="secondary-cta">Send the details <ArrowRight className="h-4 w-4" /></Link></div></div></div></section>
  </MarketingLayout>;
}

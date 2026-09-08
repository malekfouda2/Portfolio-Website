import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";

export default function ServicesPage() {
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  return <MarketingLayout>
    <SEO title="Shopify, WordPress & Custom Software Services | Malek Fouda" description="Commercial development services covering Shopify, WordPress, WooCommerce, custom business systems, agency delivery, technical audits, performance, and support." canonicalPath="/services" />
    <header className="marketing-hero"><div className="marketing-shell text-center"><p className="marketing-eyebrow">Development services</p><h1 className="marketing-title">The technical help your <span className="gradient-text">business actually needs.</span></h1><p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">From e-commerce rescue work to custom operating systems, each engagement starts with the business problem and ends with dependable software.</p></div></header>
    <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section"><div className="grid gap-6 md:grid-cols-2">
      {services.map((service) => <Link key={service.id} href={`/services/${service.slug}`} className="marketing-card group p-6 transition hover:-translate-y-1 hover:border-green-400/50 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-400">{service.eyebrow}</p><h2 className="mt-4 text-2xl font-bold">{service.title}</h2><p className="mt-4 leading-7 text-gray-400">{service.shortDescription}</p><span className="mt-6 inline-flex items-center gap-2 font-semibold text-green-400">View service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}
    </div></div></section>
    <section className="marketing-section"><div className="marketing-shell"><div className="marketing-card mx-auto max-w-4xl p-8 text-center sm:p-12"><h2 className="text-3xl font-bold sm:text-4xl">Not sure how to describe the scope?</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">Tell me what is failing, costing time, or blocking growth. That is enough to start a useful technical conversation.</p><div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/contact" className="primary-cta">Describe the problem <ArrowRight className="h-4 w-4" /></Link><a href="https://calendly.com/malekfouda2000/30min" target="_blank" rel="noopener noreferrer" className="secondary-cta">Book a Call <ArrowUpRight className="h-4 w-4" /></a></div></div></div></section>
  </MarketingLayout>;
}

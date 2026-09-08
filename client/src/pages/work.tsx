import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { CaseStudy } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";

export default function WorkPage() {
  const { data: caseStudies = [] } = useQuery<CaseStudy[]>({ queryKey: ["/api/case-studies"] });

  return <MarketingLayout>
    <SEO title="Software Development Case Studies | Malek Fouda" description="Detailed case studies covering Shopify, custom platforms, integrations, operational systems, and measurable delivery outcomes." canonicalPath="/work" />
    <header className="marketing-hero"><div className="marketing-shell text-center"><p className="marketing-eyebrow">Software case studies</p><h1 className="marketing-title">The decisions behind <span className="gradient-text">delivered digital products.</span></h1><p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">Detailed breakdowns of the business problem, technical approach, delivered solution, and verified outcomes behind selected client engagements.</p></div></header>
    {caseStudies.length > 0 && <section className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section"><p className="marketing-eyebrow">Case studies</p><div className="mt-8 grid gap-6 md:grid-cols-2">{caseStudies.map((study) => <Link key={study.id} href={`/work/${study.slug}`} className="marketing-card group p-7 transition hover:-translate-y-1 hover:border-green-400/50"><p className="text-sm text-green-400">{study.industry}</p><h2 className="mt-3 text-2xl font-bold">{study.title}</h2><p className="mt-4 leading-7 text-gray-400">{study.summary}</p><span className="mt-6 inline-flex items-center gap-2 font-semibold text-green-400">Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></div></section>}
    <section className="marketing-section"><div className="marketing-shell"><div className="marketing-card mx-auto max-w-4xl p-8 text-center sm:p-12"><h2 className="text-3xl font-bold sm:text-4xl">Looking for the complete project archive?</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">Browse all commercial, freelance, and personal projects, including the technologies used and live links where available.</p><Link href="/portfolio" className="primary-cta mt-8">View all projects <ArrowRight className="h-4 w-4" /></Link></div></div></section>
  </MarketingLayout>;
}

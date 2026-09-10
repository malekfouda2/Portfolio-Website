import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { commercialLandingPages } from "@shared/commercialLandingPages";

const featuredSlugs = new Set([
  "shopify-api-integration-developer",
  "woocommerce-checkout-payment-shipping",
  "website-technical-audit",
]);

export default function SolutionsPreview() {
  const featured = commercialLandingPages.filter((page) => featuredSlugs.has(page.slug));

  return <section className="relative bg-gray-950/70 py-16 sm:py-20" aria-labelledby="solutions-heading">
    <div className="container mx-auto px-4 sm:px-6"><div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
        <div><p className="marketing-eyebrow">Start with the problem</p><h2 id="solutions-heading" className="mt-4 text-4xl font-bold sm:text-5xl">Focused help for costly technical blockers.</h2></div>
        <div><p className="leading-8 text-gray-300">Choose the issue closest to what is happening now. Each engagement starts with diagnosis and is scoped around the responsible technical layer.</p><Link href="/solutions" className="mt-5 inline-flex items-center gap-2 font-semibold text-green-400">Browse every solution <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{featured.map((page) => <Link key={page.slug} href={`/solutions/${page.slug}`} className="marketing-card group p-6 transition hover:-translate-y-1 hover:border-green-400/50"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">{page.eyebrow}</p><h3 className="mt-4 text-xl font-bold">{page.title}</h3><p className="mt-4 line-clamp-4 leading-7 text-gray-400">{page.intro}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-400">See how I can help <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div>
    </div></div>
  </section>;
}

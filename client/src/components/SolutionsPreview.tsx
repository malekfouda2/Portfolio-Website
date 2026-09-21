import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import SectionHead from "./design/SectionHead";
import ProblemIndex from "./design/ProblemIndex";
import { sceneFor } from "./art/Scenes";

const featuredSlugs = new Set([
  "shopify-api-integration-developer",
  "woocommerce-checkout-payment-shipping",
  "website-technical-audit",
]);

export default function SolutionsPreview() {
  const featured = commercialLandingPages.filter((page) => featuredSlugs.has(page.slug));

  return <section id="solutions" className="section border-t border-white/10" aria-labelledby="solutions-heading">
    <div className="shell">
      <SectionHead
        id="solutions-heading"
        tag="Start with the problem"
        title="Focused help for costly technical blockers."
        gradientFrom={3}
        intro="Choose the issue closest to what is happening now. Each engagement starts with diagnosis and is scoped around the responsible technical layer."
        aside={<Link href="/solutions" className="text-link">Browse every solution <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>}
      />
      <ProblemIndex
        className="mt-14"
        items={featured.map((page) => ({ href: `/solutions/${page.slug}`, eyebrow: page.eyebrow, title: page.title, body: page.intro, action: "See how I can help", art: sceneFor(page.slug) }))}
      />
    </div>
  </section>;
}

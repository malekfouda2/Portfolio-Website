import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { CaseStudy } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import ImageWithFallback from "@/components/ImageWithFallback";
import PageHero from "@/components/design/PageHero";
import CtaBand from "@/components/design/CtaBand";
import Chevron from "@/components/design/Chevron";
import Tilt from "@/components/design/Tilt";
import WaveText from "@/components/design/WaveText";
import ScreenshotStack from "@/components/art/ScreenshotStack";

export default function WorkPage() {
  const { data: caseStudies = [] } = useQuery<CaseStudy[]>({ queryKey: ["/api/case-studies"] });

  return <MarketingLayout>
    <SEO title="Software Development Case Studies | Malek Fouda" description="Detailed case studies covering Shopify, custom platforms, integrations, operational systems, and measurable delivery outcomes." canonicalPath="/work" />
    <PageHero
      tag="Software case studies"
      title="The decisions behind delivered digital products."
      gradientFrom={3}
      intro="Detailed breakdowns of the business problem, technical approach, delivered solution, and verified outcomes behind selected client engagements."
      art={caseStudies.length > 0 ? <ScreenshotStack shots={caseStudies.map((study) => ({ src: study.image, alt: study.title }))} /> : undefined}
    />

    {caseStudies.length > 0 && <section className="pb-20 sm:pb-28" aria-labelledby="case-studies-heading">
      <div className="shell">
        <h2 id="case-studies-heading" className="tag">Case studies</h2>
        <ul className="mt-8 space-y-6">
          {caseStudies.map((study, index) => (
            <li key={study.id}>
              <Link href={`/work/${study.slug}`} className="group grid items-center gap-8 rounded-[2rem] border border-white/10 p-5 transition-colors duration-300 hover:border-white/25 sm:p-7 lg:grid-cols-2 lg:gap-14">
                <Tilt max={4} className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="overflow-hidden rounded-[1.4rem] border border-white/10">
                    <ImageWithFallback src={study.image} alt="" fallbackText={study.title} className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                  </div>
                </Tilt>
                <div className="lg:py-6">
                  <p className="text-sm font-semibold text-signal">{study.industry}</p>
                  <WaveText as="h3" text={study.title} className="display mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] [font-stretch:108%] leading-[1.04] transition-colors duration-300 group-hover:text-signal" />
                  <p className="mt-5 leading-8 text-fog">{study.summary}</p>
                  <span className="mt-7 inline-flex items-center gap-3 font-semibold text-bone">
                    Read case study
                    <Chevron side="right" tone="gradient" strokeWidth={32} className="h-4 w-auto transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-2" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>}

    <CtaBand title="Looking for the complete project archive?" body="Browse all commercial, freelance, and personal projects, including the technologies used and live links where available.">
      <Link href="/portfolio" className="btn btn-void">View all projects <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    </CtaBand>
  </MarketingLayout>;
}

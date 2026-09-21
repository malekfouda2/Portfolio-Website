import { ArrowLeft, ArrowUpRight, BookOpen, CircleAlert, Compass, Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import type { CaseStudy } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import ImageWithFallback from "@/components/ImageWithFallback";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import SectionHead from "@/components/design/SectionHead";
import Chevron from "@/components/design/Chevron";
import RevealText from "@/components/design/RevealText";
import { PageLoading, PageMissing } from "@/components/design/PageState";
import { caseStudyMedia, type CaseStudyMediaGroup } from "@/lib/caseStudyMedia";

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: study, isLoading, isError } = useQuery<CaseStudy>({ queryKey: [`/api/case-studies/${slug}`] });
  if (isLoading) return <MarketingLayout><PageLoading /></MarketingLayout>;
  if (isError || !study) return <MarketingLayout><PageMissing title="Case study not found."><Link href="/work" className="btn btn-line"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to work</Link></PageMissing></MarketingLayout>;
  const mediaGroups = caseStudyMedia[study.slug] || fallbackMedia(study);

  return <MarketingLayout>
    <SEO title={study.seoTitle} description={study.seoDescription} canonicalPath={`/work/${study.slug}`} type="article" image={study.image || undefined} imageAlt={`${study.title} case study interface`} />
    <article>
      <PageHero back={{ href: "/work", label: "All work" }} tag={`${study.industry} / case study`} title={study.title} intro={study.summary} />

      {study.image && <div className="shell">
        <div className="overflow-hidden rounded-[2rem] border border-white/10">
          <ImageWithFallback src={study.image} alt={`${study.title} case study`} className="aspect-[16/9] w-full object-cover object-top" fallbackText={study.title} loading="eager" />
        </div>
      </div>}

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20">
          <aside className="h-fit space-y-7 border-t border-white/10 pt-7 lg:sticky lg:top-28">
            <Meta label="Client" value={study.clientName} />
            <Meta label="Role" value={study.role} />
            <div>
              <p className="text-sm font-semibold text-signal">Technology</p>
              <ul className="mt-3 flex flex-wrap gap-2">{study.technologies.map((tech) => <li key={tech} className="chip">{tech}</li>)}</ul>
            </div>
            {study.liveUrl && <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-signal w-full">Visit project <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>}
          </aside>

          <div className="space-y-16">
            {([["Context", study.context, BookOpen], ["The problem", study.problem, CircleAlert], ["Approach", study.approach, Compass], ["Solution", study.solution, Lightbulb]] as const).map(([title, copy, Icon]) => (
              <section key={title} className="border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--signal),var(--flow))] text-black"><Icon className="h-6 w-6" /></span>
                  <RevealText text={title} gradientFrom={0} className="display-m" />
                </div>
                <p className="mt-6 max-w-[68ch] whitespace-pre-line text-lg leading-8 text-bone/85">{copy}</p>
              </section>
            ))}
            {study.challenges.length > 0 && <ListSection title="Important challenges" items={study.challenges} />}
            {study.results.length > 0 && <ListSection title="Verified outcomes" items={study.results} />}
          </div>
        </div>
      </section>
      {mediaGroups.length > 0 && <ProductEvidence groups={mediaGroups} coverImage={study.image} />}
    </article>
  </MarketingLayout>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm font-semibold text-signal">{label}</p><p className="mt-2 leading-7 text-bone/85">{value || "—"}</p></div>;
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return <section className="border-t border-white/10 pt-8">
    <RevealText text={title} gradientFrom={0} className="display-m" />
    <ul className="mt-7 border-b border-white/10">
      {items.map((item) => (
        <li key={item} className="flex gap-5 border-t border-white/10 py-5 text-lg leading-8 text-bone/85">
          <Chevron side="right" tone="gradient" strokeWidth={30} className="mt-2.5 h-4 w-auto shrink-0" />{item}
        </li>
      ))}
    </ul>
  </section>;
}

function fallbackMedia(study: CaseStudy): CaseStudyMediaGroup[] {
  if (!study.screenshots.length) return [];
  return [{ title: "Product gallery", description: "Selected screens from the delivered product.", items: study.screenshots.map((src, index) => ({ src, alt: `${study.title} screenshot ${index + 1}`, caption: `Product screen ${index + 1}` })) }];
}

function ProductEvidence({ groups, coverImage }: { groups: CaseStudyMediaGroup[]; coverImage: string | null }) {
  return <section id="product-evidence" className="section border-t border-white/10">
    <div className="shell">
      <SectionHead tag="Product evidence" title="Inside the delivered system" gradientFrom={3} intro="Selected interface states captured from the working implementation." />
      <div className="mt-16 space-y-20">
        {groups.map((group, groupIndex) => {
          const items = group.items.filter((item) => !(groupIndex === 0 && item.src === coverImage));
          if (!items.length) return null;
          return <section key={group.title}>
            <div className="mb-8 max-w-3xl">
              <h3 className="display-s">{group.title}</h3>
              <p className="mt-3 leading-7 text-fog">{group.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((item) => (
                <figure key={item.src} className="group overflow-hidden rounded-[1.5rem] border border-white/10">
                  <a href={item.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
                    <ImageWithFallback src={item.src} alt={item.alt} className="aspect-[72/49] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" fallbackText={item.alt} />
                  </a>
                  <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-fog">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>;
        })}
      </div>
    </div>
  </section>;
}

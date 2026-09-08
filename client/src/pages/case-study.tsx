import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import type { CaseStudy } from "@shared/schema";
import MarketingLayout from "@/components/MarketingLayout";
import ImageWithFallback from "@/components/ImageWithFallback";
import SEO from "@/components/SEO";
import { caseStudyMedia, type CaseStudyMediaGroup } from "@/lib/caseStudyMedia";

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: study, isLoading, isError } = useQuery<CaseStudy>({ queryKey: [`/api/case-studies/${slug}`] });
  if (isLoading) return <MarketingLayout><div className="marketing-shell min-h-[60vh] py-24 text-gray-400">Loading…</div></MarketingLayout>;
  if (isError || !study) return <MarketingLayout><div className="marketing-shell min-h-[60vh] py-24"><h1 className="text-5xl font-bold">Case study not found.</h1><Link href="/work" className="mt-8 inline-flex text-green-400">Back to work</Link></div></MarketingLayout>;
  const mediaGroups = caseStudyMedia[study.slug] || fallbackMedia(study);

  return <MarketingLayout>
    <SEO title={study.seoTitle} description={study.seoDescription} canonicalPath={`/work/${study.slug}`} type="article" image={study.image || undefined} imageAlt={`${study.title} case study interface`} />
    <article>
      <header className="marketing-hero"><div className="marketing-shell"><Link href="/work" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400"><ArrowLeft className="h-4 w-4" />All work</Link><p className="marketing-eyebrow mt-12">{study.industry} / case study</p><h1 className="marketing-title max-w-5xl">{study.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300">{study.summary}</p></div></header>
      {study.image && <section className="border-y border-gray-800 bg-gray-950/70 py-12"><div className="marketing-shell"><div className="overflow-hidden rounded-2xl border border-gray-800"><ImageWithFallback src={study.image} alt={`${study.title} case study`} className="aspect-[16/9] w-full object-cover" fallbackText={study.title} /></div></div></section>}
      <section className="marketing-section"><div className="marketing-shell grid gap-8 lg:grid-cols-[0.3fr_0.7fr]">
        <aside className="marketing-card h-fit space-y-6 p-6 lg:sticky lg:top-28"><Meta label="Client" value={study.clientName} /><Meta label="Role" value={study.role} /><Meta label="Technology" value={study.technologies.join(" · ")} />{study.liveUrl && <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="primary-cta w-full">Visit project <ArrowUpRight className="h-4 w-4" /></a>}</aside>
        <div className="space-y-6">{[["Context", study.context], ["The problem", study.problem], ["Approach", study.approach], ["Solution", study.solution]].map(([title, copy]) => <section key={title} className="marketing-card p-7 sm:p-9"><h2 className="text-2xl font-bold"><span className="gradient-text">{title}</span></h2><p className="mt-5 whitespace-pre-line leading-8 text-gray-300">{copy}</p></section>)}
          {study.challenges.length > 0 && <ListSection title="Important challenges" items={study.challenges} />}
          {study.results.length > 0 && <ListSection title="Verified outcomes" items={study.results} />}
        </div>
      </div></section>
      {mediaGroups.length > 0 && <ProductEvidence groups={mediaGroups} coverImage={study.image} />}
    </article>
  </MarketingLayout>;
}

function Meta({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-400">{label}</p><p className="mt-2 leading-7 text-gray-300">{value || "—"}</p></div>; }
function ListSection({ title, items }: { title: string; items: string[] }) { return <section className="marketing-card p-7 sm:p-9"><h2 className="text-2xl font-bold"><span className="gradient-text">{title}</span></h2><ul className="mt-6 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 leading-7 text-gray-300"><Check className="mt-1 h-5 w-5 shrink-0 text-green-400" />{item}</li>)}</ul></section>; }

function fallbackMedia(study: CaseStudy): CaseStudyMediaGroup[] {
  if (!study.screenshots.length) return [];
  return [{ title: "Product gallery", description: "Selected screens from the delivered product.", items: study.screenshots.map((src, index) => ({ src, alt: `${study.title} screenshot ${index + 1}`, caption: `Product screen ${index + 1}` })) }];
}

function ProductEvidence({ groups, coverImage }: { groups: CaseStudyMediaGroup[]; coverImage: string | null }) {
  return <section id="product-evidence" className="border-y border-gray-800 bg-gray-950/70"><div className="marketing-shell marketing-section"><div className="mb-12 text-center"><p className="marketing-eyebrow">Product evidence</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Inside the delivered platform</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">Real interface states captured from the working Aiqda application.</p></div><div className="space-y-16">
    {groups.map((group, groupIndex) => {
      const items = group.items.filter((item) => !(groupIndex === 0 && item.src === coverImage));
      if (!items.length) return null;
      return <section key={group.title}><div className="mb-7 max-w-3xl"><h3 className="text-2xl font-bold"><span className="gradient-text">{group.title}</span></h3><p className="mt-3 leading-7 text-gray-400">{group.description}</p></div><div className="grid gap-6 md:grid-cols-2">{items.map((item) => <figure key={item.src} className="marketing-card overflow-hidden"><a href={item.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden"><ImageWithFallback src={item.src} alt={item.alt} className="aspect-[72/49] w-full object-cover object-top transition duration-500 hover:scale-[1.02]" fallbackText={item.alt} /></a><figcaption className="border-t border-gray-800 px-5 py-4 text-sm leading-6 text-gray-400">{item.caption}</figcaption></figure>)}</div></section>;
    })}
  </div></div></section>;
}

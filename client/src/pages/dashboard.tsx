import { useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, FolderOpen, LogOut, MessageSquare, Plus, Save, Settings2, Trash2, X } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CaseStudy, Contact, Project, Service, ServiceFaq } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

type Tab = "overview" | "services" | "case-studies" | "projects" | "leads";
const tabs: { id: Tab; label: string; icon: typeof Settings2 }[] = [
  { id: "overview", label: "Overview", icon: Settings2 },
  { id: "services", label: "Services", icon: BriefcaseBusiness },
  { id: "case-studies", label: "Case studies", icon: FileText },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "leads", label: "Leads", icon: MessageSquare },
];

const inputClass = "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-600";
const cardClass = "rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6";

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function useProtectedDashboard() {
  const [, setLocation] = useLocation();
  const token = localStorage.getItem("auth_token");
  useEffect(() => { if (!token) setLocation("/login"); }, [setLocation, token]);
  return Boolean(token);
}

function ServicesManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/admin/services"] });
  const [draft, setDraft] = useState<Partial<Service> | null>(null);
  const save = useMutation({
    mutationFn: async (value: Partial<Service>) => {
      const response = await apiRequest(value.id ? "PUT" : "POST", value.id ? `/api/admin/services/${value.id}` : "/api/admin/services", value);
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] }); queryClient.invalidateQueries({ queryKey: ["/api/services"] }); setDraft(null); toast({ title: "Service saved" }); },
    onError: (error) => toast({ title: "Could not save service", description: error instanceof Error ? error.message : undefined, variant: "destructive" }),
  });

  const createDraft = () => setDraft({ slug: "", title: "", eyebrow: "", shortDescription: "", description: "", audience: "", problem: "", outcome: "", deliverables: [], faqs: [], icon: "code", isFeatured: false, isPublished: false, sortOrder: services.length + 1, seoTitle: "", seoDescription: "" });

  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h2 className="text-2xl font-semibold">Services</h2><p className="mt-1 text-sm text-zinc-500">Manage service copy, SEO, ordering, and publication.</p></div><Button onClick={createDraft} className="bg-emerald-300 text-black hover:bg-emerald-200"><Plus className="mr-2 h-4 w-4" />Add service</Button></div>
    {draft && <form onSubmit={(event) => { event.preventDefault(); save.mutate(draft); }} className={cardClass}>
      <div className="mb-6 flex items-center justify-between"><h3 className="text-lg font-semibold">{draft.id ? "Edit service" : "New service"}</h3><Button type="button" variant="ghost" onClick={() => setDraft(null)}><X className="h-4 w-4" /></Button></div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title"><Input required className={inputClass} value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <Field label="Slug"><Input required className={inputClass} value={draft.slug || ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} /></Field>
        <Field label="Eyebrow"><Input required className={inputClass} value={draft.eyebrow || ""} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} /></Field>
        <Field label="Icon key"><Input required className={inputClass} value={draft.icon || ""} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} /></Field>
        <Field label="Short description" wide><Textarea required rows={3} className={inputClass} value={draft.shortDescription || ""} onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })} /></Field>
        <Field label="Full description" wide><Textarea required rows={4} className={inputClass} value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
        <Field label="Audience"><Textarea required rows={3} className={inputClass} value={draft.audience || ""} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} /></Field>
        <Field label="Problem"><Textarea required rows={3} className={inputClass} value={draft.problem || ""} onChange={(e) => setDraft({ ...draft, problem: e.target.value })} /></Field>
        <Field label="Outcome" wide><Textarea required rows={3} className={inputClass} value={draft.outcome || ""} onChange={(e) => setDraft({ ...draft, outcome: e.target.value })} /></Field>
        <Field label="Deliverables — one per line" wide><Textarea required rows={6} className={inputClass} value={(draft.deliverables || []).join("\n")} onChange={(e) => setDraft({ ...draft, deliverables: splitLines(e.target.value) })} /></Field>
        <Field label="FAQs — one question | answer per line" wide><Textarea rows={6} className={inputClass} value={(draft.faqs || []).map((faq) => `${faq.question} | ${faq.answer}`).join("\n")} onChange={(e) => setDraft({ ...draft, faqs: splitLines(e.target.value).map((line): ServiceFaq => { const [question, ...answer] = line.split("|"); return { question: question.trim(), answer: answer.join("|").trim() }; }).filter((faq) => faq.question && faq.answer) })} /></Field>
        <Field label="SEO title"><Input required className={inputClass} value={draft.seoTitle || ""} onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })} /></Field>
        <Field label="SEO description"><Textarea required rows={3} className={inputClass} value={draft.seoDescription || ""} onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })} /></Field>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-5"><Checkbox label="Featured" checked={Boolean(draft.isFeatured)} onChange={(checked) => setDraft({ ...draft, isFeatured: checked })} /><Checkbox label="Published" checked={Boolean(draft.isPublished)} onChange={(checked) => setDraft({ ...draft, isPublished: checked })} /><Field label="Sort order"><Input type="number" className={`${inputClass} w-28`} value={draft.sortOrder || 0} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></Field><Button type="submit" disabled={save.isPending} className="ml-auto bg-emerald-300 text-black hover:bg-emerald-200"><Save className="mr-2 h-4 w-4" />Save</Button></div>
    </form>}
    <div className="grid gap-3">{services.map((service) => <button key={service.id} onClick={() => setDraft(service)} className={`${cardClass} text-left transition hover:border-emerald-300/30`}><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-emerald-300">{service.eyebrow}</p><h3 className="mt-2 font-semibold">{service.title}</h3><p className="mt-2 text-sm text-zinc-500">/services/{service.slug}</p></div><Status published={service.isPublished} /></div></button>)}</div>
  </div>;
}

function CaseStudiesManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: studies = [] } = useQuery<CaseStudy[]>({ queryKey: ["/api/admin/case-studies"] });
  const [draft, setDraft] = useState<Partial<CaseStudy> | null>(null);
  const save = useMutation({ mutationFn: async (value: Partial<CaseStudy>) => { const response = await apiRequest(value.id ? "PUT" : "POST", value.id ? `/api/admin/case-studies/${value.id}` : "/api/admin/case-studies", value); return response.json(); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/case-studies"] }); queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] }); setDraft(null); toast({ title: "Case study saved" }); }, onError: (error) => toast({ title: "Could not save case study", description: error instanceof Error ? error.message : undefined, variant: "destructive" }) });
  const createDraft = () => setDraft({ slug: "", title: "", clientName: "", industry: "", summary: "", context: "", problem: "", role: "", approach: "", solution: "", challenges: [], results: [], technologies: [], screenshots: [], serviceSlugs: [], image: null, liveUrl: null, isFeatured: false, isPublished: false, sortOrder: studies.length + 1, seoTitle: "", seoDescription: "" });
  const text = (field: keyof CaseStudy, label: string, rows = 3) => <Field label={label} wide><Textarea rows={rows} className={inputClass} value={String(draft?.[field] || "")} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} /></Field>;
  const lines = (field: "challenges" | "results" | "technologies" | "screenshots" | "serviceSlugs", label: string) => <Field label={label} wide><Textarea rows={4} className={inputClass} value={(draft?.[field] || []).join("\n")} onChange={(e) => setDraft({ ...draft, [field]: splitLines(e.target.value) })} /></Field>;
  return <div className="space-y-5"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-semibold">Case studies</h2><p className="mt-1 text-sm text-zinc-500">Drafts stay invisible until every claim and asset is approved.</p></div><Button onClick={createDraft} className="bg-emerald-300 text-black hover:bg-emerald-200"><Plus className="mr-2 h-4 w-4" />Add case study</Button></div>
    {draft && <form onSubmit={(event) => { event.preventDefault(); save.mutate(draft); }} className={cardClass}><div className="mb-6 flex items-center justify-between"><h3 className="text-lg font-semibold">{draft.id ? "Edit case study" : "New case study"}</h3><Button type="button" variant="ghost" onClick={() => setDraft(null)}><X className="h-4 w-4" /></Button></div><div className="grid gap-5 md:grid-cols-2">
      <Field label="Title"><Input required className={inputClass} value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Slug"><Input required className={inputClass} value={draft.slug || ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} /></Field><Field label="Client"><Input required className={inputClass} value={draft.clientName || ""} onChange={(e) => setDraft({ ...draft, clientName: e.target.value })} /></Field><Field label="Industry"><Input className={inputClass} value={draft.industry || ""} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} /></Field>
      {text("summary", "Summary", 4)}{text("context", "Client context", 5)}{text("problem", "Problem", 5)}{text("role", "Role and responsibilities", 4)}{text("approach", "Approach", 6)}{text("solution", "Solution", 6)}{lines("challenges", "Challenges — one per line")}{lines("results", "Verified results — one per line")}{lines("technologies", "Technologies — one per line")}{lines("serviceSlugs", "Related service slugs — one per line")}{lines("screenshots", "Screenshot URLs — one per line")}
      <Field label="Cover image URL"><Input className={inputClass} value={draft.image || ""} onChange={(e) => setDraft({ ...draft, image: e.target.value || null })} /></Field><Field label="Live URL"><Input className={inputClass} value={draft.liveUrl || ""} onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value || null })} /></Field><Field label="SEO title"><Input className={inputClass} value={draft.seoTitle || ""} onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })} /></Field><Field label="SEO description"><Textarea rows={3} className={inputClass} value={draft.seoDescription || ""} onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })} /></Field>
    </div><div className="mt-5 flex flex-wrap items-center gap-5"><Checkbox label="Featured" checked={Boolean(draft.isFeatured)} onChange={(checked) => setDraft({ ...draft, isFeatured: checked })} /><Checkbox label="Published" checked={Boolean(draft.isPublished)} onChange={(checked) => setDraft({ ...draft, isPublished: checked })} /><Field label="Sort order"><Input type="number" className={`${inputClass} w-28`} value={draft.sortOrder || 0} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></Field><Button type="submit" disabled={save.isPending} className="ml-auto bg-emerald-300 text-black"><Save className="mr-2 h-4 w-4" />Save</Button></div></form>}
    <div className="grid gap-3">{studies.map((study) => <button key={study.id} onClick={() => setDraft(study)} className={`${cardClass} text-left hover:border-emerald-300/30`}><div className="flex items-center justify-between"><div><h3 className="font-semibold">{study.title}</h3><p className="mt-2 text-sm text-zinc-500">/work/{study.slug}</p></div><Status published={study.isPublished} /></div></button>)}</div>
  </div>;
}

function ProjectsManager() {
  const queryClient = useQueryClient(); const { toast } = useToast();
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"] });
  const [draft, setDraft] = useState<Partial<Project> | null>(null);
  const save = useMutation({ mutationFn: async (value: Partial<Project>) => { const response = await apiRequest(value.id ? "PUT" : "POST", value.id ? `/api/admin/projects/${value.id}` : "/api/admin/projects", value); return response.json(); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] }); queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); setDraft(null); toast({ title: "Project saved" }); } });
  return <div className="space-y-5"><div><h2 className="text-2xl font-semibold">Projects</h2><p className="mt-1 text-sm text-zinc-500">Maintain the project archive used across the public work pages.</p></div>{draft && <form onSubmit={(event) => { event.preventDefault(); save.mutate(draft); }} className={cardClass}><div className="grid gap-5 md:grid-cols-2"><Field label="Title"><Input className={inputClass} value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Type"><Input className={inputClass} value={draft.type || ""} onChange={(e) => setDraft({ ...draft, type: e.target.value })} /></Field><Field label="Description" wide><Textarea rows={5} className={inputClass} value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field><Field label="Technologies — one per line" wide><Textarea rows={4} className={inputClass} value={(draft.technologies || []).join("\n")} onChange={(e) => setDraft({ ...draft, technologies: splitLines(e.target.value) })} /></Field><Field label="Image URL"><Input className={inputClass} value={draft.image || ""} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></Field><Field label="Live URL"><Input className={inputClass} value={draft.url || ""} onChange={(e) => setDraft({ ...draft, url: e.target.value || null })} /></Field><Field label="Company"><Input className={inputClass} value={draft.companyName || ""} onChange={(e) => setDraft({ ...draft, companyName: e.target.value || null })} /></Field><Field label="Role"><Input className={inputClass} value={draft.role || ""} onChange={(e) => setDraft({ ...draft, role: e.target.value || null })} /></Field></div><div className="mt-5 flex items-center"><Checkbox label="Visible" checked={Boolean(draft.isVisible)} onChange={(checked) => setDraft({ ...draft, isVisible: checked })} /><Button type="submit" className="ml-auto bg-emerald-300 text-black"><Save className="mr-2 h-4 w-4" />Save</Button></div></form>}<div className="grid gap-3">{projects.map((project) => <button key={project.id} onClick={() => setDraft(project)} className={`${cardClass} text-left hover:border-emerald-300/30`}><div className="flex items-center justify-between"><div><h3 className="font-semibold">{project.title}</h3><p className="mt-2 text-sm text-zinc-500">{project.companyName || project.type}</p></div><Status published={project.isVisible} /></div></button>)}</div></div>;
}

function LeadsManager() {
  const queryClient = useQueryClient(); const { toast } = useToast();
  const { data: leads = [] } = useQuery<Contact[]>({ queryKey: ["/api/admin/contacts"] });
  const update = useMutation({ mutationFn: async ({ id, status }: { id: number; status: string }) => { const response = await apiRequest("PUT", `/api/admin/contacts/${id}`, { status }); return response.json(); }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] }) });
  const remove = useMutation({ mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/contacts/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Lead removed" }); } });
  return <div className="space-y-5"><div><h2 className="text-2xl font-semibold">Qualified leads</h2><p className="mt-1 text-sm text-zinc-500">Review project fit, source, budget, timeline, and preferred follow-up.</p></div>{leads.length === 0 && <div className={cardClass}>No inquiries yet.</div>}{leads.map((lead) => <article key={lead.id} className={cardClass}><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><div className="flex flex-wrap items-center gap-3"><h3 className="text-lg font-semibold">{lead.name}</h3><span className="rounded-full bg-white/[0.07] px-3 py-1 text-xs text-zinc-400">{lead.status}</span></div><p className="mt-2 text-sm text-zinc-400">{lead.company} · <a href={`mailto:${lead.email}`} className="text-emerald-300">{lead.email}</a></p><div className="mt-5 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2"><p><span className="text-zinc-600">Project:</span> {lead.projectType || "—"}</p><p><span className="text-zinc-600">Budget:</span> {lead.budgetRange || "—"}</p><p><span className="text-zinc-600">Timeline:</span> {lead.timeline || "—"}</p><p><span className="text-zinc-600">Contact:</span> {lead.preferredContact || "—"}</p><p><span className="text-zinc-600">Source:</span> {lead.utmSource || lead.referrer || "Direct"}</p><p><span className="text-zinc-600">Received:</span> {new Date(lead.createdAt).toLocaleString()}</p></div><p className="mt-5 whitespace-pre-line rounded-xl bg-black/30 p-4 text-sm leading-6 text-zinc-300">{lead.message}</p></div><div className="flex shrink-0 gap-2 sm:flex-col"><Button variant="outline" onClick={() => update.mutate({ id: lead.id, status: "contacted" })}>Contacted</Button><Button variant="outline" onClick={() => update.mutate({ id: lead.id, status: "resolved" })}>Resolved</Button><Button variant="ghost" onClick={() => remove.mutate(lead.id)} className="text-red-300"><Trash2 className="h-4 w-4" /></Button></div></div></article>)}</div>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`block text-sm text-zinc-300 ${wide ? "md:col-span-2" : ""}`}><span className="mb-2 block font-medium">{label}</span>{children}</label>; }
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-emerald-300" />{label}</label>; }
function Status({ published }: { published: boolean }) { return <span className={`rounded-full px-3 py-1 text-xs font-medium ${published ? "bg-emerald-300/10 text-emerald-300" : "bg-amber-300/10 text-amber-300"}`}>{published ? "Published" : "Draft"}</span>; }

export default function Dashboard() {
  const authenticated = useProtectedDashboard();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/admin/services"], enabled: authenticated });
  const { data: studies = [] } = useQuery<CaseStudy[]>({ queryKey: ["/api/admin/case-studies"], enabled: authenticated });
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"], enabled: authenticated });
  const { data: leads = [] } = useQuery<Contact[]>({ queryKey: ["/api/admin/contacts"], enabled: authenticated });
  if (!authenticated) return <div className="min-h-screen bg-black p-8 text-white">Redirecting…</div>;
  const logout = () => { localStorage.removeItem("auth_token"); localStorage.removeItem("user"); setLocation("/login"); };
  return <><SEO title="Portfolio CMS | Malek Fouda" description="Private portfolio administration." canonicalPath="/dashboard" noIndex /><div className="min-h-screen bg-[#070909] text-white"><header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><div><h1 className="text-xl font-semibold">Portfolio CMS</h1><p className="mt-1 text-xs text-zinc-500">Content, proof, and qualified inquiries</p></div><Button variant="outline" onClick={logout}><LogOut className="mr-2 h-4 w-4" />Log out</Button></div></header><div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[14rem_1fr]"><nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Dashboard sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${tab === id ? "bg-emerald-300 text-black" : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"}`}><Icon className="h-4 w-4" />{label}</button>)}</nav><main>{tab === "overview" && <div><h2 className="text-3xl font-semibold">Overview</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Published services", services.filter((item) => item.isPublished).length], ["Case-study drafts", studies.filter((item) => !item.isPublished).length], ["Visible projects", projects.filter((item) => item.isVisible).length], ["New leads", leads.filter((item) => item.status === "new").length]].map(([label, value]) => <div key={String(label)} className={cardClass}><p className="text-sm text-zinc-500">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></div>)}</div><div className={`${cardClass} mt-6`}><h3 className="font-semibold">Publishing controls</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Case studies remain private until their Published control is enabled. Verify every result, client detail, screenshot, URL, SEO description, and confidentiality boundary before publishing.</p></div></div>}{tab === "services" && <ServicesManager />}{tab === "case-studies" && <CaseStudiesManager />}{tab === "projects" && <ProjectsManager />}{tab === "leads" && <LeadsManager />}</main></div></div></>;
}

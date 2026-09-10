import { useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Mail, MapPin, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";

const initialForm = { name: "", email: "", company: "", websiteUrl: "", projectType: "", message: "", budgetRange: "", timeline: "", preferredContact: "email" as "email" | "calendly" | "whatsapp" };
const fieldClass = "mt-2 w-full rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-green-400 focus:outline-none";
const labelClass = "block text-sm font-medium text-gray-300";

export default function Contact({ headingLevel = "h1" }: { headingLevel?: "h1" | "h2" }) {
  const [formData, setFormData] = useState(initialForm);
  const [successMessage, setSuccessMessage] = useState("");
  const started = useRef(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams(window.location.search);
      const response = await apiRequest("POST", "/api/contact", { ...formData, websiteUrl: formData.websiteUrl || null, landingPage: `${window.location.pathname}${window.location.search}`, referrer: document.referrer || null, utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign") });
      return response.json();
    },
    onSuccess: () => { trackEvent("contact_form_submit", "lead", "success"); setSuccessMessage("Thanks — I’ll review the details and reply within 24 hours."); setFormData(initialForm); started.current = false; },
    onError: () => trackEvent("contact_form_submit", "lead", "error"),
  });
  const update = (field: keyof typeof formData, value: string) => setFormData({ ...formData, [field]: value });
  const markStarted = () => { if (!started.current) { started.current = true; trackEvent("contact_form_start", "lead", window.location.pathname); } };

  const Heading = headingLevel;

  return <section id="contact" className="bg-black py-16 sm:py-20">
    <div className="container mx-auto px-4 sm:px-6"><div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center"><Heading className="text-4xl font-bold sm:text-5xl"><span className="text-white">Discuss Your</span><span className="gradient-text"> Project</span></Heading><div className="mx-auto mt-6 h-1 w-24 rounded bg-gradient-to-r from-green-400 to-blue-500" /><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">Tell me what needs to work better. You do not need a technical brief—business context, current problems, and the desired outcome are enough.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <form onSubmit={(event) => { event.preventDefault(); setSuccessMessage(""); mutation.mutate(); }} onFocus={markStarted} className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>Your name *<input required autoComplete="name" className={fieldClass} value={formData.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" /></label>
            <label className={labelClass}>Work email *<input required type="email" autoComplete="email" className={fieldClass} value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" /></label>
            <label className={labelClass}>Company *<input required autoComplete="organization" className={fieldClass} value={formData.company} onChange={(e) => update("company", e.target.value)} placeholder="Company or agency" /></label>
            <label className={labelClass}>Website or app URL<input type="url" className={fieldClass} value={formData.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} placeholder="https://" /></label>
            <label className={labelClass}>Project type *<select required className={fieldClass} value={formData.projectType} onChange={(e) => update("projectType", e.target.value)}><option value="">Choose one</option><option value="shopify">Shopify development or rescue</option><option value="wordpress-woocommerce">WordPress or WooCommerce</option><option value="custom-business-system">Custom business system</option><option value="white-label">White-label agency delivery</option><option value="audit-maintenance">Audit, maintenance, or recovery</option><option value="other">Something else</option></select></label>
            <label className={labelClass}>Approximate budget *<select required className={fieldClass} value={formData.budgetRange} onChange={(e) => update("budgetRange", e.target.value)}><option value="">Choose a range</option><option value="under-1000">Under $1,000</option><option value="1000-3000">$1,000–$3,000</option><option value="3000-7500">$3,000–$7,500</option><option value="7500-15000">$7,500–$15,000</option><option value="15000-plus">$15,000+</option><option value="guidance">Not sure yet</option></select></label>
            <label className={labelClass}>Desired timeline *<select required className={fieldClass} value={formData.timeline} onChange={(e) => update("timeline", e.target.value)}><option value="">Choose a timeline</option><option value="urgent">Urgent issue</option><option value="2-4-weeks">2–4 weeks</option><option value="1-2-months">1–2 months</option><option value="3-plus-months">3+ months</option><option value="flexible">Flexible / planning</option></select></label>
            <label className={labelClass}>Preferred contact *<select required className={fieldClass} value={formData.preferredContact} onChange={(e) => update("preferredContact", e.target.value)}><option value="email">Email</option><option value="calendly">Video call</option><option value="whatsapp">WhatsApp</option></select></label>
          </div>
          <label className={`${labelClass} mt-6`}>Project details *<textarea required minLength={10} maxLength={2000} rows={6} className={`${fieldClass} resize-y`} value={formData.message} onChange={(e) => update("message", e.target.value)} placeholder="What is happening now, and what would a successful outcome change?" /></label>
          <button type="submit" disabled={mutation.isPending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-6 py-4 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-50">{mutation.isPending ? "Sending…" : "Send project details"} <ArrowUpRight className="h-4 w-4" /></button>
          <div aria-live="polite" className="mt-5 text-sm">{successMessage && <p className="rounded-lg border border-green-400/30 bg-green-400/10 p-4 text-green-300">{successMessage}</p>}{mutation.isError && <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-300">{mutation.error instanceof Error ? mutation.error.message : "The message could not be sent. Please use email or WhatsApp instead."}</p>}</div>
        </form>
        <aside className="space-y-5">
          <DirectLink icon={CalendarDays} title="Book a Call" copy="Choose a convenient time for a focused 30-minute conversation." href="https://calendly.com/malekfouda2000/30min" eventName="calendly_click" />
          <DirectLink icon={MessageCircle} title="WhatsApp" copy="+20 122 607 6000" href="https://wa.me/201226076000" eventName="whatsapp_click" />
          <DirectLink icon={Mail} title="Email" copy="malekfouda2000@gmail.com" href="mailto:malekfouda2000@gmail.com" eventName="email_click" />
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6"><MapPin className="h-6 w-6 text-blue-400" /><p className="mt-4 font-semibold">Cairo, Egypt</p><p className="mt-2 text-sm leading-6 text-gray-400">Available for remote work across Egypt, the GCC, Europe, and the USA.</p></div>
        </aside>
      </div>
    </div></div>
  </section>;
}

function DirectLink({ icon: Icon, title, copy, href, eventName }: { icon: typeof Mail; title: string; copy: string; href: string; eventName: string }) {
  const external = href.startsWith("http");
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={() => trackEvent(eventName, "lead", "contact_panel")} className="group block rounded-2xl border border-gray-800 bg-gray-900/60 p-6 transition hover:-translate-y-1 hover:border-green-400/50"><Icon className="h-6 w-6 text-green-400" /><p className="mt-4 text-xl font-semibold">{title}</p><p className="mt-2 break-words text-sm leading-6 text-gray-400">{copy}</p></a>;
}

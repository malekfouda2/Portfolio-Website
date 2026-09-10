import { useCallback, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Mail, MapPin, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { getLeadAttribution } from "@/lib/attribution";
import { getCalendlyUrl, getWhatsAppUrl } from "@/lib/leadLinks";
import TurnstileWidget from "./TurnstileWidget";

const initialForm = { name: "", email: "", company: "", websiteUrl: "", projectType: "", message: "" };
const fieldClass = "mt-2 w-full rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-green-400 focus:outline-none";
const labelClass = "block text-sm font-medium text-gray-300";

export default function Contact({ headingLevel = "h1" }: { headingLevel?: "h1" | "h2" }) {
  const [formData, setFormData] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileRevision, setTurnstileRevision] = useState(0);
  const [companyFax, setCompanyFax] = useState("");
  const formStartedAt = useRef(Date.now());
  const started = useRef(false);
  const [, navigate] = useLocation();
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);
  const turnstileRequired = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

  const mutation = useMutation({
    mutationFn: async () => {
      const attribution = getLeadAttribution();
      const response = await apiRequest("POST", "/api/contact", {
        ...formData,
        company: formData.company || null,
        websiteUrl: formData.websiteUrl || null,
        projectType: formData.projectType || null,
        preferredContact: "email",
        ...attribution,
        companyFax,
        formStartedAt: formStartedAt.current,
        turnstileToken,
      });
      return response.json();
    },
    onSuccess: () => {
      trackEvent("contact_form_submit", "lead", "success");
      trackEvent("generate_lead", "lead", getLeadAttribution().landingPage);
      setFormData(initialForm);
      started.current = false;
      navigate("/thank-you?source=contact");
    },
    onError: () => {
      trackEvent("contact_form_submit", "lead", "error");
      setTurnstileToken("");
      setTurnstileRevision((value) => value + 1);
    },
  });

  const update = (field: keyof typeof formData, value: string) => setFormData((current) => ({ ...current, [field]: value }));
  const markStarted = () => {
    if (!started.current) {
      started.current = true;
      trackEvent("contact_form_start", "lead", window.location.pathname);
    }
  };
  const Heading = headingLevel;

  return <section id="contact" className="bg-black py-16 sm:py-20">
    <div className="container mx-auto px-4 sm:px-6"><div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center"><Heading className="text-4xl font-bold sm:text-5xl"><span className="text-white">Start Your</span><span className="gradient-text"> Project</span></Heading><div className="mx-auto mt-6 h-1 w-24 rounded bg-gradient-to-r from-green-400 to-blue-500" /><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">Tell me what needs to work better. A short explanation is enough—I’ll ask any technical or budget questions in the reply.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} onFocus={markStarted} className="relative rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>Your name *<input required autoComplete="name" className={fieldClass} value={formData.name} onChange={(event) => update("name", event.target.value)} placeholder="Name" /></label>
            <label className={labelClass}>Work email *<input required type="email" autoComplete="email" className={fieldClass} value={formData.email} onChange={(event) => update("email", event.target.value)} placeholder="you@company.com" /></label>
            <label className={labelClass}>Company <span className="text-gray-400">(optional)</span><input autoComplete="organization" className={fieldClass} value={formData.company} onChange={(event) => update("company", event.target.value)} placeholder="Company or agency" /></label>
            <label className={labelClass}>Website or app <span className="text-gray-400">(optional)</span><input type="url" className={fieldClass} value={formData.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://" /></label>
          </div>
          <label className={`${labelClass} mt-6`}>What do you need? <span className="text-gray-400">(optional)</span><select className={fieldClass} value={formData.projectType} onChange={(event) => update("projectType", event.target.value)}><option value="">Choose one</option><option value="shopify">Shopify development or rescue</option><option value="wordpress-woocommerce">WordPress or WooCommerce</option><option value="custom-business-system">Custom business system</option><option value="white-label">White-label agency delivery</option><option value="audit-maintenance">Audit, maintenance, or recovery</option><option value="other">Something else</option></select></label>
          <label className={`${labelClass} mt-6`}>Project details *<textarea required minLength={10} maxLength={2000} rows={6} className={`${fieldClass} resize-y`} value={formData.message} onChange={(event) => update("message", event.target.value)} placeholder="What is happening now, and what would a successful outcome change? Links are welcome." /></label>
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Company fax<input tabIndex={-1} autoComplete="off" name="companyFax" value={companyFax} onChange={(event) => setCompanyFax(event.target.value)} /></label></div>
          <TurnstileWidget key={turnstileRevision} onToken={handleTurnstileToken} />
          <p className="mt-5 text-xs leading-5 text-gray-400">By submitting, you agree that I may use these details to respond to your enquiry. See the <a href="/privacy" className="text-gray-200 underline underline-offset-4">privacy policy</a>.</p>
          <button type="submit" disabled={mutation.isPending || (turnstileRequired && !turnstileToken)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-6 py-4 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-50">{mutation.isPending ? "Sending…" : "Send project details"} <ArrowUpRight className="h-4 w-4" /></button>
          <div aria-live="polite" className="mt-5 text-sm">{mutation.isError && <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-300">{mutation.error instanceof Error ? mutation.error.message : "The message could not be sent. Please use email or WhatsApp instead."}</p>}</div>
        </form>
        <aside className="space-y-5">
          <DirectLink icon={CalendarDays} title="Book a Call" copy="Choose a convenient time for a focused 30-minute conversation." href={getCalendlyUrl("contact_panel")} eventName="calendly_click" />
          <DirectLink icon={MessageCircle} title="WhatsApp" copy="+20 122 607 6000" href={getWhatsAppUrl("contact_panel")} eventName="whatsapp_click" />
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

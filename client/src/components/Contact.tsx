import { useCallback, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Mail, MapPin, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { getLeadAttribution } from "@/lib/attribution";
import { getCalendlyUrl, getWhatsAppUrl } from "@/lib/leadLinks";
import TurnstileWidget from "./TurnstileWidget";
import RevealText from "./design/RevealText";
import { SendScene } from "./art/Scenes";

const initialForm = { name: "", email: "", company: "", websiteUrl: "", projectType: "", message: "" };
const labelClass = "block text-sm font-semibold text-bone";

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

  // The closing section sits on the logo gradient: the one place the two brand
  // colours meet at full strength.
  return <section id="contact" className="gradient-drift relative overflow-hidden py-20 text-black sm:py-28" aria-labelledby="contact-heading">
    <div className="shell relative">
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
        <RevealText as={headingLevel} id="contact-heading" text="Start Your Project" className="display-l max-w-[12ch]" />
        <p className="text-lg leading-8 text-black/75">Tell me what needs to work better. A short explanation is enough—I’ll ask any technical or budget questions in the reply.</p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_0.42fr]">
        <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} onFocus={markStarted} className="relative rounded-[2rem] bg-black p-6 text-bone sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>Your name *<input required autoComplete="name" className="field" value={formData.name} onChange={(event) => update("name", event.target.value)} placeholder="Name" /></label>
            <label className={labelClass}>Work email *<input required type="email" autoComplete="email" className="field" value={formData.email} onChange={(event) => update("email", event.target.value)} placeholder="you@company.com" /></label>
            <label className={labelClass}>Company <span className="font-normal text-fog">(optional)</span><input autoComplete="organization" className="field" value={formData.company} onChange={(event) => update("company", event.target.value)} placeholder="Company or agency" /></label>
            <label className={labelClass}>Website or app <span className="font-normal text-fog">(optional)</span><input type="url" className="field" value={formData.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://" /></label>
          </div>
          <label className={`${labelClass} mt-6`}>What do you need? <span className="font-normal text-fog">(optional)</span><select className="field" value={formData.projectType} onChange={(event) => update("projectType", event.target.value)}><option value="">Choose one</option><option value="shopify">Shopify development or rescue</option><option value="wordpress-woocommerce">WordPress or WooCommerce</option><option value="custom-business-system">Custom business system</option><option value="white-label">White-label agency delivery</option><option value="audit-maintenance">Audit, maintenance, or recovery</option><option value="other">Something else</option></select></label>
          <label className={`${labelClass} mt-6`}>Project details *<textarea required minLength={10} maxLength={2000} rows={6} className="field resize-y" value={formData.message} onChange={(event) => update("message", event.target.value)} placeholder="What is happening now, and what would a successful outcome change? Links are welcome." /></label>
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Company fax<input tabIndex={-1} autoComplete="off" name="companyFax" value={companyFax} onChange={(event) => setCompanyFax(event.target.value)} /></label></div>
          <TurnstileWidget key={turnstileRevision} onToken={handleTurnstileToken} />
          <p className="mt-5 text-xs leading-5 text-fog">By submitting, you agree that I may use these details to respond to your enquiry. See the <a href="/privacy" className="text-bone underline underline-offset-4">privacy policy</a>.</p>
          <button type="submit" disabled={mutation.isPending || (turnstileRequired && !turnstileToken)} className="btn btn-signal mt-6 w-full disabled:cursor-wait disabled:opacity-50">{mutation.isPending ? "Sending…" : "Send project details"} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></button>
          <div aria-live="polite" className="mt-5 text-sm">{mutation.isError && <p className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-red-200">{mutation.error instanceof Error ? mutation.error.message : "The message could not be sent. Please use email or WhatsApp instead."}</p>}</div>
        </form>
        <aside className="flex flex-col gap-3">
          <div aria-hidden="true" className="hidden rounded-[1.5rem] bg-black px-6 py-4 lg:block"><SendScene className="w-full" /></div>
          <DirectLink icon={CalendarDays} title="Book a Call" copy="Choose a convenient time for a focused 30-minute conversation." href={getCalendlyUrl("contact_panel")} eventName="calendly_click" />
          <DirectLink icon={MessageCircle} title="WhatsApp" copy="+20 122 607 6000" href={getWhatsAppUrl("contact_panel")} eventName="whatsapp_click" />
          <DirectLink icon={Mail} title="Email" copy="malekfouda2000@gmail.com" href="mailto:malekfouda2000@gmail.com" eventName="email_click" />
          <div className="rounded-[1.5rem] border-[1.5px] border-black/25 p-6"><MapPin aria-hidden="true" className="h-6 w-6" /><p className="mt-4 text-lg font-bold">Cairo, Egypt</p><p className="mt-2 text-sm leading-6 text-black/75">Available for remote work across Egypt, the GCC, Europe, and the USA.</p></div>
        </aside>
      </div>
    </div>
  </section>;
}

function DirectLink({ icon: Icon, title, copy, href, eventName }: { icon: typeof Mail; title: string; copy: string; href: string; eventName: string }) {
  const external = href.startsWith("http");
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={() => trackEvent(eventName, "lead", "contact_panel")} className="group flex items-start gap-4 rounded-[1.5rem] bg-black p-6 text-bone transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-1 hover:scale-[1.02]">
    <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-signal transition-colors group-hover:text-flow" />
    <span className="min-w-0 flex-1"><span className="display-s block">{title}</span><span className="mt-1.5 block break-words text-sm leading-6 text-fog">{copy}</span></span>
    <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-fog transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" />
  </a>;
}

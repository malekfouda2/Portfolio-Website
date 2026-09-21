import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import ArtPanel from "@/components/art/ArtPanel";
import { MaintenanceScene } from "@/components/art/Scenes";

export default function PrivacyPage() {
  return <MarketingLayout>
    <SEO title="Privacy Policy | Malek Fouda" description="How personal information, enquiry details, analytics preferences, and third-party services are handled on malekfouda.com." canonicalPath="/privacy" />
    <PageHero tag="Privacy" title="Privacy policy" intro={<span className="text-fog">Last updated: 10 September 2026</span>} art={<ArtPanel className="max-w-md"><MaintenanceScene className="w-full" /></ArtPanel>} />
    <section className="pb-24"><div className="shell border-b border-white/10 text-bone/85">
      <PolicySection title="Who is responsible"><p>This website is operated by Malek Fouda, an independent software developer based in Cairo, Egypt. Privacy questions or requests can be sent to <a className="text-signal underline underline-offset-4" href="mailto:malekfouda2000@gmail.com">malekfouda2000@gmail.com</a>.</p></PolicySection>
      <PolicySection title="Information collected"><p>When you submit an enquiry, the site collects your name, email address, project message, and any optional company, website, project-type, referral, or campaign information you provide. Basic technical information may also be processed for security, rate limiting, and bot prevention.</p></PolicySection>
      <PolicySection title="How information is used"><p>Enquiry information is used to respond, evaluate the requested work, provide a proposal, maintain business records, prevent abuse, and improve the enquiry experience. It is not sold or used for unrelated mailing lists.</p></PolicySection>
      <PolicySection title="Analytics and browser storage"><p>Google Analytics loads only after you select “Accept analytics.” It helps measure page usage and enquiries. A preference is stored in your browser so the site remembers your choice. Session storage may retain the page and campaign that brought you here so an enquiry can be attributed correctly.</p><button type="button" className="text-link mt-4" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}>Change cookie settings</button></PolicySection>
      <PolicySection title="Service providers"><p>Information may be processed by the website’s hosting and database providers. Resend is used for enquiry emails when configured, Cloudflare Turnstile may be used for bot protection, and Google Analytics is used only with consent. Calendly and WhatsApp apply their own policies when you follow their links.</p></PolicySection>
      <PolicySection title="Retention and security"><p>Enquiries are normally retained for up to 24 months to support follow-up and business records, unless a longer period is needed for an active contract or legal obligation. Reasonable access controls, validation, encryption in transit, and rate limits are used to protect submitted information.</p></PolicySection>
      <PolicySection title="Your choices"><p>You may request access, correction, or deletion of your enquiry information by email. Depending on where you live, additional privacy rights may apply. You may decline analytics without losing access to the website or contact form.</p></PolicySection>
      <PolicySection title="Updates"><p>This policy may change when website services or legal requirements change. The date above identifies the current version.</p></PolicySection>
    </div></section>
  </MarketingLayout>;
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="grid gap-4 border-t border-white/10 py-9 lg:grid-cols-[0.36fr_0.64fr] lg:gap-16"><h2 className="display-s">{title}</h2><div className="max-w-[65ch] space-y-4 text-lg leading-8">{children}</div></section>;
}

import { useState } from "react";
import { Mail, MapPin, Clock, Linkedin, Facebook, Github } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ContactInfo } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const emptyForm = {
  name: "",
  email: "",
  message: "",
  company: "",
  website: "",
  projectType: "",
  goals: "",
  budgetRange: "",
  timeline: "",
  preferredContact: "",
};

export default function Contact() {
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ["/api/contact-info"],
    staleTime: 1000 * 60 * 5,
  });
  const [formData, setFormData] = useState(emptyForm);
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      trackEvent("contact_form_submit", "conversion", "qualified_lead_success");
      toast({
        title: "Project enquiry sent",
        description: "Thank you for sharing the details. I’ll get back to you soon.",
      });
      setFormData(emptyForm);
    },
    onError: (error: Error) => {
      trackEvent("contact_form_submit", "conversion", "qualified_lead_error");
      toast({
        title: "Could not send your enquiry",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in the required fields",
        description: "Your name, email, and a short project description are required.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const lineRef = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const subtitleRef = useScrollReveal<HTMLParagraphElement>();
  const formRef = useScrollReveal<HTMLDivElement>({ rootMargin: "0px 0px -60px 0px" });
  const infoRef = useScrollReveal<HTMLDivElement>({ rootMargin: "0px 0px -60px 0px" });
  const fieldClassName = "w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-400 focus:outline-none transition-colors text-sm sm:text-base";
  const labelClassName = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-green-400 font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">Let’s talk</p>
            <h2 ref={headingRef} className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-white">Tell me what needs</span>
              <span className="gradient-text"> to work better</span>
            </h2>
            <div ref={lineRef} className="reveal-line h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8" />
            <p ref={subtitleRef} className="reveal text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Share the context, goals, and constraints. I’ll use the details to understand whether I’m the right fit and what a sensible next step looks like.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-8 lg:gap-12">
            <div ref={formRef} className="reveal-left bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 hover:border-gray-600 transition-colors duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Request a scoped conversation</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6">Fields marked with <span aria-hidden="true">*</span><span className="sr-only">an asterisk</span> are required.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className={labelClassName}>Your name <span className="text-green-400">*</span></label>
                    <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} className={fieldClassName} placeholder="Your name" autoComplete="name" required />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClassName}>Work email <span className="text-green-400">*</span></label>
                    <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClassName} placeholder="you@company.com" autoComplete="email" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-company" className={labelClassName}>Company or agency <span className="text-gray-500">(optional)</span></label>
                    <input id="contact-company" type="text" name="company" value={formData.company} onChange={handleChange} className={fieldClassName} placeholder="Company name" autoComplete="organization" />
                  </div>
                  <div>
                    <label htmlFor="contact-website" className={labelClassName}>Website <span className="text-gray-500">(optional)</span></label>
                    <input id="contact-website" type="url" name="website" value={formData.website} onChange={handleChange} className={fieldClassName} placeholder="https://example.com" />
                  </div>
                </div>

                <fieldset className="border border-gray-700 rounded-xl p-4 sm:p-5">
                  <legend className="px-2 text-sm font-semibold text-white">Project fit</legend>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-project-type" className={labelClassName}>What do you need help with?</label>
                      <select id="contact-project-type" name="projectType" value={formData.projectType} onChange={handleChange} className={fieldClassName}>
                        <option value="">Select a service</option>
                        <option value="technical_audit">Website technical audit</option>
                        <option value="woocommerce">WooCommerce improvement or rescue</option>
                        <option value="custom_system">Custom dashboard, portal, or workflow tool</option>
                        <option value="development_partner">Ongoing development partner</option>
                        <option value="performance_security">Performance or security recovery</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-timeline" className={labelClassName}>Preferred timeline</label>
                      <select id="contact-timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={fieldClassName}>
                        <option value="">Select a timeline</option>
                        <option value="asap">As soon as possible</option>
                        <option value="within_month">Within a month</option>
                        <option value="one_to_three_months">One to three months</option>
                        <option value="planning">Planning ahead</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-budget" className={labelClassName}>Approximate budget</label>
                      <select id="contact-budget" name="budgetRange" value={formData.budgetRange} onChange={handleChange} className={fieldClassName}>
                        <option value="">Select a range</option>
                        <option value="not_sure">Not sure yet</option>
                        <option value="focused">A focused engagement</option>
                        <option value="established">An established project budget</option>
                        <option value="larger">A larger project or ongoing engagement</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-method" className={labelClassName}>Preferred contact method</label>
                      <select id="contact-method" name="preferredContact" value={formData.preferredContact} onChange={handleChange} className={fieldClassName}>
                        <option value="">No preference</option>
                        <option value="email">Email</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="no_preference">No preference</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="contact-goals" className={labelClassName}>What should improve? <span className="text-gray-500">(optional)</span></label>
                  <textarea id="contact-goals" rows={3} name="goals" value={formData.goals} onChange={handleChange} className={fieldClassName} placeholder="For example: reduce checkout issues, replace a manual workflow, improve store performance, or add a client portal." />
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelClassName}>Project details <span className="text-green-400">*</span></label>
                  <textarea id="contact-message" rows={5} name="message" value={formData.message} onChange={handleChange} className={fieldClassName} placeholder="Share the current situation, any important constraints, and what a successful result would look like." required />
                </div>
                <button type="submit" disabled={contactMutation.isPending} className="w-full btn-shimmer bg-gradient-to-r from-green-400 to-blue-500 text-black px-6 py-3.5 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {contactMutation.isPending ? "Sending enquiry…" : "Request a consultation"}
                </button>
              </form>
            </div>

            <aside ref={infoRef} className="reveal-right space-y-6 sm:space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">A practical first step</h3>
                <p className="text-gray-300 mb-7 leading-relaxed">{contactInfo?.description || "Start by sharing the business problem and the context around it. A clear brief helps make the first conversation useful."}</p>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0"><Mail aria-hidden="true" className="text-green-400 w-5 h-5" /></div>
                    <div><div className="text-xs text-gray-400">Email</div><a href={`mailto:${contactInfo?.email || "malekfouda2000@gmail.com"}`} className="text-white font-medium text-sm break-all hover:text-green-400">{contactInfo?.email || "malekfouda2000@gmail.com"}</a></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0"><MapPin aria-hidden="true" className="text-blue-400 w-5 h-5" /></div>
                    <div><div className="text-xs text-gray-400">Location</div><div className="text-white font-medium text-sm">{contactInfo?.location || "Cairo, Egypt"}</div></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0"><Clock aria-hidden="true" className="text-purple-400 w-5 h-5" /></div>
                    <div><div className="text-xs text-gray-400">Response time</div><div className="text-white font-medium text-sm">{contactInfo?.responseTime || "Within 24 hours"}</div></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a href="https://github.com/malekfouda2" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-green-400 hover:text-black transition-all duration-300"><Github aria-hidden="true" className="w-5 h-5" /></a>
                  <a href="https://www.facebook.com/mikofouda" target="_blank" rel="noopener noreferrer" aria-label="Facebook profile" className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-blue-400 hover:text-black transition-all duration-300"><Facebook aria-hidden="true" className="w-5 h-5" /></a>
                  <a href="https://www.linkedin.com/in/malek-fouda-18a229244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300"><Linkedin aria-hidden="true" className="w-5 h-5" /></a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
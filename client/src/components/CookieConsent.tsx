import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/analytics";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getAnalyticsConsent() === null);
    const showSettings = () => setOpen(true);
    window.addEventListener("open-cookie-settings", showSettings);
    return () => window.removeEventListener("open-cookie-settings", showSettings);
  }, []);

  const choose = (choice: AnalyticsConsent) => {
    setAnalyticsConsent(choice);
    setOpen(false);
  };

  if (!open) return null;

  return <aside aria-label="Cookie preferences" className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-3xl rounded-[1.75rem] border border-white/15 bg-black/95 p-5 text-bone shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7">
    <h2 className="display-s">Your privacy choices</h2>
    <p className="mt-2 text-sm leading-6 text-fog">This site uses essential storage for form attribution. Optional Google Analytics helps improve the site and loads only if you accept. Read the <Link href="/privacy" className="text-bone underline underline-offset-4">privacy policy</Link>.</p>
    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" onClick={() => choose("denied")} className="btn btn-line min-h-0 px-5 py-2.5 text-sm">Necessary only</button>
      <button type="button" onClick={() => choose("granted")} className="btn btn-signal min-h-0 px-5 py-2.5 text-sm">Accept analytics</button>
    </div>
  </aside>;
}

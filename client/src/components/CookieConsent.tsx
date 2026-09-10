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

  return <aside aria-label="Cookie preferences" className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-3xl rounded-2xl border border-gray-700 bg-gray-950/95 p-5 text-white shadow-2xl backdrop-blur sm:p-6">
    <h2 className="text-lg font-bold">Your privacy choices</h2>
    <p className="mt-2 text-sm leading-6 text-gray-300">This site uses essential storage for form attribution. Optional Google Analytics helps improve the site and loads only if you accept. Read the <Link href="/privacy" className="text-green-400 underline underline-offset-4">privacy policy</Link>.</p>
    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" onClick={() => choose("denied")} className="rounded-full border border-gray-600 px-5 py-2.5 text-sm font-semibold hover:border-green-400">Necessary only</button>
      <button type="button" onClick={() => choose("granted")} className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-black">Accept analytics</button>
    </div>
  </aside>;
}

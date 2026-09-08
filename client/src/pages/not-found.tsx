import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";

export default function NotFound() {
  return <MarketingLayout><SEO title="Page Not Found | Malek Fouda" description="The requested page could not be found." canonicalPath="/" noIndex /><div className="marketing-shell grid min-h-[70vh] place-items-center py-24 text-center"><div><p className="marketing-eyebrow">404 / Page not found</p><h1 className="marketing-title"><span className="gradient-text">Wrong turn.</span></h1><p className="mx-auto mt-6 max-w-md leading-7 text-gray-400">The page you requested does not exist or has moved.</p><Link href="/" className="primary-cta mt-8"><ArrowLeft className="h-4 w-4" />Back to home</Link></div></div></MarketingLayout>;
}

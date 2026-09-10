import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { captureLeadAttribution } from "./lib/attribution";
import CookieConsent from "@/components/CookieConsent";

const Services = lazy(() => import("@/pages/services"));
const Service = lazy(() => import("@/pages/service"));
const Solutions = lazy(() => import("@/pages/solutions"));
const CommercialLanding = lazy(() => import("@/pages/commercial-landing"));
const Work = lazy(() => import("@/pages/work"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const CaseStudy = lazy(() => import("@/pages/case-study"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Privacy = lazy(() => import("@/pages/privacy"));
const ThankYou = lazy(() => import("@/pages/thank-you"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Login = lazy(() => import("@/pages/login"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#050808]" aria-busy="true" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={Service} />
        <Route path="/solutions" component={Solutions} />
        <Route path="/solutions/:slug" component={CommercialLanding} />
        <Route path="/work" component={Work} />
        <Route path="/work/:slug" component={CaseStudy} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    captureLeadAttribution();
    initGA();
    const handleConsent = () => initGA();
    window.addEventListener("analytics-consent-changed", handleConsent);
    return () => window.removeEventListener("analytics-consent-changed", handleConsent);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
      <CookieConsent />
    </QueryClientProvider>
  );
}

export default App;

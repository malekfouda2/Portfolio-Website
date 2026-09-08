import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

const Services = lazy(() => import("@/pages/services"));
const Service = lazy(() => import("@/pages/service"));
const Work = lazy(() => import("@/pages/work"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const CaseStudy = lazy(() => import("@/pages/case-study"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
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
        <Route path="/work" component={Work} />
        <Route path="/work/:slug" component={CaseStudy} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;

import { useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronDown, LayoutGrid, Layers, Lightbulb, Mail, MessageCircle, Smile } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import type { Service } from "@shared/schema";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import { SITE_IDENTITY } from "@shared/siteIdentity";
import Logo from "./Logo";
import Magnetic from "./design/Magnetic";
import { sceneFor } from "./art/Scenes";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl, getWhatsAppUrl } from "@/lib/leadLinks";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

type NavLink = { href: string; label: string; Icon: ComponentType<{ className?: string }>; menu?: "services" | "solutions"; tile: string };

const links: NavLink[] = [
  { href: "/services", label: "Services", Icon: Layers, menu: "services", tile: "bg-signal text-black" },
  { href: "/solutions", label: "Solutions", Icon: Lightbulb, menu: "solutions", tile: "bg-flow text-black" },
  { href: "/portfolio", label: "Projects", Icon: LayoutGrid, tile: "bg-violet text-black" },
  { href: "/work", label: "Work", Icon: BookOpen, tile: "bg-bone text-black" },
  { href: "/about", label: "About", Icon: Smile, tile: "border-2 border-white/20 text-bone" },
  { href: "/contact", label: "Contact", Icon: MessageCircle, tile: "bg-[linear-gradient(135deg,var(--signal),var(--flow))] text-black" },
];

/**
 * A floating dock: logo, sections, and the call to action in one pill. A soft
 * highlight follows the pointer between links, Services and Solutions open
 * illustrated menus so any page is one click away. It stays pinned to the
 * top of the screen and firms up its outline once the page is scrolled.
 */
export default function Navigation() {
  const [location] = useLocation();
  const reducedMotion = useReducedMotionPreference();
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<NavLink["menu"] | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number>();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"], staleTime: 1000 * 60 * 5 });

  useEffect(() => { setMenuOpen(false); setPanel(null); }, [location]);

  // The dock never hides; scrolling just firms up its outline and closes any open dropdown.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(latest - previous) > 4) setPanel(null);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setPanel(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  const openPanel = (menu: NavLink["menu"] | null) => { window.clearTimeout(closeTimer.current); setPanel(menu ?? null); };
  const closePanelSoon = () => { closeTimer.current = window.setTimeout(() => setPanel(null), 160); };
  const active = (href: string) => location.startsWith(href);

  const panelItems = panel === "services"
    ? services.map((service) => ({ href: `/services/${service.slug}`, eyebrow: service.eyebrow, title: service.title, slug: service.slug }))
    : commercialLandingPages.map((page) => ({ href: `/solutions/${page.slug}`, eyebrow: page.eyebrow, title: page.title, slug: page.slug }));

  return <>
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <nav aria-label="Primary navigation" data-no-cursor className={`pointer-events-auto relative flex w-full max-w-[64rem] items-center justify-between gap-2 rounded-full border bg-black p-1.5 pl-3 transition-[border-color,box-shadow] duration-300 lg:w-auto lg:justify-start ${scrolled ? "border-white/25 shadow-[0_18px_50px_rgba(0,0,0,0.75)]" : "border-white/15 shadow-[0_18px_50px_rgba(0,0,0,0.4)]"}`} onMouseLeave={() => { setHovered(null); closePanelSoon(); }}>
        <Link href="/" aria-label="Malek Fouda home" className="group grid h-11 place-items-center rounded-full px-2">
          <Logo className="h-8 w-[50px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-x-[1.18]" />
        </Link>
        <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-white/15 lg:block" />

        <ul className="relative hidden items-center lg:flex">
          {links.map((link) => (
            <li key={link.href} className="relative flex items-center" onMouseEnter={() => { setHovered(link.href); openPanel(link.menu ?? null); }}>
              {hovered === link.href && (
                <motion.span layoutId="dock-hover" aria-hidden="true" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 480, damping: 36 }} />
              )}
              <Link href={link.href} aria-current={active(link.href) ? "page" : undefined} className={`relative flex h-11 items-center gap-2 rounded-full pl-3.5 text-[0.93rem] font-semibold transition-colors ${link.menu ? "pr-1" : "pr-3.5"} ${active(link.href) ? "text-bone" : "text-fog hover:text-bone"}`}>
                <link.Icon aria-hidden="true" className={`h-4 w-4 transition-colors ${active(link.href) || hovered === link.href ? "text-signal" : ""}`} />
                {link.label}
                {active(link.href) && <motion.span layoutId="dock-active" aria-hidden="true" className="absolute -bottom-0.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-signal" />}
              </Link>
              {link.menu && (
                <button
                  type="button"
                  aria-label={`Show ${link.label.toLowerCase()}`}
                  aria-expanded={panel === link.menu}
                  aria-controls="dock-panel"
                  onClick={() => setPanel((current) => (current === link.menu ? null : link.menu ?? null))}
                  className="relative mr-1 grid h-8 w-7 place-items-center rounded-full text-fog hover:text-bone"
                >
                  <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${panel === link.menu ? "rotate-180 text-signal" : ""}`} />
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 lg:ml-2">
          <Magnetic className="hidden lg:inline-flex">
            <a href={getCalendlyUrl("header")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "header")} className="btn btn-signal min-h-0 px-5 py-3 text-sm">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />Book a Call
            </a>
          </Magnetic>
          <a href={getCalendlyUrl("header")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "header")} aria-label="Book a Call" className="grid h-11 w-11 place-items-center rounded-full bg-signal text-black lg:hidden">
            <CalendarDays aria-hidden="true" className="h-5 w-5" />
          </a>
          <button ref={toggleRef} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-navigation" className="flex h-11 items-center gap-2.5 rounded-full bg-white/10 pl-4 pr-3.5 text-sm font-semibold lg:hidden">
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span className={`absolute left-0 h-[2px] w-4 rounded bg-current transition-transform duration-300 ${menuOpen ? "top-[5px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[2px] w-4 rounded bg-current transition-transform duration-300 ${menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
            </span>
          </button>
        </div>

        <motion.span aria-hidden="true" className="absolute inset-x-6 -bottom-px h-[2px] origin-left rounded-full bg-[linear-gradient(90deg,var(--signal),var(--flow))]" style={{ scaleX: progress }} />

        <AnimatePresence>
          {panel && (
            <div key={panel} className="absolute left-1/2 top-[calc(100%+0.75rem)] hidden w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 lg:block">
            <motion.div
              id="dock-panel"
              onMouseEnter={() => openPanel(panel)}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="origin-top rounded-[1.75rem] border border-white/15 bg-black p-3 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              <ul className="grid grid-cols-2 gap-1">
                {panelItems.map((item) => {
                  const Art = sceneFor(item.slug);
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-white/[0.06]">
                        <span className="w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black p-1"><Art className="block w-full" /></span>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-signal">{item.eyebrow}</span>
                          <span className="mt-0.5 line-clamp-2 block text-sm font-semibold leading-5 text-bone">{item.title}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href={panel === "services" ? "/services" : "/solutions"} className="mt-2 flex items-center justify-between rounded-2xl bg-white/[0.05] px-4 py-3 text-sm font-semibold text-bone transition-colors hover:bg-signal hover:text-black">
                {panel === "services" ? "View all services" : "Browse all solutions"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </motion.div>
            </div>
          )}
        </AnimatePresence>
      </nav>
    </header>

    <AnimatePresence>
      {menuOpen && (
        <motion.div
          ref={menuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-black px-4 pb-8 lg:hidden"
          style={{ paddingTop: "calc(5.5rem + env(safe-area-inset-top))" }}
          initial={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at 90% 2.5rem)" }}
          animate={reducedMotion ? { opacity: 1 } : { clipPath: "circle(150% at 90% 2.5rem)" }}
          exit={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at 90% 2.5rem)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="grid grid-cols-2 gap-3">
            {links.map((link, index) => (
              <motion.li key={link.href} initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: index % 2 ? 3 : -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.15 + index * 0.05, type: "spring", stiffness: 260, damping: 20 }}>
                <Link href={link.href} aria-current={active(link.href) ? "page" : undefined} className={`flex aspect-[5/4] flex-col justify-between rounded-[1.5rem] p-4 ${link.tile} ${active(link.href) ? "ring-4 ring-white/40 ring-offset-2 ring-offset-black" : ""}`}>
                  <link.Icon aria-hidden="true" className="h-7 w-7" />
                  <span className="display text-2xl" style={{ fontStretch: "112%" }}>{link.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-8">
            <a href={getCalendlyUrl("mobile_header")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "mobile_header")} className="btn btn-signal w-full"><CalendarDays aria-hidden="true" className="h-4 w-4" />Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
            <div className="grid grid-cols-2 gap-3">
              <a href={getWhatsAppUrl("mobile_menu")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", "lead", "mobile_menu")} className="btn btn-line"><MessageCircle aria-hidden="true" className="h-4 w-4" />WhatsApp</a>
              <a href={`mailto:${SITE_IDENTITY.email}`} className="btn btn-line"><Mail aria-hidden="true" className="h-4 w-4" />Email</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>;
}

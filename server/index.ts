import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { setupSecurity, uploadSecurityMiddleware } from "./security";
import { cleanupProjectImages } from "./imageCleanup";
import { storage } from "./storage";
import path from "path";
import type { AboutContent, CaseStudy, HeroContent, Partnership, Project } from "@shared/schema";
import { commercialLandingPageBySlug, commercialLandingPages, type CommercialLandingPage } from "@shared/commercialLandingPages";
import { escapeHtml, sanitizeHttpUrl, serializeJsonLd } from "./htmlSafety";

const SITE_URL = "https://malekfouda.com";
const SOCIAL_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const app = express();

// Apply security middleware first
setupSecurity(app);
app.use(compression());

app.use("/api", (_req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});

// Parse JSON with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Upload security middleware
app.use(uploadSecurityMiddleware);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Favicon routes are now handled in routes.ts

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/** Builds the pre-rendered project grid HTML from live project data. */
function buildPortfolioBodyHtml(projects: Project[]): string {
  const typeLabel = (type: string) =>
    type === "personal" ? "Personal" : type === "company" ? "Company" : "Freelance";

  const typeBadgeColor = (type: string) =>
    type === "personal" ? "#10b981" : type === "company" ? "#a78bfa" : "#60a5fa";

  const projectCards = projects
    .slice(0, 30) // limit to first 30 for HTML size
    .map((p) => {
      const techs = (p.technologies ?? [])
        .map((t) => `<span style="background:#1f2937;color:#10b981;padding:.2rem .5rem;border-radius:.25rem;font-size:.75rem;">${escapeHtml(t)}</span>`)
        .join(" ");

      const liveUrl = sanitizeHttpUrl(p.url);
      const liveLink = liveUrl
        ? `<a href="${escapeHtml(liveUrl)}" rel="noopener noreferrer" style="color:#10b981;font-size:.875rem;">View Live →</a>`
        : "";

      const companyCredit = p.companyName
        ? `<p style="color:#9ca3af;font-size:.8rem;margin:.25rem 0 0;">Built at <strong style="color:#60a5fa;">${escapeHtml(p.companyName)}</strong>${p.role ? ` · ${escapeHtml(p.role)}` : ""}</p>`
        : "";

      return `
        <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;overflow:hidden;display:flex;flex-direction:column;">
          <div style="padding:1.25rem 1.25rem .75rem;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;margin-bottom:.5rem;">
              <h3 style="font-size:1.125rem;font-weight:700;color:#fff;margin:0;">${escapeHtml(p.title)}</h3>
              <span style="background:${typeBadgeColor(p.type)};color:#000;padding:.2rem .6rem;border-radius:9999px;font-size:.75rem;font-weight:600;white-space:nowrap;">${typeLabel(p.type)}</span>
            </div>
            <p style="color:#9ca3af;font-size:.9rem;line-height:1.6;margin:0 0 .75rem;">${escapeHtml(p.description)}</p>
            ${companyCredit}
          </div>
          <div style="padding:.75rem 1.25rem;display:flex;flex-wrap:wrap;gap:.375rem;border-top:1px solid #1f2937;">${techs}</div>
          ${liveLink ? `<div style="padding:.75rem 1.25rem;">${liveLink}</div>` : ""}
        </article>`;
    })
    .join("\n");

  return `
    <main id="__prerender__" style="font-family:system-ui,sans-serif;background:#000;color:#fff;min-height:100vh;padding:2rem;">
      <div style="max-width:1100px;margin:0 auto;">
        <nav style="margin-bottom:2rem;">
          <a href="/" style="color:#9ca3af;text-decoration:none;font-size:.875rem;">← Back to home</a>
        </nav>
        <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:800;margin:0 0 .75rem;">
          Client <span style="background:linear-gradient(135deg,#10b981,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">work</span>
        </h1>
        <p style="color:#9ca3af;margin:0 0 2rem;font-size:1rem;">
          Selected commercial software, stores, portals, dashboards, and integrations delivered across freelance and agency roles.
        </p>
        <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1.5rem;">Selected delivery</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;">
          ${projectCards}
        </div>
      </div>
    </main>`;
}

/** Builds the crawler-visible homepage from the same CMS records as the React app. */
function buildHomepageBodyHtml({
  hero,
  about,
  projects,
  partnerships,
}: {
  hero: HeroContent | undefined;
  about: AboutContent | undefined;
  projects: Project[];
  partnerships: Partnership[];
}): string {
  const heroName = hero?.name || "Malek Fouda";
  const heroTitle = hero?.title || "Full Stack Developer";
  const heroDescription =
    hero?.description ||
    "Specialized in creating high-quality web applications, mobile apps, and e-commerce solutions that drive business growth.";
  const heroHeadlines = Array.isArray(hero?.typingTexts)
    ? hero.typingTexts.filter((text): text is string => typeof text === "string")
    : [];
  const aboutTitle = about?.title || "About Me";
  const aboutDescription =
    about?.description ||
    "Creating high-quality digital solutions that drive business growth and enhance user experiences.";
  const featuredProjects = projects.slice(0, 6);

  const projectCards = featuredProjects
    .map(
      (project) => {
        const projectUrl = sanitizeHttpUrl(project.url);

        return `
        <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;">
          <h3 style="font-size:1.125rem;font-weight:700;color:#fff;margin:0 0 .5rem;">${escapeHtml(project.title)}</h3>
          <p style="color:#9ca3af;line-height:1.6;margin:0 0 .75rem;">${escapeHtml(project.description)}</p>
          ${projectUrl ? `<a href="${escapeHtml(projectUrl)}" rel="noopener noreferrer" style="color:#10b981;font-size:.875rem;">View project →</a>` : ""}
        </article>`;
      }
    )
    .join("\n");

  const partnershipItems = partnerships
    .map(
      (partnership) => `
        <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;">
          <h3 style="font-size:1.125rem;font-weight:700;color:#fff;margin:0 0 .5rem;">${escapeHtml(partnership.title)}</h3>
          <p style="color:#9ca3af;line-height:1.6;margin:0;">${escapeHtml(partnership.description)}</p>
        </article>`
    )
    .join("\n");

  return `
    <main id="__prerender__" style="font-family:system-ui,sans-serif;background:#000;color:#fff;min-height:100vh;padding:2rem;">
      <div style="max-width:1100px;margin:0 auto;">
        <header id="home" style="margin-bottom:3rem;">
          <nav style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:2rem;">
            <span style="color:#10b981;font-weight:700;font-size:1.25rem;">${escapeHtml(heroName)}</span>
            <div style="display:flex;flex-wrap:wrap;gap:1rem;">
              <a href="#about" style="color:#9ca3af;text-decoration:none;">About</a>
              <a href="#projects" style="color:#9ca3af;text-decoration:none;">Projects</a>
              <a href="#partnerships" style="color:#9ca3af;text-decoration:none;">Partnerships</a>
              <a href="#contact" style="color:#9ca3af;text-decoration:none;">Contact</a>
            </div>
          </nav>
          <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;margin:0 0 1rem;">${escapeHtml(heroName)}</h1>
          <p style="color:#d1d5db;font-size:1.35rem;margin:0 0 1rem;">${escapeHtml(heroHeadlines[0] || heroTitle)}</p>
          <p style="color:#9ca3af;font-size:1.125rem;max-width:720px;line-height:1.7;margin:0 0 1.5rem;">${escapeHtml(heroDescription)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:1.5rem;color:#d1d5db;">
            <span><strong style="color:#10b981;">${hero?.yearsExperience ?? 3}+</strong> Years Experience</span>
            <span><strong style="color:#3b82f6;">${hero?.projectsDelivered ?? 30}+</strong> Projects Delivered</span>
            <span><strong style="color:#a78bfa;">${hero?.clientSatisfaction ?? 98}%</strong> Client Satisfaction</span>
          </div>
        </header>

        <section id="about" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">${escapeHtml(aboutTitle)}</h2>
          <p style="color:#9ca3af;line-height:1.7;max-width:800px;margin:0;">${escapeHtml(aboutDescription)}</p>
        </section>

        <section id="solutions" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Focused Solutions</h2>
          <p style="color:#9ca3af;line-height:1.7;margin:0 0 1.5rem;">Start with the technical problem currently blocking the business. <a href="/solutions" style="color:#10b981;">Browse all solutions →</a></p>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">
            ${commercialLandingPages.slice(0, 3).map((page) => `<article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;"><h3 style="font-size:1.125rem;font-weight:700;color:#fff;margin:0 0 .5rem;">${escapeHtml(page.title)}</h3><p style="color:#9ca3af;line-height:1.6;margin:0 0 .75rem;">${escapeHtml(page.intro)}</p><a href="/solutions/${escapeHtml(page.slug)}" style="color:#10b981;">View solution →</a></article>`).join("\n")}
          </div>
        </section>

        <section id="projects" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Featured Projects</h2>
          <p style="color:#9ca3af;line-height:1.7;margin:0 0 1.5rem;">A curated selection of current web applications and client solutions. <a href="/portfolio" style="color:#10b981;">View the full portfolio →</a></p>
          ${
            projectCards
              ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">${projectCards}</div>`
              : `<p style="color:#9ca3af;margin:0;">Projects are being updated. Visit the <a href="/portfolio" style="color:#10b981;">full portfolio</a> for more work.</p>`
          }
        </section>

        ${
          partnershipItems
            ? `<section id="partnerships" style="margin-bottom:3rem;"><h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Trusted Partnerships</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">${partnershipItems}</div></section>`
            : ""
        }

        <section id="contact" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Get In Touch</h2>
          <p style="color:#9ca3af;line-height:1.7;max-width:720px;margin:0;">Available for freelance projects, consulting, and full-time opportunities. Let’s build something great together.</p>
        </section>
      </div>
    </main>`;
}

function buildCaseStudyIndexBodyHtml(caseStudies: CaseStudy[]): string {
  const cards = caseStudies.map((study) => `
    <article style="background:#101414;border:1px solid #25302d;border-radius:1rem;padding:1.5rem;">
      <p style="color:#6ee7b7;font-size:.8rem;margin:0 0 .75rem;">${escapeHtml(study.industry)}</p>
      <h2 style="font-size:1.35rem;color:#fff;margin:0 0 .75rem;">${escapeHtml(study.title)}</h2>
      <p style="color:#a1a1aa;line-height:1.7;margin:0;">${escapeHtml(study.summary)}</p>
      <a href="/work/${escapeHtml(study.slug)}" style="display:inline-block;color:#6ee7b7;margin-top:1rem;">Read case study →</a>
    </article>`).join("\n");

  return buildMarketingBodyHtml({
    eyebrow: "Software case studies",
    title: "The decisions behind delivered digital products.",
    description: "Detailed breakdowns of the business problem, technical approach, delivered solution, and verified outcomes behind selected client engagements.",
  }).replace(
    '<div style="margin-top:3rem;">',
    `${cards ? `<section aria-label="Case studies" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-top:4rem;">${cards}</section>` : ""}<div style="margin-top:3rem;">`,
  );
}

function buildCommercialLandingBodyHtml(page: CommercialLandingPage): string {
  return buildMarketingBodyHtml({
    eyebrow: page.eyebrow,
    title: page.title,
    description: page.intro,
    items: [
      { title: "Who this is for", description: page.audience },
      { title: page.painHeading, description: page.painPoints.join(" ") },
      { title: "What the work can include", description: page.deliverables.join(". ") },
      { title: "Expected outcomes", description: page.outcomes.join(". ") },
      ...page.process.map((step) => ({ title: step.title, description: step.description })),
      { title: "Worldwide delivery", description: "Cairo-based remote delivery for businesses and agencies across Egypt, the GCC, Europe, and the USA, with documented decisions, written progress updates, planned timezone overlap, and clear handover notes." },
      { title: "Relevant experience", description: page.proof, href: page.relatedCaseStudy ? `/work/${page.relatedCaseStudy.slug}` : "/portfolio" },
      ...page.faqs.map((faq) => ({ title: faq.question, description: faq.answer })),
      { title: "Broader service", description: `Review ${page.relatedService.title} when the scope extends beyond this focused engagement.`, href: `/services/${page.relatedService.slug}` },
    ],
  });
}

function buildMarketingBodyHtml({
  eyebrow,
  title,
  description,
  items = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  items?: Array<{ title: string; description: string; href?: string }>;
}): string {
  const cards = items
    .map((item) => `
      <article style="background:#101414;border:1px solid #25302d;border-radius:1rem;padding:1.5rem;">
        <h2 style="font-size:1.25rem;color:#fff;margin:0 0 .75rem;">${escapeHtml(item.title)}</h2>
        <p style="color:#a1a1aa;line-height:1.7;margin:0;">${escapeHtml(item.description)}</p>
        ${item.href ? `<a href="${escapeHtml(item.href)}" style="display:inline-block;color:#6ee7b7;margin-top:1rem;">Learn more →</a>` : ""}
      </article>`)
    .join("\n");

  return `
    <main id="__prerender__" style="font-family:system-ui,sans-serif;background:#050808;color:#fff;min-height:100vh;padding:3rem 1.25rem;">
      <div style="max-width:1120px;margin:0 auto;">
        <nav style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:5rem;">
          <a href="/" style="color:#fff;font-weight:700;text-decoration:none;">Malek Fouda</a>
          <div style="display:flex;flex-wrap:wrap;gap:1rem;"><a href="/services" style="color:#d4d4d8;">Services</a><a href="/solutions" style="color:#d4d4d8;">Solutions</a><a href="/portfolio" style="color:#d4d4d8;">Projects</a><a href="/work" style="color:#d4d4d8;">Work</a><a href="/about" style="color:#d4d4d8;">About</a><a href="/contact" style="color:#d4d4d8;">Contact</a><a href="/privacy" style="color:#d4d4d8;">Privacy</a></div>
        </nav>
        <p style="color:#6ee7b7;text-transform:uppercase;letter-spacing:.18em;font-size:.8rem;font-weight:700;">${escapeHtml(eyebrow)}</p>
        <h1 style="font-size:clamp(2.75rem,7vw,5.5rem);line-height:1.02;max-width:950px;margin:1rem 0 1.5rem;">${escapeHtml(title)}</h1>
        <p style="color:#d4d4d8;font-size:1.15rem;line-height:1.75;max-width:760px;margin:0;">${escapeHtml(description)}</p>
        ${cards ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:4rem;">${cards}</div>` : ""}
        <div style="margin-top:3rem;"><a href="https://calendly.com/malekfouda2000/30min" style="display:inline-block;background:#6ee7b7;color:#050808;border-radius:999px;padding:.9rem 1.4rem;font-weight:700;text-decoration:none;">Book a Call</a></div>
      </div>
    </main>`;
}

/**
 * Reads the HTML template and injects route-specific head metadata and
 * pre-rendered body content so crawlers receive meaningful HTML before JS runs.
 */
async function buildRouteHtml(
  isDev: boolean,
  meta: {
    title: string;
    description: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogImageAlt?: string;
    ogImageWidth?: number;
    ogImageHeight?: number;
    keywords: string;
    jsonLd: object;
    bodyContent: string;
    initialData?: Record<string, unknown>;
  }
): Promise<string | null> {
  const templatePath = isDev
    ? path.resolve(process.cwd(), "client", "index.html")
    : path.resolve(process.cwd(), "dist", "public", "index.html");

  if (!fs.existsSync(templatePath)) return null;

  let html = await fs.promises.readFile(templatePath, "utf-8");

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description"[^>]*\/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  // Replace/inject meta keywords
  if (/<meta name="keywords"[^>]*\/>/.test(html)) {
    html = html.replace(
      /<meta name="keywords"[^>]*\/>/,
      `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`
    );
  } else {
    html = html.replace(
      /<link rel="canonical"/,
      `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />\n    <link rel="canonical"`
    );
  }

  // Replace canonical
  html = html.replace(
    /<link rel="canonical"[^>]*\/>/,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
  );

  // Replace OG tags
  html = html.replace(
    /(<meta property="og:title"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogTitle)}${suffix}`
  );
  html = html.replace(
    /(<meta property="og:description"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogDescription)}${suffix}`
  );
  html = html.replace(
    /(<meta property="og:url"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.canonical)}${suffix}`
  );
  html = html.replace(
    /(<meta property="og:image"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogImage)}${suffix}`
  );
  html = html.replace(
    /(<meta property="og:image:type"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${meta.ogImage.toLowerCase().includes(".webp") ? "image/webp" : meta.ogImage.toLowerCase().match(/\.jpe?g(?:$|\?)/) ? "image/jpeg" : "image/png"}${suffix}`
  );
  const imageWidth = meta.ogImageWidth ?? (meta.ogImage === SOCIAL_IMAGE_URL ? 1200 : undefined);
  const imageHeight = meta.ogImageHeight ?? (meta.ogImage === SOCIAL_IMAGE_URL ? 630 : undefined);
  html = imageWidth
    ? html.replace(/(<meta property="og:image:width"[^>]*content=")[^"]*(")/, (_match, prefix, suffix) => `${prefix}${imageWidth}${suffix}`)
    : html.replace(/\s*<meta property="og:image:width"[^>]*\/>/, "");
  html = imageHeight
    ? html.replace(/(<meta property="og:image:height"[^>]*content=")[^"]*(")/, (_match, prefix, suffix) => `${prefix}${imageHeight}${suffix}`)
    : html.replace(/\s*<meta property="og:image:height"[^>]*\/>/, "");
  html = html.replace(
    /(<meta property="og:image:alt"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogImageAlt || `${meta.ogTitle} social preview`)}${suffix}`
  );

  // Replace Twitter tags
  html = html.replace(
    /(<meta name="twitter:title"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogTitle)}${suffix}`
  );
  html = html.replace(
    /(<meta name="twitter:description"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogDescription)}${suffix}`
  );
  html = html.replace(
    /(<meta name="twitter:image"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogImage)}${suffix}`
  );
  html = html.replace(
    /(<meta name="twitter:image:alt"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}${escapeHtml(meta.ogImageAlt || `${meta.ogTitle} social preview`)}${suffix}`
  );

  // Replace the template's person schema with route-specific JSON-LD.
  // The client restores the person schema in its own dedicated script after hydration.
  html = html.replace(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script id="route-structured-data" type="application/ld+json">\n    ${serializeJsonLd(meta.jsonLd)}\n    </script>`
  );

  // Inject the pre-rendered body content, replacing the content inside #root
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${meta.bodyContent}</div>`
  );

  html = html.replace(
    /(<script type="module"[^>]*src="[^"]+"[^>]*><\/script>)/,
    `<script>window.__INITIAL_QUERY_DATA__=${serializeJsonLd(meta.initialData || {})};</script>\n    $1`
  );

  // In development, inject the Vite HMR client so hot-reload keeps working
  if (isDev) {
    html = html.replace(
      '<script type="module" src="/src/main.tsx">',
      `<script type="module">
      import RefreshRuntime from "/@react-refresh";
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    </script>
    <script type="module" src="/@vite/client"></script>
    <script type="module" src="/src/main.tsx">`
    );
  }

  return html;
}

(async () => {
  const server = await registerRoutes(app);

  // Seed the full development database; production only receives missing
  // marketing records so existing live CMS and enquiry data stays untouched.
  if (app.get("env") === "development") {
    await seedDatabase();

    // Clean up any broken image references
    await cleanupProjectImages();
  } else {
    await seedDatabase("marketing");
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  const sendNotFoundPage = async (res: Response, next: NextFunction) => {
    try {
      const html = await buildRouteHtml(app.get("env") === "development", {
        title: "Page Not Found | Malek Fouda",
        description: "The requested page could not be found.",
        canonical: SITE_URL,
        ogTitle: "Page Not Found | Malek Fouda",
        ogDescription: "The requested page could not be found.",
        ogImage: SOCIAL_IMAGE_URL,
        keywords: "Malek Fouda",
        jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": "Page Not Found" },
        bodyContent: buildMarketingBodyHtml({
          eyebrow: "404",
          title: "This page does not exist.",
          description: "Return to the homepage or review the available services and client work.",
        }),
      });
      if (!html) return next();
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).type("html").send(html.replace('content="index, follow"', 'content="noindex, nofollow"'));
    } catch (error) {
      return next(error);
    }
  };

  // Render the homepage from current CMS records so crawlers receive the
  // same hero, about, projects, and partnership content as app visitors.
  app.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const isDev = app.get("env") === "development";
      const [hero, about, allProjects, allPartnerships, skills] = await Promise.all([
        storage.getHeroContent(),
        storage.getAboutContent(),
        storage.getProjects(),
        storage.getPartnerships(),
        storage.getSkills(),
      ]);
      const projects = allProjects.filter((project) => project.isVisible);
      const partnerships = allPartnerships.filter((partnership) => partnership.isVisible);

      const personName = hero?.name || "Malek Fouda";
      const personTitle = "Shopify, WordPress & Custom Software Developer";
      const homepageTitle = `${personName} | ${personTitle}`;
      const homepageDescription = "Commercial full-stack development for Shopify, WordPress, WooCommerce, custom business systems, integrations, and ongoing technical support.";
      const bodyContent = buildHomepageBodyHtml({ hero, about, projects, partnerships });

      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            "name": "Malek Fouda",
            "alternateName": "Malek Fouda Portfolio",
            "url": `${SITE_URL}/`,
            "publisher": { "@id": `${SITE_URL}/#person` },
          },
          {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            "name": personName,
            "jobTitle": personTitle,
            "description": homepageDescription,
            "url": `${SITE_URL}/`,
            "sameAs": ["https://github.com/malekfouda", "https://linkedin.com/in/malekfouda"],
            "knowsAbout": ["Shopify", "WordPress", "WooCommerce", "Custom software", "Business systems", "System integrations"],
          },
          {
            "@type": "ProfessionalService",
            "@id": `${SITE_URL}/#business`,
            "name": homepageTitle,
            "description": homepageDescription,
            "url": `${SITE_URL}/`,
            "founder": { "@id": `${SITE_URL}/#person` },
            "areaServed": ["Egypt", "GCC", "United States", "Europe"],
          },
        ],
      };

      const html = await buildRouteHtml(isDev, {
        title: homepageTitle,
        description: homepageDescription,
        canonical: `${SITE_URL}/`,
        ogTitle: homepageTitle,
        ogDescription: homepageDescription,
        ogImage: SOCIAL_IMAGE_URL,
        keywords:
          "Shopify developer, WordPress developer, WooCommerce developer, custom software developer, full-stack developer, Malek Fouda",
        jsonLd,
        bodyContent,
        initialData: {
          "/api/hero": hero,
          "/api/about": about,
          "/api/projects": projects,
          "/api/partnerships": partnerships,
          "/api/skills": skills.filter((skill) => skill.isVisible),
        },
      });

      if (!html) return next();

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      next(err);
    }
  });

  // Restore the complete, searchable project archive at its original URL.
  app.get("/portfolio", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = (await storage.getProjects()).filter((project) => project.isVisible);
      const title = "All Development Projects | Malek Fouda";
      const description = "Explore Malek Fouda's complete portfolio of Shopify, WordPress, WooCommerce, full-stack applications, dashboards, integrations, and client projects.";
      const canonical = `${SITE_URL}/portfolio`;
      const html = await buildRouteHtml(app.get("env") === "development", {
        title,
        description,
        canonical,
        ogTitle: title,
        ogDescription: description,
        ogImage: SOCIAL_IMAGE_URL,
        keywords: "development portfolio, Shopify projects, WordPress projects, full-stack projects, Malek Fouda",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "name": title,
              "description": description,
              "url": canonical,
              "author": { "@id": `${SITE_URL}/#person` },
              "hasPart": projects.slice(0, 30).map((project) => {
                const projectUrl = sanitizeHttpUrl(project.url);
                return {
                  "@type": "CreativeWork",
                  "name": project.title,
                  "description": project.description,
                  ...(projectUrl ? { "url": projectUrl } : {}),
                };
              }),
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
                { "@type": "ListItem", "position": 2, "name": "Projects", "item": canonical },
              ],
            },
          ],
        },
        bodyContent: buildPortfolioBodyHtml(projects),
        initialData: { "/api/projects": projects },
      });
      if (!html) return next();
      return res.status(200).type("html").send(html);
    } catch (error) {
      return next(error);
    }
  });

  // Keep /work focused on detailed case studies; /portfolio is the full archive.
  app.get("/work", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const isDev = app.get("env") === "development";

      const portfolioTitle = "Software Development Case Studies | Malek Fouda";
      const portfolioDescription = "Detailed case studies covering Shopify, custom platforms, integrations, operational systems, and measurable delivery outcomes.";
      const canonicalUrl = `${SITE_URL}/work`;
      const keywords = "software development case studies, Shopify case studies, custom platforms, integrations, Malek Fouda";

      const caseStudies = await storage.getCaseStudies(true);
      const bodyContent = buildCaseStudyIndexBodyHtml(caseStudies);

      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "name": portfolioTitle,
            "description": portfolioDescription,
            "url": canonicalUrl,
            "author": { "@id": `${SITE_URL}/#person` },
            "hasPart": caseStudies.map((study) => ({
              "@type": "Article",
              "headline": study.title,
              "description": study.seoDescription,
              "url": `${SITE_URL}/work/${study.slug}`,
            })),
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
              { "@type": "ListItem", "position": 2, "name": "Case studies", "item": canonicalUrl },
            ],
          },
        ],
      };

      const html = await buildRouteHtml(isDev, {
        title: portfolioTitle,
        description: portfolioDescription,
        canonical: canonicalUrl,
        ogTitle: portfolioTitle,
        ogDescription: portfolioDescription,
        ogImage: SOCIAL_IMAGE_URL,
        keywords,
        jsonLd,
        bodyContent,
        initialData: { "/api/case-studies": caseStudies },
      });

      if (!html) return next();

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      next(err);
    }
  });

  app.get("/solutions", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const title = "E-commerce & Business Software Solutions | Malek Fouda";
      const description = "Focused Shopify, WooCommerce, dashboard, integration, technical audit, maintenance, and white-label development solutions.";
      const canonical = `${SITE_URL}/solutions`;
      const html = await buildRouteHtml(app.get("env") === "development", {
        title,
        description,
        canonical,
        ogTitle: title,
        ogDescription: description,
        ogImage: SOCIAL_IMAGE_URL,
        keywords: "Shopify solutions, WooCommerce development, custom dashboard development, website technical audit",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "name": title,
              "description": description,
              "url": canonical,
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": commercialLandingPages.map((page, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": page.title,
                  "url": `${SITE_URL}/solutions/${page.slug}`,
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
                { "@type": "ListItem", "position": 2, "name": "Solutions", "item": canonical },
              ],
            },
          ],
        },
        bodyContent: buildMarketingBodyHtml({
          eyebrow: "Focused solutions",
          title: "Start with the problem that is blocking the business.",
          description,
          items: commercialLandingPages.map((page) => ({ title: page.title, description: page.intro, href: `/solutions/${page.slug}` })),
        }),
      });
      if (!html) return next();
      return res.status(200).type("html").send(html);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/solutions/:slug", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = commercialLandingPageBySlug.get(req.params.slug);
      if (!page) return sendNotFoundPage(res, next);
      const canonical = `${SITE_URL}/solutions/${page.slug}`;
      const html = await buildRouteHtml(app.get("env") === "development", {
        title: page.seoTitle,
        description: page.seoDescription,
        canonical,
        ogTitle: page.seoTitle,
        ogDescription: page.seoDescription,
        ogImage: SOCIAL_IMAGE_URL,
        keywords: page.keywords.join(", "),
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "name": page.title,
              "description": page.seoDescription,
              "url": canonical,
              "provider": { "@id": `${SITE_URL}/#person` },
              "areaServed": ["Egypt", "GCC", "United States", "Europe"],
              "serviceType": page.keywords[0],
            },
            {
              "@type": "FAQPage",
              "mainEntity": page.faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
              })),
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
                { "@type": "ListItem", "position": 2, "name": "Solutions", "item": `${SITE_URL}/solutions` },
                { "@type": "ListItem", "position": 3, "name": page.title, "item": canonical },
              ],
            },
          ],
        },
        bodyContent: buildCommercialLandingBodyHtml(page),
      });
      if (!html) return next();
      return res.status(200).type("html").send(html);
    } catch (error) {
      return next(error);
    }
  });

  const staticMarketingPages = {
    "/services": {
      title: "Shopify, WordPress & Custom Software Services | Malek Fouda",
      description: "Commercial development services covering Shopify, WordPress, WooCommerce, custom business systems, agency delivery, technical audits, performance, and support.",
      eyebrow: "Services",
      heading: "Technical delivery shaped around the business problem.",
    },
    "/about": {
      title: "About Malek Fouda | Full-Stack Developer",
      description: "Meet Malek Fouda, a Cairo-based full-stack developer delivering e-commerce platforms, business systems, integrations, and white-label development.",
      eyebrow: "About Malek",
      heading: "A technical partner who takes ownership beyond the code.",
    },
    "/contact": {
      title: "Contact Malek Fouda | Book a Development Call",
      description: "Share your Shopify, WordPress, WooCommerce, custom system, integration, maintenance, or agency development requirements with Malek Fouda.",
      eyebrow: "Discuss your project",
      heading: "Start with the problem, the current system, and the outcome you need.",
    },
    "/privacy": {
      title: "Privacy Policy | Malek Fouda",
      description: "How personal information, enquiry details, analytics preferences, and third-party services are handled on malekfouda.com.",
      eyebrow: "Privacy",
      heading: "Clear choices for enquiries, analytics, and personal information.",
    },
  } as const;

  for (const [route, page] of Object.entries(staticMarketingPages)) {
    app.get(route, async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const services = route === "/services" ? await storage.getServices(true) : [];
        const bodyContent = buildMarketingBodyHtml({
          eyebrow: page.eyebrow,
          title: page.heading,
          description: page.description,
          items: [
            ...services.map((service) => ({
              title: service.title,
              description: service.shortDescription,
              href: `/services/${service.slug}`,
            })),
            ...(route === "/services" ? commercialLandingPages.map((page) => ({
              title: page.title,
              description: page.intro,
              href: `/solutions/${page.slug}`,
            })) : []),
          ],
        });
        const canonical = `${SITE_URL}${route}`;
        const html = await buildRouteHtml(app.get("env") === "development", {
          title: page.title,
          description: page.description,
          canonical,
          ogTitle: page.title,
          ogDescription: page.description,
          ogImage: SOCIAL_IMAGE_URL,
          keywords: "Shopify developer, WordPress developer, WooCommerce, custom software, business systems, Malek Fouda",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": route === "/services" ? "ItemList" : "WebPage",
            "name": page.title,
            "description": page.description,
            "url": canonical,
            ...(route === "/services" ? { "itemListElement": [
              ...services.map((service, index) => ({ "@type": "ListItem", "position": index + 1, "url": `${SITE_URL}/services/${service.slug}`, "name": service.title })),
              ...commercialLandingPages.map((page, index) => ({ "@type": "ListItem", "position": services.length + index + 1, "url": `${SITE_URL}/solutions/${page.slug}`, "name": page.title })),
            ] } : {}),
          },
          bodyContent,
          initialData: route === "/services" ? { "/api/services": services } : undefined,
        });
        if (!html) return next();
        return res.status(200).type("html").send(html);
      } catch (error) {
        return next(error);
      }
    });
  }

  for (const route of ["/login", "/dashboard", "/thank-you"]) {
    app.get(route, async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const title = route === "/login" ? "Admin Login | Malek Fouda" : route === "/dashboard" ? "Portfolio CMS | Malek Fouda" : "Enquiry Received | Malek Fouda";
        const html = await buildRouteHtml(app.get("env") === "development", {
          title,
          description: route === "/thank-you" ? "Your project enquiry has been received." : "Private portfolio administration.",
          canonical: `${SITE_URL}${route}`,
          ogTitle: title,
          ogDescription: route === "/thank-you" ? "Your project enquiry has been received." : "Private portfolio administration.",
          ogImage: SOCIAL_IMAGE_URL,
          keywords: "Malek Fouda",
          jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": title },
          bodyContent: `<main id="__prerender__" style="min-height:100vh;background:#050808;color:#fff;display:grid;place-items:center;font-family:system-ui,sans-serif;"><p>${route === "/thank-you" ? "Thank you. Your enquiry has been received." : "Private administration"}</p></main>`,
        });
        if (!html) return next();
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        return res.status(200).type("html").send(html.replace('content="index, follow"', 'content="noindex, nofollow"'));
      } catch (error) {
        return next(error);
      }
    });
  }

  app.get("/services/:slug", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug, true);
      if (!service) return sendNotFoundPage(res, next);
      const canonical = `${SITE_URL}/services/${service.slug}`;
      const bodyContent = buildMarketingBodyHtml({
        eyebrow: service.eyebrow,
        title: service.title,
        description: service.shortDescription,
        items: [
          { title: "Who it’s for", description: service.audience },
          { title: "The problem", description: service.problem },
          { title: "The outcome", description: service.outcome },
          { title: "What the work can include", description: service.deliverables.join(". ") },
          ...service.faqs.map((faq) => ({ title: faq.question, description: faq.answer })),
        ],
      });
      const html = await buildRouteHtml(app.get("env") === "development", {
        title: service.seoTitle,
        description: service.seoDescription,
        canonical,
        ogTitle: service.seoTitle,
        ogDescription: service.seoDescription,
        ogImage: SOCIAL_IMAGE_URL,
        keywords: `${service.title}, Shopify developer, WordPress developer, custom software, Malek Fouda`,
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "name": service.title,
              "description": service.seoDescription,
              "url": canonical,
              "provider": { "@id": `${SITE_URL}/#person` },
              "areaServed": ["Egypt", "GCC", "United States", "Europe"],
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
                { "@type": "ListItem", "position": 2, "name": "Services", "item": `${SITE_URL}/services` },
                { "@type": "ListItem", "position": 3, "name": service.title, "item": canonical },
              ],
            },
            ...(service.faqs.length ? [{
              "@type": "FAQPage",
              "mainEntity": service.faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
              })),
            }] : []),
          ],
        },
        bodyContent,
        initialData: { [`/api/services/${service.slug}`]: service },
      });
      if (!html) return next();
      return res.status(200).type("html").send(html);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/work/:slug", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const study = await storage.getCaseStudyBySlug(req.params.slug, true);
      if (!study) return sendNotFoundPage(res, next);
      const canonical = `${SITE_URL}/work/${study.slug}`;
      const socialImage = study.image
        ? study.image.startsWith("http") ? study.image : `${SITE_URL}${study.image.startsWith("/") ? study.image : `/${study.image}`}`
        : SOCIAL_IMAGE_URL;
      const bodyContent = buildMarketingBodyHtml({
        eyebrow: study.industry,
        title: study.title,
        description: study.summary,
        items: [
          { title: "Context", description: study.context },
          { title: "The problem", description: study.problem },
          { title: "The approach", description: study.approach },
          { title: "The solution", description: study.solution },
          ...(study.challenges.length ? [{ title: "Important challenges", description: study.challenges.join(". ") }] : []),
          ...(study.results.length ? [{ title: "Verified outcomes", description: study.results.join(". ") }] : []),
        ],
      });
      const isAiqdaImage = study.slug === "aiqda-learning-platform";
      const html = await buildRouteHtml(app.get("env") === "development", {
        title: study.seoTitle,
        description: study.seoDescription,
        canonical,
        ogTitle: study.seoTitle,
        ogDescription: study.seoDescription,
        ogImage: socialImage,
        ogImageAlt: `${study.title} case study interface`,
        ogImageWidth: isAiqdaImage ? 1440 : undefined,
        ogImageHeight: isAiqdaImage ? 980 : undefined,
        keywords: `${study.industry}, ${study.serviceSlugs.join(", ")}, case study, Malek Fouda`,
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "headline": study.title,
              "description": study.seoDescription,
              "url": canonical,
              "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
              "author": { "@id": `${SITE_URL}/#person` },
              "datePublished": new Date(study.createdAt).toISOString(),
              "dateModified": new Date(study.updatedAt).toISOString(),
              ...(study.image ? { "image": [socialImage] } : {}),
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
                { "@type": "ListItem", "position": 2, "name": "Case studies", "item": `${SITE_URL}/work` },
                { "@type": "ListItem", "position": 3, "name": study.title, "item": canonical },
              ],
            },
          ],
        },
        bodyContent,
        initialData: { [`/api/case-studies/${study.slug}`]: study },
      });
      if (!html) return next();
      return res.status(200).type("html").send(html);
    } catch (error) {
      return next(error);
    }
  });

  // Known public SPA routes — any other HTML request gets a real 404 status.
  // This prevents soft-404s where search crawlers receive HTTP 200 for invalid URLs.
  const KNOWN_SPA_ROUTES = new Set(["/", "/services", "/solutions", "/portfolio", "/work", "/about", "/contact", "/privacy", "/thank-you", "/login", "/dashboard"]);
  const isKnownSpaRoute = (url: string) =>
    KNOWN_SPA_ROUTES.has(url) ||
    url.startsWith("/services/") ||
    url.startsWith("/solutions/") ||
    url.startsWith("/work/");

  app.use(async (req, res, next) => {
    const url = req.path;

    // Pass through: API routes, uploads, and any request with a file extension (assets)
    if (
      url.startsWith('/api') ||
      url.startsWith('/uploads') ||
      url.startsWith('/@vite/') ||
      url === '/@react-refresh' ||
      url.startsWith('/@fs/') ||
      url.startsWith('/src/') ||
      url.startsWith('/node_modules/') ||
      /\.\w+/.test(url)
    ) {
      return next();
    }

    // Known SPA pages — let Vite / serveStatic handle them with 200
    if (isKnownSpaRoute(url)) {
      return next();
    }

    // Unknown route — serve the app shell with a proper 404 status so crawlers
    // receive an unambiguous signal while the React NotFound UI still renders.
    return sendNotFoundPage(res, next);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the API and client from the same configurable port.
  const port = Number(process.env.PORT) || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    ...(process.platform === "linux" ? { reusePort: true } : {}),
  }, () => {
    log(`serving on port ${port}`);
  });
})();

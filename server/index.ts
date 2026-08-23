import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { setupSecurity, uploadSecurityMiddleware } from "./security";
import { cleanupProjectImages } from "./imageCleanup";
import { storage } from "./storage";
import path from "path";
import type { AboutContent, HeroContent, Partnership, Project } from "@shared/schema";
import { escapeHtml, sanitizeHttpUrl, serializeJsonLd } from "./htmlSafety";

const SITE_URL = "https://malekfouda.com";
const SOCIAL_IMAGE_URL = `${SITE_URL}/og-image.png`;

const app = express();

// Apply security middleware first
setupSecurity(app);

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
      const technologies = Array.isArray(p.technologies)
        ? p.technologies.filter((technology): technology is string => typeof technology === "string")
        : [];
      const techs = technologies
        .map((technology) => `<span style="background:#1f2937;color:#10b981;padding:.2rem .5rem;border-radius:.25rem;font-size:.75rem;">${escapeHtml(technology)}</span>`)
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
    <div id="__prerender__" style="font-family:system-ui,sans-serif;background:#000;color:#fff;min-height:100vh;padding:2rem;">
      <div style="max-width:1100px;margin:0 auto;">
        <nav style="margin-bottom:2rem;">
          <a href="/" style="color:#9ca3af;text-decoration:none;font-size:.875rem;">← Back to Home</a>
        </nav>
        <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:800;margin:0 0 .75rem;">
          Client <span style="background:linear-gradient(135deg,#10b981,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Work</span>
        </h1>
        <p style="color:#9ca3af;margin:0 0 2rem;font-size:1rem;">
          Explore verified web development work, including e-commerce, custom applications, and professional projects.
        </p>
        <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1.5rem;">Full-Stack Development Projects</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;">
          ${projectCards}
        </div>
      </div>
    </div>`;
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
  const heroTitle = "WooCommerce, WordPress & Custom Web Development";
  const heroDescription =
    "Malek Fouda helps businesses and agencies build, improve, and support revenue-critical websites, WooCommerce stores, dashboards, portals, and integrations.";
  const heroHeadlines = Array.isArray(hero?.typingTexts)
    ? hero.typingTexts.filter((text): text is string => typeof text === "string")
    : [];
  const aboutTitle = "Technical depth, applied to real work";
  const aboutDescription =
    "I bring full-stack development experience to projects where reliability, maintainability, and a clear technical path matter. The goal is useful work that fits the business—not technology for its own sake.";
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
    <div id="__prerender__" style="font-family:system-ui,sans-serif;background:#000;color:#fff;min-height:100vh;padding:2rem;">
      <div style="max-width:1100px;margin:0 auto;">
        <header id="home" style="margin-bottom:3rem;">
          <nav style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:2rem;">
            <span style="color:#10b981;font-weight:700;font-size:1.25rem;">${escapeHtml(heroName)}</span>
            <div style="display:flex;flex-wrap:wrap;gap:1rem;">
              <a href="#services" style="color:#9ca3af;text-decoration:none;">Services</a>
              <a href="#projects" style="color:#9ca3af;text-decoration:none;">Client Work</a>
              <a href="#partnerships" style="color:#9ca3af;text-decoration:none;">Platforms</a>
              <a href="#process" style="color:#9ca3af;text-decoration:none;">Process</a>
              <a href="#contact" style="color:#9ca3af;text-decoration:none;">Contact</a>
            </div>
          </nav>
          <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;margin:0 0 1rem;">
            ${escapeHtml(heroName)} builds and fixes<br/>
            <span style="background:linear-gradient(135deg,#10b981,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">revenue-critical websites and business software.</span>
          </h1>
          <p style="color:#9ca3af;font-size:1.125rem;max-width:720px;line-height:1.7;margin:0 0 1.5rem;">${escapeHtml(heroDescription)}</p>
          <p style="display:flex;flex-wrap:wrap;gap:.75rem;margin:0 0 1.5rem;">
            <a href="#contact" style="display:inline-block;background:linear-gradient(135deg,#4ade80,#3b82f6);color:#000;text-decoration:none;font-weight:700;padding:.75rem 1.1rem;border-radius:9999px;">Request a short consultation</a>
            <a href="#projects" style="display:inline-block;border:1px solid #4b5563;color:#fff;text-decoration:none;font-weight:700;padding:.75rem 1.1rem;border-radius:9999px;">View client work</a>
          </p>
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

        <section id="services" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Outcome-led development services</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;">
            <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;"><h3 style="color:#fff;margin:0 0 .5rem;">Website technical audit</h3><p style="color:#9ca3af;line-height:1.6;margin:0;">A practical review of performance, integrations, maintainability, and the most useful next technical steps.</p></article>
            <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;"><h3 style="color:#fff;margin:0 0 .5rem;">WooCommerce rescue &amp; improvement</h3><p style="color:#9ca3af;line-height:1.6;margin:0;">Hands-on support for checkout issues, plugin conflicts, store changes, custom functionality, and performance work.</p></article>
            <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;"><h3 style="color:#fff;margin:0 0 .5rem;">Custom business systems</h3><p style="color:#9ca3af;line-height:1.6;margin:0;">Dashboards, portals, workflows, and integrations shaped around the way a team actually operates.</p></article>
            <article style="background:#111;border:1px solid #1f2937;border-radius:.75rem;padding:1.25rem;"><h3 style="color:#fff;margin:0 0 .5rem;">Development partner retainer</h3><p style="color:#9ca3af;line-height:1.6;margin:0;">Ongoing development capacity for agencies and businesses that need dependable technical support.</p></article>
          </div>
          <p style="margin:1.25rem 0 0;"><a href="#contact" style="color:#10b981;">Request a scoped estimate →</a></p>
        </section>

        <section id="projects" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Selected client work</h2>
          <p style="color:#9ca3af;line-height:1.7;margin:0 0 1.5rem;">A selection of current web applications, e-commerce work, and professional projects. <a href="/portfolio" style="color:#10b981;">View the full portfolio →</a></p>
          ${
            projectCards
              ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">${projectCards}</div>`
              : `<p style="color:#9ca3af;margin:0;">Projects are being updated. Visit the <a href="/portfolio" style="color:#10b981;">full portfolio</a> for more work.</p>`
          }
        </section>

        ${
          partnershipItems
            ? `<section id="partnerships" style="margin-bottom:3rem;"><h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">WordPress and e-commerce expertise</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">${partnershipItems}</div></section>`
            : ""
        }

        <section id="process" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">A clear way to work together</h2>
          <p style="color:#9ca3af;line-height:1.7;margin:0;">Discovery, scope, implementation, testing, launch, and ongoing support when it is needed. Every engagement starts with the context needed to recommend a sensible next step.</p>
        </section>

        <section id="contact" style="margin-bottom:3rem;">
          <h2 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 1rem;">Request a short consultation</h2>
          <p style="color:#9ca3af;line-height:1.7;max-width:720px;margin:0;">Share your company, website, project need, goals, timeline, and budget range to request a scoped conversation.</p>
        </section>
      </div>
    </div>`;
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
    keywords: string;
    jsonLd: object;
    bodyContent: string;
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
    /(<meta property="og:image:width"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}1200${suffix}`
  );
  html = html.replace(
    /(<meta property="og:image:height"[^>]*content=")[^"]*(")/,
    (_match, prefix, suffix) => `${prefix}630${suffix}`
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

  // Replace the template's person schema with route-specific JSON-LD.
  // The client restores the person schema in its own dedicated script after hydration.
  html = html.replace(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script id="route-structured-data" type="application/ld+json">\n    ${serializeJsonLd(meta.jsonLd)}\n    </script>`
  );

  // Inject the pre-rendered body content, replacing the content inside #root
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script)/,
    `<div id="root">${meta.bodyContent}</div>\n    `
  );

  // In development, inject the Vite HMR client so hot-reload keeps working
  if (isDev) {
    html = html.replace(
      '<script type="module" src="/src/main.tsx">',
      '<script type="module" src="/@vite/client"></script>\n    <script type="module" src="/src/main.tsx">'
    );
  }

  return html;
}

(async () => {
  const server = await registerRoutes(app);

  // Seed database in development
  if (app.get("env") === "development") {
    await seedDatabase();
    
    // Clean up any broken image references
    await cleanupProjectImages();
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Render the homepage from current CMS records so crawlers receive the
  // same hero, about, projects, and partnership content as app visitors.
  app.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const isDev = app.get("env") === "development";
      const [hero, about, projects, partnerships] = await Promise.all([
        storage.getHeroContent(),
        storage.getAboutContent(),
        storage.getProjects(),
        storage.getPartnerships(),
      ]);

      const personName = hero?.name || "Malek Fouda";
      const personTitle = "Full-Stack Developer";
      const homepageTitle = `${personName} | WooCommerce, WordPress & Custom Web Development`;
      const homepageDescription =
        "Malek Fouda helps businesses and agencies build, improve, and support WooCommerce stores, custom web applications, dashboards, portals, and integrations.";
      const bodyContent = buildHomepageBodyHtml({
        hero,
        about,
        projects,
        partnerships: partnerships.slice(0, 2),
      });

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": homepageTitle,
        "description": homepageDescription,
        "url": SITE_URL,
        "mainEntity": {
          "@type": "Person",
          "name": personName,
          "jobTitle": personTitle,
          "description": homepageDescription,
          "url": SITE_URL,
        },
        "about": [
          { "@type": "Service", "name": "Website technical audit" },
          { "@type": "Service", "name": "WooCommerce rescue and improvement" },
          { "@type": "Service", "name": "Custom business systems" },
          { "@type": "Service", "name": "Development partner retainer" },
        ],
        "hasPart": projects.slice(0, 6).map((project) => {
          const projectUrl = sanitizeHttpUrl(project.url);

          return {
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.description,
            ...(projectUrl ? { "url": projectUrl } : {}),
          };
        }),
      };

      const html = await buildRouteHtml(isDev, {
        title: homepageTitle,
        description: homepageDescription,
        canonical: SITE_URL,
        ogTitle: homepageTitle,
        ogDescription: homepageDescription,
        ogImage: SOCIAL_IMAGE_URL,
        keywords:
          "Malek Fouda, WooCommerce developer, WordPress developer, custom web application development, business dashboards, web development support, website technical audit, Egypt web developer",
        jsonLd,
        bodyContent,
      });

      if (!html) return next();

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      next(err);
    }
  });

  // Server-render the /portfolio route with route-specific metadata AND
  // a pre-rendered project grid from live DB data so crawlers and social
  // bots receive full page content in the first HTML response.
  app.get("/portfolio", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isDev = app.get("env") === "development";

      const portfolioTitle = "Client Work & Web Development Case Studies | Malek Fouda";
      const portfolioDescription = "Explore Malek Fouda’s web development work, including e-commerce, custom applications, and professional projects with verified scope, responsibilities, technologies, and live links.";
      const canonicalUrl = `${SITE_URL}/portfolio`;
      const keywords = "Malek Fouda client work, web development case studies, WooCommerce projects, WordPress development, custom web applications, business dashboards";

      // Fetch live project data for the pre-rendered snapshot.
      const projects = await storage.getProjects();
      const bodyContent = buildPortfolioBodyHtml(projects);

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": portfolioTitle,
        "description": portfolioDescription,
        "url": canonicalUrl,
        "author": {
          "@type": "Person",
          "name": "Malek Fouda",
          "url": SITE_URL,
          "jobTitle": "Full Stack Developer",
          "sameAs": [
            "https://github.com/malekfouda",
            "https://linkedin.com/in/malekfouda"
          ]
        },
        "about": {
          "@type": "Thing",
          "name": "Web Development Projects",
          "description": "A collection of full-stack web development projects built with React, Node.js, TypeScript, PHP, Laravel, and other modern technologies."
        },
        "hasPart": projects.slice(0, 10).map((project) => {
          const projectUrl = sanitizeHttpUrl(project.url);

          return {
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.description,
            ...(projectUrl ? { "url": projectUrl } : {}),
          };
        })
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
      });

      if (!html) return next();

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      next(err);
    }
  });

  // Known public SPA routes — any other HTML request gets a real 404 status.
  // This prevents soft-404s where search crawlers receive HTTP 200 for invalid URLs.
  const KNOWN_SPA_ROUTES = new Set(['/', '/portfolio']);

  app.use((req, res, next) => {
    const url = req.path;

    // Pass through: API routes, uploads, and any request with a file extension (assets)
    if (
      url.startsWith('/api') ||
      url.startsWith('/uploads') ||
      /\.\w+/.test(url)
    ) {
      return next();
    }

    // Known SPA pages — let Vite / serveStatic handle them with 200
    if (KNOWN_SPA_ROUTES.has(url)) {
      return next();
    }

    // Unknown route — serve the app shell with a proper 404 status so crawlers
    // receive an unambiguous signal while the React NotFound UI still renders.
    const isDev = app.get("env") === "development";
    const htmlPath = isDev
      ? path.resolve(process.cwd(), "client", "index.html")
      : path.resolve(process.cwd(), "dist", "public", "index.html");

    if (fs.existsSync(htmlPath)) {
      res.status(404).sendFile(htmlPath);
    } else {
      res.status(404).send("Not Found");
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

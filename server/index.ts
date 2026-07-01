import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { setupSecurity, uploadSecurityMiddleware } from "./security";
import { cleanupProjectImages } from "./imageCleanup";
import path from "path";

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

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertHeroContentSchema,
  insertAboutContentSchema,
  insertProjectSchema,
  insertSkillSchema,
  insertPartnershipSchema,
  insertContactInfoSchema,
  insertServiceSchema,
  updateServiceSchema,
  insertCaseStudySchema,
  updateCaseStudySchema,
} from "@shared/schema";
import { 
  validateContactForm, 
  validateLogin, 
  handleValidationErrors, 
  sanitizeInput, 
  sanitizeHtml,
  contactFormRateLimit,
  contactSlowDown
} from "./security";
import { z } from "zod";
import { requireAuth, login } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import { containsHighConfidenceSpam, validateHumanSignals, verifyTurnstile } from "./contactProtection";
import { notifyAboutLead } from "./leadNotifications";

// Set up multer with memory storage — images are converted to base64 and stored in the DB
// This ensures images persist across deployments and work in both dev and production
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Invalid file extension'));
    }
    const maliciousPatterns = [/\.\./g, /\//g, /\\/g, /\0/g, /[<>:"|?*]/g];
    if (maliciousPatterns.some(pattern => pattern.test(file.originalname))) {
      return cb(new Error('Invalid filename'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
    fields: 10
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", 
    validateLogin, 
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        // Sanitize inputs
        const sanitizedUsername = sanitizeInput(req.body.username);
        const sanitizedPassword = sanitizeInput(req.body.password);
        
        if (!sanitizedUsername || !sanitizedPassword) {
          return res.status(400).json({ error: "Username and password are required" });
        }
        
        // Additional security checks
        if (sanitizedUsername.length < 3 || sanitizedUsername.length > 30) {
          return res.status(400).json({ error: "Invalid username length" });
        }
        
        if (sanitizedPassword.length < 8) {
          return res.status(400).json({ error: "Password too short" });
        }
        
        const result = await login(sanitizedUsername, sanitizedPassword);
        if (result.success) {
          res.json({ success: true, token: result.token });
        } else {
          res.status(401).json({ error: result.error });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // File upload endpoint — converts to base64 data URL stored in DB (works in all environments)
  app.post("/api/upload", requireAuth, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      // Convert buffer to base64 data URL — stored directly in DB, no filesystem needed
      const base64 = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
      console.log(`File uploaded and converted to base64: ${req.file.originalname} (${req.file.size} bytes)`);
      res.json({ url: dataUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Image cleanup endpoint
  app.post("/api/cleanup-images", requireAuth, async (req, res) => {
    try {
      const { cleanupProjectImages, findOrphanedFiles } = await import("./imageCleanup");
      
      await cleanupProjectImages();
      const orphaned = await findOrphanedFiles();
      
      res.json({ 
        success: true, 
        message: "Image cleanup completed",
        orphanedFiles: orphaned
      });
    } catch (error) {
      console.error("Cleanup error:", error);
      res.status(500).json({ error: "Failed to cleanup images" });
    }
  });

  // Public API endpoints for website content
  app.get("/api/hero", async (req, res) => {
    try {
      const hero = await storage.getHeroContent();
      res.json(hero);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero content" });
    }
  });

  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch about content" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = (await storage.getProjects()).filter((project) => project.isVisible);
      
      // Validate and clean image URLs
      const cleanedProjects = projects.map(project => ({
        ...project,
        image: project.image && project.image.startsWith('/uploads/') 
          ? project.image 
          : project.image
      }));
      
      res.json(cleanedProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/skills", async (req, res) => {
    try {
      const skills = (await storage.getSkills()).filter((skill) => skill.isVisible);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/partnerships", async (req, res) => {
    try {
      const partnerships = (await storage.getPartnerships()).filter((partnership) => partnership.isVisible);
      res.json(partnerships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partnerships" });
    }
  });

  app.get("/api/contact-info", async (req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json(contactInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact info" });
    }
  });

  app.get("/api/services", async (_req, res) => {
    try {
      res.json(await storage.getServices(true));
    } catch {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug, true);
      if (!service) return res.status(404).json({ error: "Service not found" });
      return res.json(service);
    } catch {
      return res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.get("/api/case-studies", async (_req, res) => {
    try {
      res.json(await storage.getCaseStudies(true));
    } catch {
      res.status(500).json({ error: "Failed to fetch case studies" });
    }
  });

  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const caseStudy = await storage.getCaseStudyBySlug(req.params.slug, true);
      if (!caseStudy) return res.status(404).json({ error: "Case study not found" });
      return res.json(caseStudy);
    } catch {
      return res.status(500).json({ error: "Failed to fetch case study" });
    }
  });

  // Contact form submission
  app.post("/api/contact", 
    validateContactForm, 
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const humanSignals = validateHumanSignals(req.body.companyFax, req.body.formStartedAt);
        if (!humanSignals.valid) {
          return res.status(400).json({
            success: false,
            message: "Please refresh the page and try submitting the form again.",
          });
        }

        const turnstile = await verifyTurnstile(req.body.turnstileToken, req.ip);
        if (!turnstile.success) {
          return res.status(400).json({
            success: false,
            message: "Please complete the security check and try again.",
          });
        }

        const cleanOptional = (value: unknown, maxLength: number) =>
          typeof value === "string" && value.trim()
            ? sanitizeHtml(sanitizeInput(value)).slice(0, maxLength)
            : null;
        const sanitizedData = {
          name: sanitizeHtml(sanitizeInput(req.body.name)),
          email: sanitizeHtml(sanitizeInput(req.body.email)),
          company: cleanOptional(req.body.company, 120),
          websiteUrl: cleanOptional(req.body.websiteUrl, 300),
          projectType: cleanOptional(req.body.projectType, 80),
          message: sanitizeHtml(sanitizeInput(req.body.message)),
          budgetRange: cleanOptional(req.body.budgetRange, 80),
          timeline: cleanOptional(req.body.timeline, 80),
          preferredContact: cleanOptional(req.body.preferredContact, 20) || "email",
          landingPage: cleanOptional(req.body.landingPage, 300),
          referrer: cleanOptional(req.body.referrer, 500),
          utmSource: cleanOptional(req.body.utmSource, 120),
          utmMedium: cleanOptional(req.body.utmMedium, 120),
          utmCampaign: cleanOptional(req.body.utmCampaign, 180),
        };
        
        // Additional validation checks
        if (
          !sanitizedData.name ||
          !sanitizedData.email ||
          !sanitizedData.message
        ) {
          return res.status(400).json({ 
            success: false, 
            message: "Please complete all required fields"
          });
        }
        
        // Check for spam patterns
        if (containsHighConfidenceSpam(sanitizedData.name, sanitizedData.email, sanitizedData.message)) {
          return res.status(400).json({ 
            success: false, 
            message: "Message contains prohibited content" 
          });
        }
        
        // Additional email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(sanitizedData.email)) {
          return res.status(400).json({ 
            success: false, 
            message: "Invalid email format" 
          });
        }
        
        // Parse with Zod for final validation
        const contactData = insertContactSchema.parse(sanitizedData);
        const contact = await storage.createContact(contactData);
        await notifyAboutLead(contact);
        
        res.json({ 
          success: true, 
          message: "Thank you for your message. We'll get back to you soon!" 
        });
      } catch (error) {
        console.error("Contact form error:", error);
        
        // Handle Zod validation errors with user-friendly messages
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          let friendlyMessage = "Please check your input and try again";
          
          if (firstError.path.includes('message') && firstError.code === 'too_small') {
            friendlyMessage = "Your message is too short. Please write at least 10 characters.";
          } else if (firstError.path.includes('message') && firstError.code === 'too_big') {
            friendlyMessage = "Your message is too long. Please keep it under 2000 characters.";
          } else if (firstError.path.includes('name')) {
            friendlyMessage = "Please provide a valid name (2-80 characters).";
          } else if (firstError.path.includes('email')) {
            friendlyMessage = "Please provide a valid email address.";
          }
          
          return res.status(400).json({ 
            success: false, 
            message: friendlyMessage 
          });
        }
        
        res.status(500).json({ 
          success: false, 
          message: "Something went wrong. Please try again." 
        });
      }
    }
  );

  // Dashboard API Routes (Protected)
  
  // Contacts management
  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.put("/api/admin/contacts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const contact = await storage.updateContactStatus(parseInt(id), status);
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/admin/contacts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContact(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Hero content
  app.get("/api/admin/hero", requireAuth, async (req, res) => {
    try {
      const hero = await storage.getHeroContent();
      res.json(hero);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero content" });
    }
  });

  app.put("/api/admin/hero", requireAuth, async (req, res) => {
    try {
      const hero = insertHeroContentSchema.parse(req.body);
      const result = await storage.updateHeroContent(hero);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid hero content data" });
    }
  });

  // About content
  app.get("/api/admin/about", requireAuth, async (req, res) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch about content" });
    }
  });

  app.put("/api/admin/about", requireAuth, async (req, res) => {
    try {
      const about = insertAboutContentSchema.parse(req.body);
      const result = await storage.updateAboutContent(about);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid about content data" });
    }
  });

  // Projects
  app.get("/api/admin/projects", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/admin/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/admin/projects", requireAuth, async (req, res) => {
    try {
      const project = insertProjectSchema.parse(req.body);
      const result = await storage.createProject(project);
      res.json(result);
    } catch (error) {
      console.error("Project creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Invalid project data", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.put("/api/admin/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = insertProjectSchema.parse(req.body);
      const result = await storage.updateProject(id, project);
      res.json(result);
    } catch (error) {
      console.error("Project update error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Invalid project data", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: "Failed to update project" });
      }
    }
  });

  app.delete("/api/admin/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Skills
  app.get("/api/admin/skills", requireAuth, async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/admin/skills", requireAuth, async (req, res) => {
    try {
      const skill = insertSkillSchema.parse(req.body);
      const result = await storage.createSkill(skill);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid skill data" });
    }
  });

  app.put("/api/admin/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skill = insertSkillSchema.parse(req.body);
      const result = await storage.updateSkill(id, skill);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid skill data" });
    }
  });

  app.delete("/api/admin/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSkill(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Partnerships
  app.get("/api/admin/partnerships", requireAuth, async (req, res) => {
    try {
      const partnerships = await storage.getPartnerships();
      res.json(partnerships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partnerships" });
    }
  });

  app.post("/api/admin/partnerships", requireAuth, async (req, res) => {
    try {
      const partnership = insertPartnershipSchema.parse(req.body);
      const result = await storage.createPartnership(partnership);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid partnership data" });
    }
  });

  app.put("/api/admin/partnerships/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const partnership = insertPartnershipSchema.parse(req.body);
      const result = await storage.updatePartnership(id, partnership);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid partnership data" });
    }
  });

  app.delete("/api/admin/partnerships/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartnership(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete partnership" });
    }
  });

  // Contact Info
  app.get("/api/admin/contact-info", requireAuth, async (req, res) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact info" });
    }
  });

  app.put("/api/admin/contact-info", requireAuth, async (req, res) => {
    try {
      const info = insertContactInfoSchema.parse(req.body);
      const result = await storage.updateContactInfo(info);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact info data" });
    }
  });

  // Services
  app.get("/api/admin/services", requireAuth, async (_req, res) => {
    try {
      res.json(await storage.getServices());
    } catch {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAuth, async (req, res) => {
    try {
      res.json(await storage.createService(insertServiceSchema.parse(req.body)));
    } catch (error) {
      res.status(400).json({ error: "Invalid service data", details: error instanceof z.ZodError ? error.flatten() : undefined });
    }
  });

  app.put("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      res.json(await storage.updateService(Number(req.params.id), updateServiceSchema.parse(req.body)));
    } catch (error) {
      res.status(400).json({ error: "Invalid service data", details: error instanceof z.ZodError ? error.flatten() : undefined });
    }
  });

  app.delete("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteService(Number(req.params.id));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Case studies
  app.get("/api/admin/case-studies", requireAuth, async (_req, res) => {
    try {
      res.json(await storage.getCaseStudies());
    } catch {
      res.status(500).json({ error: "Failed to fetch case studies" });
    }
  });

  app.post("/api/admin/case-studies", requireAuth, async (req, res) => {
    try {
      res.json(await storage.createCaseStudy(insertCaseStudySchema.parse(req.body)));
    } catch (error) {
      res.status(400).json({ error: "Invalid case study data", details: error instanceof z.ZodError ? error.flatten() : undefined });
    }
  });

  app.put("/api/admin/case-studies/:id", requireAuth, async (req, res) => {
    try {
      res.json(await storage.updateCaseStudy(Number(req.params.id), updateCaseStudySchema.parse(req.body)));
    } catch (error) {
      res.status(400).json({ error: "Invalid case study data", details: error instanceof z.ZodError ? error.flatten() : undefined });
    }
  });

  app.delete("/api/admin/case-studies/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCaseStudy(Number(req.params.id));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete case study" });
    }
  });

  // SEO-friendly routes
  app.get("/robots.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
  });

  app.get("/llms.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(path.join(process.cwd(), "public", "llms.txt"));
  });

  const sendSitemap = async (_req: Request, res: Response) => {
    try {
      const [services, caseStudies, projects] = await Promise.all([
        storage.getServices(true),
        storage.getCaseStudies(true),
        storage.getProjects(),
      ]);
      const visibleProjects = projects.filter((project) => project.isVisible);
      const latestDate = (dates: Date[]) => dates.length
        ? new Date(Math.max(...dates.map((date) => new Date(date).getTime())))
        : undefined;
      const projectDate = latestDate(visibleProjects.map((project) => project.updatedAt));
      const serviceDate = latestDate(services.map((service) => service.updatedAt));
      const caseStudyDate = latestDate(caseStudies.map((study) => study.updatedAt));
      const entries = [
        { path: "/", priority: "1.0", lastModified: latestDate([...(projectDate ? [projectDate] : []), ...(serviceDate ? [serviceDate] : []), ...(caseStudyDate ? [caseStudyDate] : [])]) },
        { path: "/services", priority: "0.9", lastModified: serviceDate },
        ...services.map((service) => ({ path: `/services/${service.slug}`, priority: service.isFeatured ? "0.9" : "0.8", lastModified: service.updatedAt })),
        { path: "/solutions", priority: "0.9", lastModified: new Date("2026-09-10T00:00:00.000Z") },
        ...commercialLandingPages.map((page) => ({ path: `/solutions/${page.slug}`, priority: "0.8", lastModified: new Date("2026-09-10T00:00:00.000Z") })),
        { path: "/portfolio", priority: "0.8", lastModified: projectDate },
        { path: "/work", priority: "0.8", lastModified: caseStudyDate },
        ...caseStudies.map((study) => ({ path: `/work/${study.slug}`, priority: study.isFeatured ? "0.9" : "0.8", lastModified: study.updatedAt })),
        { path: "/about", priority: "0.6" },
        { path: "/contact", priority: "0.8" },
        { path: "/privacy", priority: "0.3" },
      ];
      const urls = entries.map(({ path: url, priority, lastModified }) => `  <url><loc>https://malekfouda.com${url}</loc>${lastModified ? `<lastmod>${new Date(lastModified).toISOString()}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>${priority}</priority></url>`).join("\n");
      res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
      res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
    } catch {
      res.status(500).type("text/plain").send("Unable to generate sitemap");
    }
  };

  app.get("/sitemap.xml", sendSitemap);
  app.get("/public/sitemap.xml", (_req, res) => res.redirect(301, "/sitemap.xml"));

  app.get("/.well-known/security.txt", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", ".well-known", "security.txt"));
  });

  app.get("/site.webmanifest", (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(path.join(process.cwd(), "public", "site.webmanifest"));
  });

  app.get("/browserconfig.xml", (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.join(process.cwd(), "public", "browserconfig.xml"));
  });

  // Force favicon to be served with proper headers for Google indexing
  app.get("/favicon.ico", (req, res) => {
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day for Google
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), "public", "favicon.ico"));
  });

  // Additional favicon routes for different browsers
  app.get("/favicon.svg", (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), "public", "favicon.svg"));
  });

  app.get("/favicon-16x16.png", (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), "public", "favicon-16x16.png"));
  });

  // Also handle requests for apple-touch-icon.png
  app.get("/apple-touch-icon.png", (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), "public", "apple-touch-icon.png"));
  });

  // Social platforms fetch this image directly when rendering link previews.
  app.get("/og-image.png", (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), "public", "og-image.png"));
  });


  
  // Static file serving for uploads directory
  const staticOptions = {
    maxAge: '24h',
    etag: true,
    lastModified: true,
    dotfiles: 'deny', // Prevent serving hidden files
    index: false // Prevent directory listing
  };
  
  app.use('/uploads', (req, res, next) => {
    const filePath = req.path;
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = allowedExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
    
    if (!hasValidExtension) {
      return res.status(403).json({ error: 'File type not allowed' });
    }
    
    if (filePath.includes('..') || filePath.includes('//')) {
      return res.status(403).json({ error: 'Invalid file path' });
    }
    
    next();
  });
  
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), staticOptions));

  const httpServer = createServer(app);
  return httpServer;
}

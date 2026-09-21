import type { Express, NextFunction, Request, Response } from "express";
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
  cleanText,
  contactFormRateLimit,
  contactSlowDown
} from "./security";
import { z } from "zod";
import { requireAuth, login, type AuthenticatedRequest } from "./auth";
import { clearSessionCookie, setSessionCookie } from "./sessionCookie";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import { commercialLandingPages } from "@shared/commercialLandingPages";
import { containsHighConfidenceSpam, validateHumanSignals, verifyTurnstile } from "./contactProtection";
import { notifyAboutLead } from "./leadNotifications";
import {
  getProjectMediaSource,
  getPublicProject,
  optimizeDataImageUrl,
  optimizeProjectImage,
} from "./projectImages";

// Keep the source in memory long enough to validate and optimize it. The optimized
// WebP remains database-backed, while public responses expose a cacheable media URL.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
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

const acceptProjectImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (error: unknown) => {
    if (!error) return next();
    const message = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
      ? 'Image must be 5MB or smaller'
      : error instanceof Error ? error.message : 'Invalid upload';
    return res.status(400).json({ error: message });
  });
};

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

const contactStatusSchema = z.object({ status: z.enum(["new", "contacted", "resolved"]) });

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", 
    validateLogin, 
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        // validateLogin has already checked shape and length. The password is
        // compared exactly as typed so no characters are silently dropped.
        const username = cleanText(req.body.username, 30);
        const password: string = req.body.password;

        const result = await login(username, password);
        if (result.success) {
          setSessionCookie(res, result.token);
          res.json({ success: true, user: result.user });
        } else {
          res.status(401).json({ error: result.error });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  app.post("/api/auth/logout", (_req, res) => {
    clearSessionCookie(res);
    res.json({ success: true });
  });

  app.get("/api/admin/session", requireAuth, (req: AuthenticatedRequest, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ user: req.user });
  });

  // File upload endpoint — strips metadata, bounds dimensions, and stores a compact
  // WebP data URL so assets survive deployment without bloating public documents.
  app.post("/api/upload", requireAuth, acceptProjectImage, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const optimized = await optimizeProjectImage(req.file.buffer);
      const dataUrl = `data:image/webp;base64,${optimized.toString('base64')}`;
      console.log(`Optimized image upload: ${req.file.originalname} (${req.file.size} -> ${optimized.length} bytes)`);
      res.json({ url: dataUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.get("/media/projects/:id/:asset", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id <= 0) return res.status(404).end();

      const project = await storage.getProject(id);
      if (!project || !project.isVisible) return res.status(404).end();
      const source = getProjectMediaSource(project, req.params.asset);
      if (!source) return res.status(404).end();

      const optimized = await optimizeDataImageUrl(
        source,
        `${project.id}:${new Date(project.updatedAt).getTime()}:${req.params.asset}`,
      );
      if (!optimized) return res.status(404).end();

      res.set({
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
      });
      return res.send(optimized);
    } catch (error) {
      console.error("Project media error:", error);
      return res.status(500).end();
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
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
      res.json(projects.map(getPublicProject));
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
          cleanText(value, maxLength) || null;
        const sanitizedData = {
          name: cleanText(req.body.name, 80),
          email: cleanText(req.body.email, 180),
          company: cleanOptional(req.body.company, 120),
          websiteUrl: cleanOptional(req.body.websiteUrl, 300),
          projectType: cleanOptional(req.body.projectType, 80),
          message: cleanText(req.body.message, 2000),
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const parsed = contactStatusSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid status" });
      const contact = await storage.updateContactStatus(id, parsed.data.status);
      if (!contact) return res.status(404).json({ error: "Contact not found" });
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/admin/contacts/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      if (!(await storage.deleteContact(id))) return res.status(404).json({ error: "Contact not found" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const project = insertProjectSchema.parse(req.body);
      const result = await storage.updateProject(id, project);
      if (!result) return res.status(404).json({ error: "Project not found" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      if (!(await storage.deleteProject(id))) return res.status(404).json({ error: "Project not found" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const skill = insertSkillSchema.parse(req.body);
      const result = await storage.updateSkill(id, skill);
      if (!result) return res.status(404).json({ error: "Skill not found" });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid skill data" });
    }
  });

  app.delete("/api/admin/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      if (!(await storage.deleteSkill(id))) return res.status(404).json({ error: "Skill not found" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const partnership = insertPartnershipSchema.parse(req.body);
      const result = await storage.updatePartnership(id, partnership);
      if (!result) return res.status(404).json({ error: "Partnership not found" });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid partnership data" });
    }
  });

  app.delete("/api/admin/partnerships/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      if (!(await storage.deletePartnership(id))) return res.status(404).json({ error: "Partnership not found" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const result = await storage.updateService(id, updateServiceSchema.parse(req.body));
      if (!result) return res.status(404).json({ error: "Service not found" });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data", details: error instanceof z.ZodError ? error.flatten() : undefined });
    }
  });

  app.delete("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      if (!(await storage.deleteService(id))) return res.status(404).json({ error: "Service not found" });
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
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      const result = await storage.updateCaseStudy(id, updateCaseStudySchema.parse(req.body));
      if (!result) return res.status(404).json({ error: "Case study not found" });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid case study data", details: error instanceof z.ZodError ? error.flatten() : undefined });
    }
  });

  app.delete("/api/admin/case-studies/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });
      if (!(await storage.deleteCaseStudy(id))) return res.status(404).json({ error: "Case study not found" });
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

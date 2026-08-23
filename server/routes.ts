import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertHeroContentSchema,
  insertAboutContentSchema,
  insertProjectSchema,
  insertSkillSchema,
  insertPartnershipSchema,
  insertContactInfoSchema
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
    async (req, res) => {
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
      const projects = await storage.getProjects();
      
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
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/partnerships", async (req, res) => {
    try {
      const partnerships = await storage.getPartnerships();
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

  // Contact form submission
  app.post("/api/contact", 
    validateContactForm, 
    handleValidationErrors,
    async (req, res) => {
      try {
        // Double sanitization for extra security
        const sanitizedData = {
          name: sanitizeHtml(sanitizeInput(req.body.name)),
          email: sanitizeHtml(sanitizeInput(req.body.email)),
          message: sanitizeHtml(sanitizeInput(req.body.message)),
          company: typeof req.body.company === "string" && req.body.company.trim()
            ? sanitizeHtml(sanitizeInput(req.body.company))
            : undefined,
          website: typeof req.body.website === "string" && req.body.website.trim()
            ? sanitizeHtml(sanitizeInput(req.body.website))
            : undefined,
          projectType: typeof req.body.projectType === "string" && req.body.projectType.trim()
            ? req.body.projectType
            : undefined,
          goals: typeof req.body.goals === "string" && req.body.goals.trim()
            ? sanitizeHtml(sanitizeInput(req.body.goals))
            : undefined,
          budgetRange: typeof req.body.budgetRange === "string" && req.body.budgetRange.trim()
            ? req.body.budgetRange
            : undefined,
          timeline: typeof req.body.timeline === "string" && req.body.timeline.trim()
            ? req.body.timeline
            : undefined,
          preferredContact: typeof req.body.preferredContact === "string" && req.body.preferredContact.trim()
            ? req.body.preferredContact
            : undefined,
        };
        
        // Additional validation checks
        if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
          return res.status(400).json({ 
            success: false, 
            message: "All fields are required" 
          });
        }
        
        // Check for spam patterns
        const spamPatterns = [
          /viagra|cialis|pharmacy|casino|lottery|winner|bitcoin|crypto|investment|loan|debt|credit|urgent|click here|free money|get rich|make money fast/i,
          /http[s]?:\/\//i, // URLs in message
          /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/i, // Credit card patterns
          /\b\d{3}-\d{2}-\d{4}\b/i, // SSN patterns
        ];
        
        const isSpam = spamPatterns.some(pattern => 
          pattern.test(sanitizedData.name) || 
          pattern.test(sanitizedData.email) || 
          pattern.test(sanitizedData.message)
        );
        
        if (isSpam) {
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
            friendlyMessage = "Your message is too long. Please keep it under 1000 characters.";
          } else if (firstError.path.includes('name')) {
            friendlyMessage = "Please provide a valid name (2-50 characters, letters only).";
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

  // SEO-friendly routes
  app.get("/robots.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
  });

  app.get("/llms.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(path.join(process.cwd(), "public", "llms.txt"));
  });

  app.get("/sitemap.xml", (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
  });

  // Alternative sitemap path for Google Search Console
  app.get("/public/sitemap.xml", (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
  });

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

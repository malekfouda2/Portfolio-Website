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
import { z } from "zod";
import { requireAuth, login } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Set up multer for file uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", login);

  // File upload endpoint
  app.post("/api/upload", requireAuth, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Dashboard API Routes (Protected)
  
  // Contacts management
  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
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
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.put("/api/admin/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = insertProjectSchema.parse(req.body);
      const result = await storage.updateProject(id, project);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
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

  const httpServer = createServer(app);
  return httpServer;
}

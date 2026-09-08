import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  websiteUrl: text("website_url"),
  projectType: text("project_type"),
  message: text("message").notNull(),
  budgetRange: text("budget_range"),
  timeline: text("timeline"),
  preferredContact: text("preferred_contact"),
  landingPage: text("landing_page"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  status: text("status").notNull().default("new"), // 'new', 'contacted', 'resolved'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const heroContent = pgTable("hero_content", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  typingTexts: jsonb("typing_texts").$type<string[]>().notNull(),
  description: text("description").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  projectsDelivered: integer("projects_delivered").notNull(),
  clientSatisfaction: integer("client_satisfaction").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  expertise: jsonb("expertise").$type<string[]>().notNull(),
  personalDescription: text("personal_description").notNull(),
  approach: text("approach").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: jsonb("technologies").$type<string[]>().notNull(),
  image: text("image").notNull(),
  type: text("type").notNull(), // 'personal', 'freelance', 'company'
  url: text("url"),
  screenshots: jsonb("screenshots").$type<string[]>(),
  companyName: text("company_name"), // For company projects
  companyUrl: text("company_url"), // For company projects
  role: text("role"), // Your specific role/contribution
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const partnerships = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  logo: text("logo").notNull(),
  badgeText: text("badge_text").notNull(),
  badgeColor: text("badge_color").notNull(),
  stats: jsonb("stats").$type<Record<string, string>>().notNull(),
  specializations: jsonb("specializations").$type<string[]>().notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  responseTime: text("response_time").notNull(),
  description: text("description").notNull(),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ServiceFaq = {
  question: string;
  answer: string;
};

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: text("title").notNull(),
  eyebrow: text("eyebrow").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  audience: text("audience").notNull(),
  problem: text("problem").notNull(),
  outcome: text("outcome").notNull(),
  deliverables: jsonb("deliverables").$type<string[]>().notNull(),
  faqs: jsonb("faqs").$type<ServiceFaq[]>().notNull().default([]),
  icon: text("icon").notNull().default("code"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: text("seo_title").notNull(),
  seoDescription: text("seo_description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  industry: text("industry").notNull().default(""),
  summary: text("summary").notNull().default(""),
  context: text("context").notNull().default(""),
  problem: text("problem").notNull().default(""),
  role: text("role").notNull().default(""),
  approach: text("approach").notNull().default(""),
  solution: text("solution").notNull().default(""),
  challenges: jsonb("challenges").$type<string[]>().notNull().default([]),
  results: jsonb("results").$type<string[]>().notNull().default([]),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  image: text("image"),
  screenshots: jsonb("screenshots").$type<string[]>().notNull().default([]),
  serviceSlugs: jsonb("service_slugs").$type<string[]>().notNull().default([]),
  liveUrl: text("live_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts)
  .pick({
    name: true,
    email: true,
    company: true,
    websiteUrl: true,
    projectType: true,
    message: true,
    budgetRange: true,
    timeline: true,
    preferredContact: true,
    landingPage: true,
    referrer: true,
    utmSource: true,
    utmMedium: true,
    utmCampaign: true,
  })
  .extend({
    name: z.string().min(2).max(80),
    email: z.string().email().max(180),
    company: z.string().min(2).max(120),
    websiteUrl: z.string().max(300).nullable().optional(),
    projectType: z.string().min(2).max(80),
    message: z.string().min(10).max(2000),
    budgetRange: z.string().min(2).max(80),
    timeline: z.string().min(2).max(80),
    preferredContact: z.enum(["email", "calendly", "whatsapp"]),
    landingPage: z.string().max(300).nullable().optional(),
    referrer: z.string().max(500).nullable().optional(),
    utmSource: z.string().max(120).nullable().optional(),
    utmMedium: z.string().max(120).nullable().optional(),
    utmCampaign: z.string().max(180).nullable().optional(),
  });

export const insertHeroContentSchema = createInsertSchema(heroContent)
  .omit({ id: true, updatedAt: true })
  .extend({ typingTexts: z.array(z.string()) });

export const insertAboutContentSchema = createInsertSchema(aboutContent)
  .omit({ id: true, updatedAt: true })
  .extend({ expertise: z.array(z.string()) });

export const insertProjectSchema = createInsertSchema(projects)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    technologies: z.array(z.string()),
    screenshots: z.array(z.string()).nullable().optional(),
  });

export const updateProjectSchema = insertProjectSchema.partial();

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertPartnershipSchema = createInsertSchema(partnerships)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    stats: z.record(z.string()),
    specializations: z.array(z.string()),
  });

export const insertContactInfoSchema = createInsertSchema(contactInfo)
  .omit({ id: true, updatedAt: true })
  .extend({ socialLinks: z.record(z.string()) });

export const insertServiceSchema = createInsertSchema(services)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    deliverables: z.array(z.string()),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  });
export const updateServiceSchema = insertServiceSchema.partial();

export const insertCaseStudySchema = createInsertSchema(caseStudies)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    challenges: z.array(z.string()),
    results: z.array(z.string()),
    technologies: z.array(z.string()),
    screenshots: z.array(z.string()),
    serviceSlugs: z.array(z.string()),
  });
export const updateCaseStudySchema = insertCaseStudySchema.partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertHeroContent = z.infer<typeof insertHeroContentSchema>;
export type HeroContent = typeof heroContent.$inferSelect;
export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertPartnership = z.infer<typeof insertPartnershipSchema>;
export type Partnership = typeof partnerships.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;

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
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const heroContent = pgTable("hero_content", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  typingTexts: jsonb("typing_texts").notNull(),
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
  expertise: jsonb("expertise").notNull(),
  personalDescription: text("personal_description").notNull(),
  approach: text("approach").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: jsonb("technologies").notNull(),
  image: text("image").notNull(),
  type: text("type").notNull(),
  url: text("url"),
  screenshots: jsonb("screenshots"),
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
  stats: jsonb("stats").notNull(),
  specializations: jsonb("specializations").notNull(),
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
  socialLinks: jsonb("social_links").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  message: true,
});

export const insertHeroContentSchema = createInsertSchema(heroContent).omit({
  id: true,
  updatedAt: true,
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({
  id: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertPartnershipSchema = createInsertSchema(partnerships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

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

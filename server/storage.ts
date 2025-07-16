import {
  users,
  contacts,
  heroContent,
  aboutContent,
  projects,
  skills,
  partnerships,
  contactInfo,
  type User,
  type InsertUser,
  type Contact,
  type InsertContact,
  type HeroContent,
  type InsertHeroContent,
  type AboutContent,
  type InsertAboutContent,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type Partnership,
  type InsertPartnership,
  type ContactInfo,
  type InsertContactInfo,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Hero Content
  getHeroContent(): Promise<HeroContent | undefined>;
  updateHeroContent(content: InsertHeroContent): Promise<HeroContent>;
  
  // About Content
  getAboutContent(): Promise<AboutContent | undefined>;
  updateAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Skills
  getSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;
  
  // Partnerships
  getPartnerships(): Promise<Partnership[]>;
  getPartnership(id: number): Promise<Partnership | undefined>;
  createPartnership(partnership: InsertPartnership): Promise<Partnership>;
  updatePartnership(id: number, partnership: Partial<InsertPartnership>): Promise<Partnership>;
  deletePartnership(id: number): Promise<void>;
  
  // Contact Info
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  // Hero Content
  async getHeroContent(): Promise<HeroContent | undefined> {
    const [content] = await db.select().from(heroContent).limit(1);
    return content;
  }

  async updateHeroContent(content: InsertHeroContent): Promise<HeroContent> {
    const existing = await this.getHeroContent();
    if (existing) {
      const [updated] = await db
        .update(heroContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(heroContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(heroContent).values(content).returning();
      return created;
    }
  }

  // About Content
  async getAboutContent(): Promise<AboutContent | undefined> {
    const [content] = await db.select().from(aboutContent).limit(1);
    return content;
  }

  async updateAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const existing = await this.getAboutContent();
    if (existing) {
      const [updated] = await db
        .update(aboutContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(aboutContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(aboutContent).values(content).returning();
      return created;
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .orderBy(asc(skills.sortOrder), asc(skills.name));
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [created] = await db.insert(skills).values(skill).returning();
    return created;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill> {
    const [updated] = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return updated;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Partnerships
  async getPartnerships(): Promise<Partnership[]> {
    return await db
      .select()
      .from(partnerships)
      .orderBy(asc(partnerships.sortOrder), desc(partnerships.createdAt));
  }

  async getPartnership(id: number): Promise<Partnership | undefined> {
    const [partnership] = await db.select().from(partnerships).where(eq(partnerships.id, id));
    return partnership;
  }

  async createPartnership(partnership: InsertPartnership): Promise<Partnership> {
    const [created] = await db.insert(partnerships).values(partnership).returning();
    return created;
  }

  async updatePartnership(id: number, partnership: Partial<InsertPartnership>): Promise<Partnership> {
    const [updated] = await db
      .update(partnerships)
      .set({ ...partnership, updatedAt: new Date() })
      .where(eq(partnerships.id, id))
      .returning();
    return updated;
  }

  async deletePartnership(id: number): Promise<void> {
    await db.delete(partnerships).where(eq(partnerships.id, id));
  }

  // Contact Info
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const [info] = await db.select().from(contactInfo).limit(1);
    return info;
  }

  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const existing = await this.getContactInfo();
    if (existing) {
      const [updated] = await db
        .update(contactInfo)
        .set({ ...info, updatedAt: new Date() })
        .where(eq(contactInfo.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(contactInfo).values(info).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
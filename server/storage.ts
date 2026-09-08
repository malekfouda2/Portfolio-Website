import {
  users,
  contacts,
  heroContent,
  aboutContent,
  projects,
  skills,
  partnerships,
  contactInfo,
  services,
  caseStudies,
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
  type Service,
  type InsertService,
  type CaseStudy,
  type InsertCaseStudy,
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
  getAllContacts(): Promise<Contact[]>;
  updateContactStatus(id: number, status: string): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
  
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

  // Services
  getServices(publishedOnly?: boolean): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string, publishedOnly?: boolean): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Case studies
  getCaseStudies(publishedOnly?: boolean): Promise<CaseStudy[]>;
  getCaseStudy(id: number): Promise<CaseStudy | undefined>;
  getCaseStudyBySlug(slug: string, publishedOnly?: boolean): Promise<CaseStudy | undefined>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: number, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: number): Promise<void>;
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

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async updateContactStatus(id: number, status: string): Promise<Contact> {
    const [contact] = await db
      .update(contacts)
      .set({ status, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return contact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
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

  // Services
  async getServices(publishedOnly = false): Promise<Service[]> {
    const query = db.select().from(services);
    const rows = publishedOnly
      ? await query.where(eq(services.isPublished, true)).orderBy(asc(services.sortOrder), asc(services.title))
      : await query.orderBy(asc(services.sortOrder), asc(services.title));
    return rows;
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string, publishedOnly = false): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return publishedOnly && !service?.isPublished ? undefined : service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Case studies
  async getCaseStudies(publishedOnly = false): Promise<CaseStudy[]> {
    const query = db.select().from(caseStudies);
    const rows = publishedOnly
      ? await query.where(eq(caseStudies.isPublished, true)).orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt))
      : await query.orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
    return rows;
  }

  async getCaseStudy(id: number): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
    return caseStudy;
  }

  async getCaseStudyBySlug(slug: string, publishedOnly = false): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug));
    return publishedOnly && !caseStudy?.isPublished ? undefined : caseStudy;
  }

  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const [created] = await db.insert(caseStudies).values(caseStudy).returning();
    return created;
  }

  async updateCaseStudy(id: number, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const [updated] = await db
      .update(caseStudies)
      .set({ ...caseStudy, updatedAt: new Date() })
      .where(eq(caseStudies.id, id))
      .returning();
    return updated;
  }

  async deleteCaseStudy(id: number): Promise<void> {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  }
}

export const storage = new DatabaseStorage();

import { storage } from "./storage";
import type { InsertPartnership } from "@shared/schema";
import { AIQDA_CASE_STUDY } from "./caseStudyContent";

export async function seedDatabase() {
  try {
    // Seed hero content
    if (!(await storage.getHeroContent())) {
      await storage.updateHeroContent({
      name: "Malek Fouda",
      title: "Full-Stack Developer for Business-Critical Systems",
      typingTexts: [
        "E-commerce systems that sell reliably",
        "Business software that replaces manual work",
        "Technical delivery agencies can depend on"
      ],
      description: "I build and fix revenue-critical websites and business software for growing companies across Egypt, the GCC, USA, and Europe.",
      yearsExperience: 3,
      projectsDelivered: 50,
      clientSatisfaction: 98
      });
    }

    // Seed about content
    if (!(await storage.getAboutContent())) {
      await storage.updateAboutContent({
      title: "About Me",
      description: "I'm a passionate full-stack developer with a love for creating elegant, efficient solutions to complex problems.",
      expertise: [
        "Full-Stack Development",
        "UI/UX Design",
        "Database Architecture",
        "Cloud Solutions",
        "API Development",
        "Performance Optimization"
      ],
      personalDescription: "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or mentoring fellow developers. I believe in writing clean, maintainable code that stands the test of time.",
      approach: "I approach every project with meticulous attention to detail, ensuring robust architecture, optimal performance, and exceptional user experience. My development philosophy centers on clean code, scalable solutions, and continuous learning."
      });
    }

    // Seed projects
    const projects = [
      {
        title: "Personal Portfolio Website",
        description: "A modern, responsive portfolio website with dynamic content management system, comprehensive SEO optimization, and professional design.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
        image: "https://placehold.co/600x400/1f2937/10b981/png?text=Portfolio+Website",
        type: "personal",
        url: null,
        screenshots: ["https://placehold.co/800x600/1f2937/10b981/png?text=Portfolio+Screenshot"],
        companyName: null,
        companyUrl: null,
        role: null,
        isVisible: true,
        sortOrder: 1
      },
      {
        title: "Trefle Fragrances E-commerce",
        description: "Premium fragrance e-commerce platform with advanced product filtering, secure payment integration, and responsive design optimized for mobile shopping experience.",
        technologies: ["Shopify", "Liquid", "JavaScript", "CSS", "HTML"],
        image: "https://placehold.co/600x400/1f2937/10b981/png?text=Trefle+Fragrances",
        type: "company",
        url: "https://treflefragrance.com",
        screenshots: ["https://placehold.co/800x600/1f2937/10b981/png?text=Trefle+Screenshot"],
        companyName: "Soliman's Enterprise",
        companyUrl: "http://solimansep.com",
        role: "Full-Stack Developer",
        isVisible: true,
        sortOrder: 2
      },
      {
        title: "Task Management App",
        description: "A collaborative project management tool with real-time updates, team collaboration features, and detailed reporting built for small teams.",
        technologies: ["React", "Express.js", "MongoDB", "Socket.io", "JWT"],
        image: "https://placehold.co/600x400/1f2937/10b981/png?text=Task+Management",
        type: "freelance",
        url: null,
        screenshots: ["https://placehold.co/800x600/1f2937/10b981/png?text=Task+Screenshot"],
        companyName: null,
        companyUrl: null,
        role: null,
        isVisible: true,
        sortOrder: 3
      }
    ];

    if ((await storage.getProjects()).length === 0) {
      for (const project of projects) {
        await storage.createProject(project);
      }
    }

    // Seed skills
    const skills = [
      // Frontend
      { category: "Frontend", name: "React", icon: "SiReact", color: "text-blue-500", sortOrder: 1, isVisible: true },
      { category: "Frontend", name: "TypeScript", icon: "SiTypescript", color: "text-blue-600", sortOrder: 2, isVisible: true },
      { category: "Frontend", name: "Next.js", icon: "SiNextdotjs", color: "text-gray-800", sortOrder: 3, isVisible: true },
      { category: "Frontend", name: "Tailwind CSS", icon: "SiTailwindcss", color: "text-cyan-500", sortOrder: 4, isVisible: true },
      
      // Backend
      { category: "Backend", name: "Node.js", icon: "SiNodedotjs", color: "text-green-500", sortOrder: 1, isVisible: true },
      { category: "Backend", name: "Express.js", icon: "SiExpress", color: "text-gray-600", sortOrder: 2, isVisible: true },
      { category: "Backend", name: "PHP", icon: "SiPhp", color: "text-purple-600", sortOrder: 3, isVisible: true },
      { category: "Backend", name: "Laravel", icon: "SiLaravel", color: "text-red-500", sortOrder: 4, isVisible: true },
      
      // Database
      { category: "Database", name: "PostgreSQL", icon: "SiPostgresql", color: "text-blue-700", sortOrder: 1, isVisible: true },
      { category: "Database", name: "MySQL", icon: "SiMysql", color: "text-orange-500", sortOrder: 2, isVisible: true },
      { category: "Database", name: "MongoDB", icon: "SiMongodb", color: "text-green-600", sortOrder: 3, isVisible: true },
      
      // Cloud & DevOps
      { category: "Cloud", name: "AWS", icon: "SiAmazonwebservices", color: "text-orange-400", sortOrder: 1, isVisible: true },
      { category: "Cloud", name: "Docker", icon: "SiDocker", color: "text-blue-500", sortOrder: 2, isVisible: true },
      { category: "Cloud", name: "Vercel", icon: "SiVercel", color: "text-gray-800", sortOrder: 3, isVisible: true },
      
      // Tools
      { category: "Tools", name: "Git", icon: "SiGit", color: "text-orange-600", sortOrder: 1, isVisible: true },
      { category: "Tools", name: "VS Code", icon: "SiVisualstudiocode", color: "text-blue-600", sortOrder: 2, isVisible: true },
      { category: "Tools", name: "Figma", icon: "SiFigma", color: "text-purple-500", sortOrder: 3, isVisible: true }
    ];

    if ((await storage.getSkills()).length === 0) {
      for (const skill of skills) {
        await storage.createSkill(skill);
      }
    }

    // Seed partnerships
    const partnerships: InsertPartnership[] = [
      {
        name: "Shopify",
        title: "Shopify Partner",
        description: "Certified Shopify partner specializing in custom theme development, app integrations, and e-commerce solutions.",
        logo: "/assets/shopify-logo.png",
        badgeText: "Certified Partner",
        badgeColor: "bg-green-500",
        stats: {
          "Stores Built": "25+",
          "Years Active": "2+",
          "Avg Revenue Increase": "40%"
        },
        specializations: [
          "Custom Theme Development",
          "App Integrations",
          "Performance Optimization",
          "Migration Services"
        ],
        isVisible: true,
        sortOrder: 1
      },
      {
        name: "WordPress",
        title: "WordPress Expert",
        description: "Experienced WordPress developer creating custom themes, plugins, and complete website solutions.",
        logo: "/assets/wordpress-logo.png",
        badgeText: "Expert Developer",
        badgeColor: "bg-blue-500",
        stats: {
          "Sites Developed": "100+",
          "Years Experience": "3+",
          "Client Satisfaction": "99%"
        },
        specializations: [
          "Custom Theme Development",
          "Plugin Development",
          "WooCommerce Solutions",
          "Performance Optimization"
        ],
        isVisible: true,
        sortOrder: 2
      }
    ];

    if ((await storage.getPartnerships()).length === 0) {
      for (const partnership of partnerships) {
        await storage.createPartnership(partnership);
      }
    }

    // Seed contact info
    if (!(await storage.getContactInfo())) {
      await storage.updateContactInfo({
      email: "malekfouda2000@gmail.com",
      location: "Cairo, Egypt · Working remotely worldwide",
      responseTime: "Within 24 hours",
      description: "Tell me what is not working, what you need to build, or where your team needs reliable development capacity.",
      socialLinks: {
        github: "https://github.com/malekfouda2",
        linkedin: "https://www.linkedin.com/in/malek-fouda-18a229244",
        calendly: "https://calendly.com/malekfouda2000/30min",
        whatsapp: "https://wa.me/201226076000"
      }
      });
    }

    if ((await storage.getServices()).length === 0) {
      const services = [
        {
          slug: "shopify-development",
          title: "Shopify Development & Rescue",
          eyebrow: "Shopify",
          shortDescription: "Build, improve, or recover a Shopify store that customers can use and your team can operate confidently.",
          description: "For growing stores that need dependable theme development, integrations, performance work, or urgent technical problem solving.",
          audience: "Shopify merchants and agencies supporting e-commerce brands.",
          problem: "Checkout friction, unreliable integrations, slow storefronts, theme limitations, or a backlog your current team cannot clear.",
          outcome: "A stable, maintainable storefront and purchasing flow aligned with how the business sells.",
          deliverables: ["Theme and storefront development", "Custom app and API integrations", "Checkout and conversion-path improvements", "Performance diagnosis and remediation", "Ongoing maintenance and technical support"],
          faqs: [
            { question: "Can you work with an existing Shopify store?", answer: "Yes. Engagements can begin with a focused audit, a defined repair scope, or an ongoing improvement backlog." },
            { question: "Do you support agency delivery?", answer: "Yes. Work can be delivered confidentially within an agency's tools, standards, and client workflow." },
          ],
          icon: "shopping-bag",
          isFeatured: true,
          isPublished: true,
          sortOrder: 1,
          seoTitle: "Shopify Developer for Store Builds, Fixes & Integrations | Malek Fouda",
          seoDescription: "Shopify development for growing brands: storefront builds, theme improvements, custom integrations, performance fixes, and ongoing technical support.",
        },
        {
          slug: "wordpress-woocommerce",
          title: "WordPress & WooCommerce Development",
          eyebrow: "WordPress + WooCommerce",
          shortDescription: "Reliable WordPress and WooCommerce delivery for sites and stores that need to perform, integrate, and remain maintainable.",
          description: "From custom functionality to checkout, payment, shipping, plugin, security, and performance work.",
          audience: "Businesses and agencies with a WordPress site or WooCommerce store that needs expert implementation.",
          problem: "Plugin conflicts, fragile customizations, slow pages, checkout failures, maintenance risk, or functionality that off-the-shelf tools cannot provide.",
          outcome: "A faster, safer, maintainable platform that supports purchasing and day-to-day operations.",
          deliverables: ["Custom themes and functionality", "WooCommerce checkout and catalog work", "Payment, shipping, and API integrations", "Performance and security recovery", "Maintenance and priority support"],
          faqs: [
            { question: "Can you repair work built by another developer?", answer: "Yes. I can first diagnose the current implementation, document the risks, and scope the safest path forward." },
            { question: "Do you build custom plugins?", answer: "Yes, when custom functionality is more reliable than forcing a generic plugin into the workflow." },
          ],
          icon: "panels-top-left",
          isFeatured: true,
          isPublished: true,
          sortOrder: 2,
          seoTitle: "WordPress & WooCommerce Developer | Malek Fouda",
          seoDescription: "WordPress and WooCommerce development covering custom functionality, checkout, payments, shipping, integrations, performance, security, and support.",
        },
        {
          slug: "custom-business-systems",
          title: "Custom Business Systems",
          eyebrow: "Portals, dashboards, and workflows",
          shortDescription: "Replace spreadsheets and disconnected tools with software designed around the way your business actually works.",
          description: "Plan and build secure dashboards, portals, operational tools, and integrations without the overhead of a full internal product team.",
          audience: "Founders and operations teams whose processes have outgrown spreadsheets or generic software.",
          problem: "Repeated manual entry, disconnected data, limited visibility, fragile handoffs, or customer workflows that cannot scale.",
          outcome: "One dependable system that reduces operational friction and gives the right people the right information.",
          deliverables: ["Discovery and workflow mapping", "Dashboards and authenticated portals", "Role-based access and operational tooling", "Payments, subscriptions, and API integrations", "Deployment, documentation, and support"],
          faqs: [
            { question: "Can you start from an early-stage idea?", answer: "Yes. Discovery turns the operational goal into a phased, testable scope before implementation begins." },
            { question: "Can you integrate existing systems?", answer: "Yes. Integrations are scoped around the available APIs, data quality, security requirements, and ownership boundaries." },
          ],
          icon: "workflow",
          isFeatured: true,
          isPublished: true,
          sortOrder: 3,
          seoTitle: "Custom Business Systems, Dashboards & Portals | Malek Fouda",
          seoDescription: "Custom dashboards, portals, workflow tools, subscriptions, payments, and API integrations for growing businesses and product teams.",
        },
        {
          slug: "white-label-development",
          title: "White-label Development Partner",
          eyebrow: "For agencies",
          shortDescription: "Dependable development capacity for agencies that need to deliver more without compromising their client relationship.",
          description: "Confidential implementation under your brand, inside your workflow, with clear communication and accountable delivery.",
          audience: "Design, branding, SEO, advertising, and digital agencies with overflow or specialist development needs.",
          problem: "A client deadline is approaching, internal capacity is limited, or a project needs deeper e-commerce, full-stack, or integration expertise.",
          outcome: "Flexible senior delivery capacity that helps your agency protect timelines, quality, and client trust.",
          deliverables: ["Confidential white-label delivery", "Overflow and specialist development", "Estimates and technical consultation", "Compatibility with your project workflow", "Maintenance and priority support retainers"],
          faqs: [
            { question: "Will you communicate directly with our client?", answer: "Only when agreed. Delivery can remain fully behind the scenes or include client calls under your preferred process." },
            { question: "Can we begin with one project?", answer: "Yes. A defined project is often the best way to establish delivery fit before discussing an ongoing retainer." },
          ],
          icon: "handshake",
          isFeatured: false,
          isPublished: true,
          sortOrder: 4,
          seoTitle: "White-label Development Partner for Agencies | Malek Fouda",
          seoDescription: "Confidential Shopify, WordPress, WooCommerce, custom application, and integration delivery for agencies that need dependable technical capacity.",
        },
        {
          slug: "maintenance-performance-security",
          title: "Technical Audits, Maintenance & Recovery",
          eyebrow: "Stability and support",
          shortDescription: "Find what should be fixed first, resolve critical risks, and keep important websites and systems dependable.",
          description: "A focused starting point for slow, compromised, unreliable, or difficult-to-maintain digital products.",
          audience: "Businesses with an existing website, store, or application that is underperforming or creating operational risk.",
          problem: "Unclear technical debt, slow performance, security concerns, recurring incidents, or no dependable owner for maintenance.",
          outcome: "A prioritized technical plan followed by scoped remediation or ongoing support.",
          deliverables: ["Performance and Core Web Vitals review", "Conversion-path and usability review", "Security and maintenance-risk review", "Prioritized findings and scoped recommendations", "Remediation and ongoing support when agreed"],
          faqs: [
            { question: "Do I have to commit to implementation after an audit?", answer: "No. The audit provides a prioritized decision document. Implementation can be scoped separately." },
            { question: "Can you handle urgent recovery work?", answer: "Availability depends on the incident, access, and current workload. Share the symptoms and impact so urgency can be assessed quickly." },
          ],
          icon: "shield-check",
          isFeatured: false,
          isPublished: true,
          sortOrder: 5,
          seoTitle: "Website Technical Audits, Performance & Security Recovery | Malek Fouda",
          seoDescription: "Technical audits, performance fixes, security recovery, maintenance planning, and ongoing support for important websites and business applications.",
        },
      ];
      for (const service of services) await storage.createService(service);
    }

    if ((await storage.getCaseStudies()).length === 0) {
      const drafts = [
        { slug: "ezhalha-logistics-platform", title: "Ezhalha Logistics Platform", clientName: "Ezhalha", projectId: null, sortOrder: 1 },
        { slug: "aiqda-learning-platform", title: "Aiqda Learning Platform", clientName: "Aiqda", projectId: null, sortOrder: 2 },
        { slug: "tabliya-shopify-middleware", title: "Tabliya Shopify Middleware", clientName: "Tabliya", projectId: null, sortOrder: 3 },
      ];
      for (const draft of drafts) {
        if (draft.slug === AIQDA_CASE_STUDY.slug) {
          await storage.createCaseStudy(AIQDA_CASE_STUDY);
          continue;
        }
        await storage.createCaseStudy({
          ...draft,
          industry: "",
          summary: "",
          context: "",
          problem: "",
          role: "",
          approach: "",
          solution: "",
          challenges: [],
          results: [],
          technologies: [],
          screenshots: [],
          serviceSlugs: [],
          image: null,
          liveUrl: null,
          isFeatured: true,
          isPublished: false,
          seoTitle: "",
          seoDescription: "",
        });
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

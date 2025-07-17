import { storage } from "./storage";

export async function seedDatabase() {
  try {
    // Seed hero content
    await storage.updateHeroContent({
      name: "Malek Fouda",
      title: "Full-Stack Developer",
      typingTexts: [
        "Building scalable web applications",
        "Creating elegant user interfaces",
        "Solving complex technical challenges",
        "Delivering exceptional user experiences"
      ],
      description: "Passionate full-stack developer with 3+ years of experience creating modern web applications. I specialize in React, Node.js, and cloud technologies, delivering scalable solutions that drive business growth.",
      yearsExperience: 3,
      projectsDelivered: 50,
      clientSatisfaction: 98
    });

    // Seed about content
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

    // Seed projects
    const projects = [
      {
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with real-time inventory management, secure payment processing, and advanced analytics.",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Docker"],
        image: "https://via.placeholder.com/600x400/1f2937/10b981?text=Project+Image",
        type: "live",
        url: "https://ecommerce-demo.example.com",
        screenshots: ["https://via.placeholder.com/800x600/1f2937/10b981?text=Screenshot", "https://via.placeholder.com/800x600/1f2937/10b981?text=Screenshot"],
        isVisible: true,
        sortOrder: 1
      },
      {
        title: "Task Management App",
        description: "A collaborative project management tool with real-time updates, team collaboration features, and detailed reporting.",
        technologies: ["React", "Express.js", "MongoDB", "Socket.io", "JWT"],
        image: "https://via.placeholder.com/600x400/1f2937/10b981?text=Project+Image",
        type: "live",
        url: "https://taskapp-demo.example.com",
        screenshots: ["https://via.placeholder.com/800x600/1f2937/10b981?text=Screenshot"],
        isVisible: true,
        sortOrder: 2
      },
      {
        title: "Portfolio Website",
        description: "A modern, responsive portfolio website with dynamic content management and SEO optimization.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Drizzle ORM"],
        image: "https://via.placeholder.com/600x400/1f2937/10b981?text=Project+Image",
        type: "portfolio",
        screenshots: ["https://via.placeholder.com/800x600/1f2937/10b981?text=Screenshot"],
        isVisible: true,
        sortOrder: 3
      }
    ];

    for (const project of projects) {
      await storage.createProject(project);
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

    for (const skill of skills) {
      await storage.createSkill(skill);
    }

    // Seed partnerships
    const partnerships = [
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

    for (const partnership of partnerships) {
      await storage.createPartnership(partnership);
    }

    // Seed contact info
    await storage.updateContactInfo({
      email: "malekfouda2000@gmail.com",
      location: "Available Worldwide",
      responseTime: "Within 24 hours",
      description: "Ready to discuss your next project? I'm always excited to work on challenging and innovative projects. Let's create something amazing together!",
      socialLinks: {
        github: "https://github.com/malekfouda",
        linkedin: "https://linkedin.com/in/malekfouda",
        twitter: "https://twitter.com/malekfouda",
        website: "https://malekfouda.dev"
      }
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
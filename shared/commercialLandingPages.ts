export type CommercialLandingPage = {
  slug: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  audience: string;
  painHeading: string;
  painPoints: string[];
  deliverables: string[];
  outcomes: string[];
  process: Array<{ title: string; description: string }>;
  proof: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedService: { slug: string; title: string };
  relatedCaseStudy?: { slug: string; title: string };
  keywords: string[];
};

export const commercialLandingPages: CommercialLandingPage[] = [
  {
    slug: "shopify-api-integration-developer",
    eyebrow: "Shopify integrations",
    title: "Shopify API integration development for systems that must stay in sync",
    seoTitle: "Shopify API Integration Developer | Malek Fouda",
    seoDescription: "Custom Shopify API integrations for ERP, inventory, shipping, payments, fulfillment, marketplaces, and operational middleware.",
    intro: "Connect Shopify to the systems your team already relies on without creating another fragile manual process. I design and build integration layers around real order, inventory, customer, fulfillment, and reporting workflows.",
    audience: "For established Shopify merchants, operators, and agencies that need reliable data movement between Shopify and another business-critical platform.",
    painHeading: "When an off-the-shelf connector is no longer enough",
    painPoints: [
      "Orders, inventory, or fulfillment updates are copied between systems by hand.",
      "A connector loses data, duplicates records, or provides too little visibility when it fails.",
      "Your ERP, shipping provider, payment service, or internal platform has rules that generic apps cannot model.",
      "The business needs a controlled migration away from a legacy integration without interrupting live sales.",
    ],
    deliverables: [
      "Workflow and API capability mapping before implementation",
      "Shopify Admin API, Storefront API, webhook, and app integration work",
      "Field mapping, validation, idempotency, retries, and failure handling",
      "Operational logging and practical recovery paths for the team",
      "Staged rollout, testing, documentation, and post-launch support",
    ],
    outcomes: [
      "Less repeated data entry and fewer avoidable handoff errors",
      "A traceable flow between Shopify and operational systems",
      "Integration behavior aligned with the business rather than a plugin’s assumptions",
    ],
    process: [
      { title: "Map the flow", description: "Identify systems, owners, data fields, triggers, exceptions, and the source of truth." },
      { title: "Design failure-safe behavior", description: "Define validation, retries, logging, reconciliation, and what happens when an external service is unavailable." },
      { title: "Build and verify", description: "Implement against test data, exercise edge cases, and validate the complete operational path." },
      { title: "Release in stages", description: "Deploy with monitoring and a controlled handover instead of switching a critical flow blindly." },
    ],
    proof: "My work covers Shopify storefronts, custom middleware, payments, shipping, dashboards, and API-driven business systems. Relevant implementation examples can be discussed privately when client confidentiality prevents a public case study.",
    faqs: [
      { question: "Can you replace an unreliable Shopify connector?", answer: "Yes. I first document the current data flow and failure modes, then plan a staged replacement that protects live orders and operational continuity." },
      { question: "Can you integrate a private or poorly documented API?", answer: "Often, provided the system exposes a usable interface and test access. Discovery confirms authentication, limits, data quality, and support constraints before a build is committed." },
      { question: "Do you build Shopify middleware as well as apps?", answer: "Yes. The right architecture may be a Shopify app, a standalone middleware service, serverless functions, or a combination, depending on ownership and workflow requirements." },
    ],
    relatedService: { slug: "shopify-development", title: "Shopify Development & Rescue" },
    keywords: ["Shopify API integration developer", "Shopify middleware developer", "custom Shopify integration", "Shopify ERP integration"],
  },
  {
    slug: "shopify-maintenance-support",
    eyebrow: "Shopify support",
    title: "Shopify maintenance and development support without the technical backlog",
    seoTitle: "Shopify Maintenance & Support Developer | Malek Fouda",
    seoDescription: "Ongoing Shopify maintenance, theme improvements, bug fixes, app troubleshooting, performance work, and priority development support.",
    intro: "Keep a revenue-critical Shopify store dependable while still moving improvements forward. Support can cover a defined repair, a prioritized backlog, or ongoing technical ownership around releases and trading periods.",
    audience: "For Shopify brands and agencies that have an active store but lack dependable development capacity for fixes, improvements, and technical decisions.",
    painHeading: "Support for stores where small issues keep becoming expensive",
    painPoints: [
      "Theme changes accumulate without review and make each new release riskier.",
      "Apps conflict, storefront behavior changes unexpectedly, or an issue reaches customers before the team sees it.",
      "Performance and conversion-path problems sit in a backlog because nobody owns them end to end.",
      "An agency needs discreet Shopify capacity for client maintenance or a deadline-sensitive release.",
    ],
    deliverables: [
      "Theme fixes, sections, templates, and storefront improvements",
      "App conflict diagnosis and third-party integration troubleshooting",
      "Performance investigation and Core Web Vitals remediation",
      "Release testing across important devices and purchasing paths",
      "Prioritized maintenance planning and clearly documented changes",
    ],
    outcomes: [
      "A clearer and safer improvement backlog",
      "Faster resolution when storefront or integration issues appear",
      "Less risk around campaigns, theme releases, and app changes",
    ],
    process: [
      { title: "Establish the baseline", description: "Review the theme, app surface, analytics signals, current incidents, and upcoming commercial priorities." },
      { title: "Prioritize by impact", description: "Separate customer-facing and revenue risks from routine improvements and cosmetic requests." },
      { title: "Deliver in controlled releases", description: "Work through reviewed changes with testing, rollback awareness, and plain-language updates." },
      { title: "Maintain context", description: "Keep decisions and recurring risks documented so support becomes faster over time." },
    ],
    proof: "Support is delivered by a full-stack developer familiar with Shopify themes, applications, integrations, payment and shipping flows, and the operational systems connected to a store.",
    faqs: [
      { question: "Do you offer one-off Shopify fixes?", answer: "Yes. A focused issue can be scoped independently. If the store has several connected problems, I may recommend a short audit before changing production code." },
      { question: "Can you work with our existing theme and apps?", answer: "Yes. Most support starts with an existing implementation. I review how it is assembled before deciding whether to repair, refactor, replace, or leave a component alone." },
      { question: "Is emergency support guaranteed?", answer: "No. Urgent availability depends on current commitments, access, and the nature of the incident. Share the symptoms and business impact so I can assess it quickly." },
    ],
    relatedService: { slug: "shopify-development", title: "Shopify Development & Rescue" },
    keywords: ["Shopify maintenance developer", "Shopify support developer", "Shopify bug fixes", "Shopify theme maintenance"],
  },
  {
    slug: "woocommerce-checkout-payment-shipping",
    eyebrow: "WooCommerce rescue",
    title: "WooCommerce checkout, payment, and shipping fixes for stores losing orders",
    seoTitle: "WooCommerce Checkout & Payment Fixes | Malek Fouda",
    seoDescription: "Diagnose and repair WooCommerce checkout, payment gateway, shipping, plugin conflict, order, and mobile purchasing issues.",
    intro: "When customers cannot complete an order, the priority is a controlled diagnosis—not another plugin installed on top of the problem. I trace the purchasing flow, isolate the failure, and repair the agreed cause with testing around the cases that matter.",
    audience: "For WooCommerce store owners and agencies dealing with broken checkouts, inconsistent rates, gateway failures, plugin conflicts, or unreliable order behavior.",
    painHeading: "Common symptoms that need more than a settings change",
    painPoints: [
      "Payments fail or remain pending even though the customer completed the gateway flow.",
      "Shipping options disappear, calculate incorrectly, or conflict with location and cart rules.",
      "Checkout works on one device or customer type but fails for another.",
      "Plugin, theme, or custom-code changes create intermittent errors that are difficult to reproduce.",
    ],
    deliverables: [
      "Checkout and order-lifecycle diagnosis",
      "Payment gateway callback, webhook, and status troubleshooting",
      "Shipping-zone, rate, conditional logic, and provider integration work",
      "Plugin and theme conflict isolation",
      "Staging validation, purchasing-path regression tests, and launch support",
    ],
    outcomes: [
      "A purchasing flow the business can test and understand",
      "Resolved failures without unnecessary platform-wide changes",
      "Clear documentation of the cause, fix, and remaining risks",
    ],
    process: [
      { title: "Reproduce the failure", description: "Collect affected order details, environments, customer conditions, and recent changes." },
      { title: "Trace the transaction", description: "Follow browser, WooCommerce, gateway, webhook, shipping, and server behavior to identify the break." },
      { title: "Repair the smallest responsible layer", description: "Fix the cause without destabilizing unrelated store functionality." },
      { title: "Test purchasing scenarios", description: "Verify relevant devices, payment outcomes, shipping rules, emails, and order states before release." },
    ],
    proof: "My WordPress and WooCommerce work includes custom functionality, purchasing flows, payment and shipping integrations, performance recovery, and maintaining systems built by other developers.",
    faqs: [
      { question: "Can you fix a store built by another developer?", answer: "Yes. Existing code ownership is not a problem, but I need appropriate access and enough evidence to reproduce the issue safely." },
      { question: "Will you test directly on the live store?", answer: "Only when a production-only condition makes that unavoidable and we agree on safeguards. Normal repair work should be diagnosed and verified in a controlled environment first." },
      { question: "Can you work with local or regional payment providers?", answer: "Potentially. Feasibility depends on the provider’s WooCommerce support, API documentation, test environment, and access to technical assistance." },
    ],
    relatedService: { slug: "wordpress-woocommerce", title: "WordPress & WooCommerce Development" },
    keywords: ["WooCommerce checkout fix", "WooCommerce payment gateway developer", "WooCommerce shipping developer", "WooCommerce rescue"],
  },
  {
    slug: "custom-dashboard-development",
    eyebrow: "Operational software",
    title: "Custom dashboard development for teams that need one reliable operational view",
    seoTitle: "Custom Dashboard Development | Malek Fouda",
    seoDescription: "Design and development of secure business dashboards, admin panels, reporting tools, portals, workflows, and API integrations.",
    intro: "Turn scattered operational data and repeated manual reporting into a dashboard designed around real decisions. I build secure internal tools, administrative interfaces, and customer portals without forcing your workflow into generic software.",
    audience: "For founders and operations teams that have outgrown spreadsheets, disconnected SaaS tools, or admin processes spread across too many systems.",
    painHeading: "A dashboard should reduce work, not create another place to update",
    painPoints: [
      "People assemble the same report manually from several systems every week.",
      "Teams cannot see ownership, status, exceptions, or financial context in one place.",
      "A generic tool exposes too much, too little, or the wrong workflow for each role.",
      "Customers or partners need a secure self-service view instead of email-based updates.",
    ],
    deliverables: [
      "Workflow discovery and information architecture",
      "Role-based dashboards, admin panels, and customer portals",
      "Reporting, filters, exports, review queues, and operational actions",
      "API integrations, scheduled synchronization, and data validation",
      "Authentication, permissions, deployment, documentation, and support",
    ],
    outcomes: [
      "Less time spent assembling routine operational information",
      "Clearer ownership and visibility across roles",
      "A system that can evolve with the workflow instead of blocking it",
    ],
    process: [
      { title: "Observe the decisions", description: "Map who needs information, what action follows it, and where the current data originates." },
      { title: "Define the smallest useful release", description: "Prioritize the roles, views, integrations, and actions needed to replace the most painful workflow first." },
      { title: "Build around permissions", description: "Implement the data model, access boundaries, interfaces, and integration behavior together." },
      { title: "Validate with real workflows", description: "Test realistic records and edge cases with the people who will operate the system." },
    ],
    proof: "The Aiqda learning platform demonstrates role-based dashboards, reporting, subscription visibility, content progress, operational review queues, and financial administration in a working product.",
    faqs: [
      { question: "Can you integrate a dashboard with our existing tools?", answer: "Yes, when those systems expose suitable APIs or controlled data access. Discovery establishes ownership, data quality, limits, and synchronization requirements." },
      { question: "Do you build customer portals as well as internal dashboards?", answer: "Yes. A project can include internal operations, customer or partner self-service, or both, with permissions designed for each audience." },
      { question: "Can we start with one workflow?", answer: "Yes. A focused first release is usually safer than recreating every spreadsheet and edge case at once." },
    ],
    relatedService: { slug: "custom-business-systems", title: "Custom Business Systems" },
    relatedCaseStudy: { slug: "aiqda-learning-platform", title: "Aiqda Learning Platform case study" },
    keywords: ["custom dashboard development", "business dashboard developer", "admin panel development", "customer portal developer"],
  },
  {
    slug: "white-label-ecommerce-development",
    eyebrow: "Agency delivery",
    title: "White-label Shopify and WooCommerce development for agencies",
    seoTitle: "White-label E-commerce Developer for Agencies | Malek Fouda",
    seoDescription: "Confidential white-label Shopify, WordPress, WooCommerce, integration, maintenance, and technical delivery for digital agencies.",
    intro: "Add dependable e-commerce delivery capacity without changing the relationship you have built with your client. I work inside the agreed agency process, keep communication direct, and remain invisible or client-facing only where you choose.",
    audience: "For design, branding, SEO, advertising, and digital agencies that need overflow capacity or deeper Shopify, WooCommerce, full-stack, and integration expertise.",
    painHeading: "Flexible technical capacity when the client deadline cannot move",
    painPoints: [
      "A signed client scope needs implementation capacity the internal team does not currently have.",
      "A storefront or integration requires deeper technical ownership than the original project expected.",
      "The agency needs a developer who can estimate clearly and work within its project-management process.",
      "Maintenance requests are interrupting the team responsible for new client delivery.",
    ],
    deliverables: [
      "Confidential Shopify, WordPress, and WooCommerce implementation",
      "Technical scoping, estimates, and feasibility input",
      "Custom themes, functionality, applications, and integrations",
      "Quality assurance, handover notes, and maintenance support",
      "Direct client participation only when explicitly agreed",
    ],
    outcomes: [
      "More delivery capacity without presenting another agency to the client",
      "Clearer technical ownership and fewer last-minute implementation surprises",
      "A repeatable partnership that can begin with one defined project",
    ],
    process: [
      { title: "Agree the working boundary", description: "Confirm confidentiality, communication, client visibility, tools, review stages, and decision owners." },
      { title: "Validate the scope", description: "Review designs, requirements, dependencies, risks, and acceptance criteria before delivery starts." },
      { title: "Work inside your process", description: "Use the agency’s preferred workflow and provide concise progress and risk updates." },
      { title: "Protect the handover", description: "Document the delivered work and support the agency through review, launch, and agreed maintenance." },
    ],
    proof: "My portfolio includes commercial delivery completed in company, freelance, and agency contexts. Confidential work can be discussed at the level permitted by the original engagement.",
    faqs: [
      { question: "Will you contact our client directly?", answer: "Only when you explicitly request it. I can remain entirely behind the scenes or join selected calls under your preferred role." },
      { question: "Can we hire you for one project before discussing a retainer?", answer: "Yes. A defined project is the best way to establish communication, delivery quality, and fit before considering ongoing capacity." },
      { question: "Can you use our project-management and communication tools?", answer: "Yes. I can work within the agreed tools and reporting rhythm as long as access, responsibilities, and response expectations are clear." },
    ],
    relatedService: { slug: "white-label-development", title: "White-label Development Partner" },
    keywords: ["white-label Shopify developer", "white-label WooCommerce developer", "agency development partner", "outsourced ecommerce developer"],
  },
  {
    slug: "website-technical-audit",
    eyebrow: "Technical clarity",
    title: "Website technical audits that turn unclear problems into a prioritized plan",
    seoTitle: "Website Technical Audit Service | Malek Fouda",
    seoDescription: "A practical website technical audit covering performance, Core Web Vitals, usability, conversion paths, security, and maintenance risk.",
    intro: "Find out what should be fixed first before committing budget to another rebuild, plugin, or redesign. The audit connects technical findings to user impact, operational risk, and a realistic order of work.",
    audience: "For businesses and agencies responsible for a slow, unreliable, difficult-to-maintain, or commercially underperforming website or store.",
    painHeading: "Useful when the symptoms are visible but the cause is not",
    painPoints: [
      "Several people have suggested different fixes and there is no trusted priority order.",
      "Performance scores fluctuate, but nobody has connected them to templates, assets, third parties, and real user paths.",
      "The site contains old plugins, custom code, or infrastructure decisions that make every change risky.",
      "A rebuild is being proposed before the current platform and business requirements are properly understood.",
    ],
    deliverables: [
      "Technical architecture and maintainability review",
      "Performance and Core Web Vitals investigation",
      "Mobile usability and conversion-path review",
      "WordPress, WooCommerce, Shopify, integration, and security-risk review as applicable",
      "Prioritized findings with recommended next actions and scoped remediation options",
    ],
    outcomes: [
      "A decision document ordered by business impact and technical risk",
      "Clarity on what to repair, replace, monitor, or leave alone",
      "A stronger basis for estimates, internal planning, or a future implementation scope",
    ],
    process: [
      { title: "Define the question", description: "Agree the affected pages, systems, user paths, known incidents, and decisions the audit must support." },
      { title: "Collect evidence", description: "Review the implementation, configuration, observable performance, integrations, and available analytics or error context." },
      { title: "Prioritize findings", description: "Separate critical risk, commercial friction, maintainability debt, and lower-value polish." },
      { title: "Review the plan", description: "Walk through the findings, dependencies, and practical next steps in plain language." },
    ],
    proof: "This portfolio’s own technical SEO and performance work includes crawler-visible rendering, structured data, correct status handling, asset optimization, caching, compression, accessibility, and Core Web Vitals improvements.",
    faqs: [
      { question: "Does an audit require me to hire you for implementation?", answer: "No. The audit is a standalone decision document. Remediation can be handled by your team, another provider, or scoped with me separately." },
      { question: "Is this only an automated Lighthouse report?", answer: "No. Automated tools provide evidence, but the useful output is the interpretation: what caused the issue, why it matters, what depends on it, and what should happen first." },
      { question: "Can you audit a site before a redesign?", answer: "Yes. That can help preserve working functionality, identify migration risk, and prevent a redesign from repeating existing technical problems." },
    ],
    relatedService: { slug: "maintenance-performance-security", title: "Technical Audits, Maintenance & Recovery" },
    keywords: ["website technical audit", "Core Web Vitals audit", "website performance audit", "WordPress technical audit"],
  },
];

export const commercialLandingPageBySlug = new Map(
  commercialLandingPages.map((page) => [page.slug, page]),
);

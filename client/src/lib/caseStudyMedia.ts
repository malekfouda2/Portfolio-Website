export type CaseStudyMediaGroup = {
  title: string;
  description: string;
  items: Array<{ src: string; alt: string; caption: string }>;
};

const LOGISTICS = "/uploads/logistics-platform-case-study";

export const caseStudyMedia: Record<string, CaseStudyMediaGroup[]> = {
  "white-label-logistics-platform": [
    {
      title: "White-label identity and admin overview",
      description: "The product ships unbranded. Operators set their name, logo, and colour from the admin, and the whole interface follows at runtime.",
      items: [
        { src: `${LOGISTICS}/14-login.webp`, alt: "Branded logistics platform sign-in screen", caption: "Sign-in with email code, password, account application, and guest pricing" },
        { src: `${LOGISTICS}/08-admin-branding.webp`, alt: "Admin branding settings", caption: "Name, logo, favicon, primary colour, and support details set without code changes" },
        { src: `${LOGISTICS}/01-admin-dashboard.webp`, alt: "Logistics admin dashboard", caption: "Live counts for clients, shipments, applications, revenue, and refunds with six-month trends" },
      ],
    },
    {
      title: "Access control and onboarding",
      description: "Three independent permission models keep admin staff, client teams, and operations users scoped correctly, and new clients enter through a reviewed application pipeline.",
      items: [
        { src: `${LOGISTICS}/16-admin-roles.webp`, alt: "Admin roles and permissions", caption: "Granular admin RBAC with permissions grouped into custom roles" },
        { src: `${LOGISTICS}/13-client-users.webp`, alt: "Client team members and permissions", caption: "Per-company client users with a primary contact and scoped permissions" },
        { src: `${LOGISTICS}/19-admin-applications.webp`, alt: "Client account applications", caption: "Admin review and approval before a client account is activated" },
      ],
    },
    {
      title: "Client booking flow",
      description: "Clients quote, book, and track shipments themselves, with carrier accept-criteria validated before anything is charged.",
      items: [
        { src: `${LOGISTICS}/10-client-dashboard.webp`, alt: "Client portal dashboard", caption: "Client home with shipments, spend, and quick actions" },
        { src: `${LOGISTICS}/20-client-quote.webp`, alt: "Client instant quote", caption: "Instant marked-up rates across available carriers" },
        { src: `${LOGISTICS}/21-client-create-shipment.webp`, alt: "Client create shipment form", caption: "Origin, destination, package details, and service before checkout" },
        { src: `${LOGISTICS}/11-client-shipments.webp`, alt: "Client shipment tracking list", caption: "Live shipment status across carriers" },
        { src: `${LOGISTICS}/22-client-sales-channels.webp`, alt: "Client sales channel connections", caption: "E-commerce store connections that import orders as shipments" },
      ],
    },
    {
      title: "Operations and shipment management",
      description: "Admins manage every client and shipment, while the operations team works from a queue organized by lane and stage.",
      items: [
        { src: `${LOGISTICS}/15-admin-operations.webp`, alt: "Operations console queues", caption: "Queues for door-to-door, express, local, special handling, dangerous goods, and returns" },
        { src: `${LOGISTICS}/02-admin-shipments.webp`, alt: "Admin shipments list", caption: "All shipments across clients with filtering, search, and detail" },
        { src: `${LOGISTICS}/03-admin-clients.webp`, alt: "Admin clients list", caption: "Client accounts, contacts, credit standing, and activity" },
      ],
    },
    {
      title: "Integrations and pricing",
      description: "Carriers, payments, accounting, and AI connect through one control center with encrypted credentials, health monitoring, and configurable markups.",
      items: [
        { src: `${LOGISTICS}/06-admin-apps.webp`, alt: "Integration control center", caption: "Apps tab for runtime carrier, payment, accounting, and AI configuration" },
        { src: `${LOGISTICS}/18-admin-integration-health.webp`, alt: "Integration health monitoring", caption: "Connection health at a glance with failure alerts" },
        { src: `${LOGISTICS}/05-admin-pricing.webp`, alt: "Pricing rules", caption: "Markups per client profile, account type, and freight type" },
      ],
    },
    {
      title: "Finance, tax, and notifications",
      description: "Invoicing, payments, client billing, VAT, and email delivery are all managed as configurable data rather than hard-coded behavior.",
      items: [
        { src: `${LOGISTICS}/07-admin-invoices.webp`, alt: "Admin invoices", caption: "Automatic per-shipment commercial invoices plus custom and extra-charge invoices" },
        { src: `${LOGISTICS}/04-admin-payments.webp`, alt: "Admin payments", caption: "Idempotent card payments, refunds, and webhook reconciliation" },
        { src: `${LOGISTICS}/12-client-billing.webp`, alt: "Client billing", caption: "Client invoices, payments, statements, and credit standing" },
        { src: `${LOGISTICS}/09-admin-tax.webp`, alt: "Configurable VAT settings", caption: "VAT set from the admin and applied to new quotes, shipments, and invoices" },
        { src: `${LOGISTICS}/17-admin-email-settings.webp`, alt: "Email templates and settings", caption: "Editable templates with retry, backoff, and per-attempt delivery records" },
      ],
    },
  ],
  "woocommerce-gifting-system": [
    {
      title: "Customer gift details",
      description: "The optional gift path expands inside classic WooCommerce checkout and captures the recipient information needed by the store team.",
      items: [
        { src: "/uploads/gifting-system/01-gift-checkout.webp", alt: "WooCommerce checkout with expanded gift recipient fields", caption: "Conditional recipient name, phone, and message fields using neutral test data" },
      ],
    },
    {
      title: "Traceable fulfillment workflow",
      description: "The source order keeps the generated claim code, while the later order presents an explicit alert that links staff back to the original gift purchase.",
      items: [
        { src: "/uploads/gifting-system/02-gift-order-admin.webp", alt: "WooCommerce admin gift order details and generated claim code", caption: "Recipient details, gift message, and generated single-use code on the source order" },
        { src: "/uploads/gifting-system/03-gift-claim-admin.webp", alt: "WooCommerce admin alert for a redeemed gift claim code", caption: "Fulfillment alert on the later order with the redeemed code and source-order link" },
      ],
    },
  ],
  "woocommerce-delivery-dates-manager": [
    {
      title: "Delivery and pickup at checkout",
      description: "The customer-facing workflow makes the fulfillment choice explicit, then reveals only the zone and date controls required for that path.",
      items: [
        { src: "/uploads/delivery-dates-manager/01-zone-delivery-checkout.webp", alt: "WooCommerce checkout with zone-based scheduled delivery", caption: "Zone selection, delivery pricing, and an eligible delivery date in one checkout path" },
        { src: "/uploads/delivery-dates-manager/02-pickup-checkout.webp", alt: "WooCommerce checkout with Heliopolis pickup scheduling", caption: "Heliopolis pickup with a separate date selector and no delivery fee" },
      ],
    },
  ],
  "tabliya-shopify-middleware": [
    {
      title: "Operations and recovery controls",
      description: "The admin console keeps synchronization behavior visible and gives operators controlled tools for mappings, configuration, replay, and reconciliation.",
      items: [
        { src: "/uploads/tabliya-case-study/01-integration-settings.png", alt: "Tabliya Shopify middleware integration settings", caption: "Destination status configuration, invoice controls, product imports, payment-method imports, and reconciliation" },
        { src: "/uploads/tabliya-case-study/02-webhook-events.png", alt: "Tabliya Shopify middleware webhook event log", caption: "Signed Shopify events with processing state, failure reasons, inspection, and replay controls" },
      ],
    },
  ],
  "aiqda-learning-platform": [
    {
      title: "Public discovery",
      description: "The public experience introduces the offer before requiring an account, then guides visitors toward chapters, packages, consultations, and applications.",
      items: [
        { src: "/uploads/aiqda-case-study/01-home.webp", alt: "Aiqda public homepage", caption: "Public homepage and primary acquisition routes" },
        { src: "/uploads/aiqda-case-study/01b-home-packages.webp", alt: "Aiqda subscription packages", caption: "Subscription packages, billing terms, and pricing hierarchy" },
        { src: "/uploads/aiqda-case-study/02-chapters.webp", alt: "Aiqda chapters listing", caption: "Public chapter discovery and package filtering" },
        { src: "/uploads/aiqda-case-study/03-consultations.webp", alt: "Aiqda consultation catalogue", caption: "Structured consultation offerings and booking entry points" },
      ],
    },
    {
      title: "Member learning and subscriptions",
      description: "Members move from paid access into video learning, qualification, progress tracking, billing controls, and transparent payment history.",
      items: [
        { src: "/uploads/aiqda-case-study/09-member-dashboard.webp", alt: "Aiqda member dashboard", caption: "Member journey, progress signals, rewards, and recommended content" },
        { src: "/uploads/aiqda-case-study/10-member-progress.webp", alt: "Aiqda member progress view", caption: "Chapter completion and recent learning activity" },
        { src: "/uploads/aiqda-case-study/11-member-subscription.webp", alt: "Aiqda subscription status", caption: "Active package, renewal controls, and saved payment status" },
        { src: "/uploads/aiqda-case-study/12-member-payments.webp", alt: "Aiqda payment history", caption: "Payment, refund, method, and package records" },
        { src: "/uploads/aiqda-case-study/13-member-chapter-detail.webp", alt: "Aiqda chapter progress detail", caption: "Chapter progress calculated from completed content" },
        { src: "/uploads/aiqda-case-study/14-member-content-progress.webp", alt: "Aiqda video content progress", caption: "Watch threshold, qualification, and next-content guidance" },
      ],
    },
    {
      title: "Applications and administration",
      description: "Structured intake flows feed a centralized operating layer for review queues, commercial reporting, finance, and platform control.",
      items: [
        { src: "/uploads/aiqda-case-study/04-creator-application.webp", alt: "Aiqda creator application", caption: "Multi-step creator application and qualification flow" },
        { src: "/uploads/aiqda-case-study/05-studio-application.webp", alt: "Aiqda studio application", caption: "Studio intake and meeting-based approval workflow" },
        { src: "/uploads/aiqda-case-study/06-admin-dashboard.webp", alt: "Aiqda admin dashboard", caption: "Operational KPIs, finance snapshot, and review queues" },
        { src: "/uploads/aiqda-case-study/07-admin-analytics.webp", alt: "Aiqda analytics dashboard", caption: "Acquisition, engagement, commerce, and retention reporting" },
        { src: "/uploads/aiqda-case-study/08-admin-finance.webp", alt: "Aiqda finance dashboard", caption: "Payments, fees, allocation, liabilities, and payout visibility" },
      ],
    },
  ],
};

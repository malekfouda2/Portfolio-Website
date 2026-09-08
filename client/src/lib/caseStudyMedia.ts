export type CaseStudyMediaGroup = {
  title: string;
  description: string;
  items: Array<{ src: string; alt: string; caption: string }>;
};

export const caseStudyMedia: Record<string, CaseStudyMediaGroup[]> = {
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

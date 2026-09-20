export const SITE_IDENTITY = {
  name: "Malek Fouda",
  siteUrl: "https://malekfouda.com",
  email: "malekfouda2000@gmail.com",
  github: "https://github.com/malekfouda2",
  linkedin: "https://www.linkedin.com/in/malek-fouda-18a229244",
  calendly: "https://calendly.com/malekfouda2000/30min",
  whatsapp: "https://wa.me/201226076000",
} as const;

export const SITE_PROFILE_URLS = [
  SITE_IDENTITY.github,
  SITE_IDENTITY.linkedin,
] as const;

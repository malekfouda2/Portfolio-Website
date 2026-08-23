import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";

const SITE_URL = "https://malekfouda.com";
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  canonicalPath?: string;
}

export default function SEO({ 
  title,
  description,
  keywords = [],
  image,
  type = "website",
  canonicalPath
}: SEOProps) {
  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ["/api/hero"],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const finalTitle = title || `${heroContent?.name || "Malek Fouda"} | WooCommerce, WordPress & Custom Web Development`;
    document.title = finalTitle;

    const finalDescription = description || "Reliable WooCommerce, WordPress, and custom web development for businesses and agencies.";
    updateMetaTag("description", finalDescription);

    const finalKeywords = keywords.length > 0 ? keywords.join(", ") : "Malek Fouda, WooCommerce developer, WordPress developer, custom web applications, business dashboards, web development support";
    updateMetaTag("keywords", finalKeywords);

    // Derive a clean canonical — strip query params and fragments
    const cleanPath = canonicalPath ?? (window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, ""));
    const canonicalUrl = `${SITE_URL}${cleanPath}`;
    const socialImage = image || DEFAULT_SOCIAL_IMAGE;

    updateMetaTag("og:title", finalTitle, "property");
    updateMetaTag("og:description", finalDescription, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:image", socialImage, "property");
    updateMetaTag("og:image:type", "image/png", "property");
    updateMetaTag("og:image:width", "1200", "property");
    updateMetaTag("og:image:height", "630", "property");
    updateMetaTag("og:site_name", "Malek Fouda", "property");

    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", finalTitle, "name");
    updateMetaTag("twitter:description", finalDescription, "name");
    updateMetaTag("twitter:image", socialImage, "name");
    updateMetaTag("twitter:image:alt", "Malek Fouda - Web Development Services", "name");

    updateLinkTag("canonical", canonicalUrl);

    updateMetaTag("robots", "index, follow");
    updateMetaTag("theme-color", "#10b981");
    updateMetaTag("google-site-verification", "nQ_IA49yXG9t7cQghRngRA2KGhzmq5aHN46JVwgsU_Y");

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": heroContent?.name || "Malek Fouda",
        "jobTitle": "Full-Stack Developer",
      "description": finalDescription,
      "url": canonicalUrl,
      "sameAs": [
        "https://github.com/malekfouda",
        "https://linkedin.com/in/malekfouda",
      ],
      "worksFor": {
        "@type": "Organization",
          "name": "Independent Web Development"
      },
      "knowsAbout": [
          "WooCommerce Development",
          "WordPress Development",
          "Custom Web Applications",
          "Business Dashboards",
          "Web Development Support",
          "React",
          "Node.js",
          "TypeScript"
      ],
      "hasOccupation": {
        "@type": "Occupation",
           "name": "Full-Stack Developer",
        "occupationLocation": {
          "@type": "Place",
           "name": "Cairo, Egypt"
        }
      }
    };

    // Update only the person schema. Route-specific JSON-LD (such as the
    // portfolio CollectionPage) is server-rendered separately and must remain intact.
    let ldScript = document.querySelector<HTMLScriptElement>('#person-structured-data');
    if (ldScript) {
      ldScript.textContent = JSON.stringify(structuredData);
    } else {
      const script = document.createElement('script');
      script.id = 'person-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, image, type, canonicalPath, heroContent]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: string = "name") {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute("href", href);
}

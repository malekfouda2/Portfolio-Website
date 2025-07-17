import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  url?: string;
}

export default function SEO({ 
  title,
  description,
  keywords = [],
  image,
  type = "website",
  url
}: SEOProps) {
  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ["/api/hero"],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    // Set document title
    const finalTitle = title || `${heroContent?.name || "Malek Fouda"} - ${heroContent?.title || "Full Stack Developer"}`;
    document.title = finalTitle;

    // Set meta description
    const finalDescription = description || "Transforming ideas into digital reality through expert development and creative solutions";
    updateMetaTag("description", finalDescription);

    // Set keywords
    const finalKeywords = keywords.length > 0 ? keywords.join(", ") : "full stack developer, react developer, node.js, web development, javascript, typescript, freelance developer";
    updateMetaTag("keywords", finalKeywords);

    // Set Open Graph tags
    updateMetaTag("og:title", finalTitle, "property");
    updateMetaTag("og:description", finalDescription, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:url", url || window.location.href, "property");
    updateMetaTag("og:image", image || `${window.location.origin}/favicon.svg`, "property");
    updateMetaTag("og:image:width", "512", "property");
    updateMetaTag("og:image:height", "512", "property");
    updateMetaTag("og:site_name", "Malek Fouda Portfolio", "property");

    // Set Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", finalTitle, "name");
    updateMetaTag("twitter:description", finalDescription, "name");
    updateMetaTag("twitter:image", image || `${window.location.origin}/favicon.svg`, "name");
    updateMetaTag("twitter:image:alt", "Malek Fouda - Full Stack Developer", "name");

    // Set canonical URL
    updateLinkTag("canonical", url || window.location.href);

    // Set robots
    updateMetaTag("robots", "index, follow");

    // Set viewport
    updateMetaTag("viewport", "width=device-width, initial-scale=1");

    // Set theme color
    updateMetaTag("theme-color", "#10b981");

    // Google Search Console verification
    updateMetaTag("google-site-verification", "nQ_IA49yXG9t7cQghRngRA2KGhzmq5aHN46JVwgsU_Y");

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": heroContent?.name || "Malek Fouda",
      "jobTitle": heroContent?.title || "Full Stack Developer",
      "description": finalDescription,
      "url": url || window.location.href,
      "sameAs": [
        "https://github.com/malekfouda",
        "https://linkedin.com/in/malekfouda",
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "knowsAbout": [
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "Full Stack Development",
        "Web Development",
        "Software Engineering"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Full Stack Developer",
        "occupationLocation": {
          "@type": "Place",
          "name": "Remote"
        }
      }
    };

    // Add or update structured data script
    let existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(structuredData);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, image, type, url, heroContent]);

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
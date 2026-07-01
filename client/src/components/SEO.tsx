import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";

const SITE_URL = "https://malekfouda.com";

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
    const finalTitle = title || `${heroContent?.name || "Malek Fouda"} - ${heroContent?.title || "Full Stack Developer"}`;
    document.title = finalTitle;

    const finalDescription = description || "Transforming ideas into digital reality through expert development and creative solutions";
    updateMetaTag("description", finalDescription);

    const finalKeywords = keywords.length > 0 ? keywords.join(", ") : "full stack developer, react developer, node.js, web development, javascript, typescript, freelance developer";
    updateMetaTag("keywords", finalKeywords);

    // Derive a clean canonical — strip query params and fragments
    const cleanPath = canonicalPath ?? (window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, ""));
    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    updateMetaTag("og:title", finalTitle, "property");
    updateMetaTag("og:description", finalDescription, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:image", image || `${SITE_URL}/favicon.svg`, "property");
    updateMetaTag("og:image:width", "512", "property");
    updateMetaTag("og:image:height", "512", "property");
    updateMetaTag("og:site_name", "Malek Fouda Portfolio", "property");

    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", finalTitle, "name");
    updateMetaTag("twitter:description", finalDescription, "name");
    updateMetaTag("twitter:image", image || `${SITE_URL}/favicon.svg`, "name");
    updateMetaTag("twitter:image:alt", "Malek Fouda - Full Stack Developer", "name");

    updateLinkTag("canonical", canonicalUrl);

    updateMetaTag("robots", "index, follow");
    updateMetaTag("theme-color", "#10b981");
    updateMetaTag("google-site-verification", "nQ_IA49yXG9t7cQghRngRA2KGhzmq5aHN46JVwgsU_Y");

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": heroContent?.name || "Malek Fouda",
      "jobTitle": heroContent?.title || "Full Stack Developer",
      "description": finalDescription,
      "url": canonicalUrl,
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

    // Update the existing JSON-LD script (static one from SSR or previously set),
    // rather than appending a new one — avoids duplicate structured data.
    let ldScript = document.querySelector('script[type="application/ld+json"]');
    if (ldScript) {
      ldScript.textContent = JSON.stringify(structuredData);
    } else {
      const script = document.createElement('script');
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

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";

const SITE_URL = "https://malekfouda.com";
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export default function SEO({ 
  title,
  description,
  keywords = [],
  image,
  type = "website",
  canonicalPath,
  noIndex = false,
  imageAlt,
  imageWidth,
  imageHeight,
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
    const socialImage = image
      ? /^(https?:|data:)/.test(image) ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`
      : DEFAULT_SOCIAL_IMAGE;
    const socialImageType = socialImage.toLowerCase().includes(".webp")
      ? "image/webp"
      : socialImage.toLowerCase().match(/\.jpe?g(?:$|\?)/)
        ? "image/jpeg"
        : "image/png";
    const finalImageAlt = imageAlt || `${finalTitle} social preview`;
    const finalImageWidth = image ? imageWidth : 1200;
    const finalImageHeight = image ? imageHeight : 630;

    updateMetaTag("og:title", finalTitle, "property");
    updateMetaTag("og:description", finalDescription, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:image", socialImage, "property");
    updateMetaTag("og:image:type", socialImageType, "property");
    updateMetaTag("og:image:alt", finalImageAlt, "property");
    setOptionalMetaTag("og:image:width", finalImageWidth, "property");
    setOptionalMetaTag("og:image:height", finalImageHeight, "property");
    updateMetaTag("og:site_name", "Malek Fouda", "property");

    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", finalTitle, "name");
    updateMetaTag("twitter:description", finalDescription, "name");
    updateMetaTag("twitter:image", socialImage, "name");
    updateMetaTag("twitter:image:alt", finalImageAlt, "name");

    updateLinkTag("canonical", canonicalUrl);

    updateMetaTag("robots", noIndex ? "noindex, nofollow" : "index, follow");
    updateMetaTag("theme-color", "#050808");
    updateMetaTag("google-site-verification", "nQ_IA49yXG9t7cQghRngRA2KGhzmq5aHN46JVwgsU_Y");

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      "name": heroContent?.name || "Malek Fouda",
      "jobTitle": heroContent?.title || "Full Stack Developer",
      "description": "Cairo-based full-stack developer specializing in Shopify, WordPress, WooCommerce, custom business systems, and integrations.",
      "url": `${SITE_URL}/`,
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
        "Shopify",
        "WordPress",
        "WooCommerce",
        "Business systems",
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

  }, [title, description, keywords, image, type, canonicalPath, noIndex, imageAlt, imageWidth, imageHeight, heroContent]);

  return null;
}

function setOptionalMetaTag(name: string, content: number | undefined, attribute: string) {
  if (content === undefined) {
    document.querySelector(`meta[${attribute}="${name}"]`)?.remove();
    return;
  }
  updateMetaTag(name, String(content), attribute);
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

import sharp from "sharp";
import type { Project } from "@shared/schema";

const DATA_IMAGE_PATTERN = /^data:(image\/(?:jpeg|png|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=\s]+)$/;
const MAX_CACHED_IMAGES = 48;
const optimizedImageCache = new Map<string, Buffer>();

export function isDataImageUrl(value: string | null | undefined): value is string {
  return Boolean(value && DATA_IMAGE_PATTERN.test(value));
}

export function decodeDataImageUrl(value: string): Buffer | null {
  const match = DATA_IMAGE_PATTERN.exec(value);
  if (!match) return null;

  const buffer = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  return buffer.length > 0 ? buffer : null;
}

export async function optimizeProjectImage(input: Buffer): Promise<Buffer> {
  return sharp(input, { failOn: "warning", limitInputPixels: 40_000_000 })
    .rotate()
    .resize({
      width: 1600,
      height: 1000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();
}

export async function optimizeDataImageUrl(value: string, cacheKey: string): Promise<Buffer | null> {
  const cached = optimizedImageCache.get(cacheKey);
  if (cached) {
    // Refresh insertion order so frequently used images remain in the small LRU cache.
    optimizedImageCache.delete(cacheKey);
    optimizedImageCache.set(cacheKey, cached);
    return cached;
  }

  const source = decodeDataImageUrl(value);
  if (!source) return null;

  const optimized = await optimizeProjectImage(source);
  optimizedImageCache.set(cacheKey, optimized);
  if (optimizedImageCache.size > MAX_CACHED_IMAGES) {
    const oldestKey = optimizedImageCache.keys().next().value;
    if (oldestKey) optimizedImageCache.delete(oldestKey);
  }
  return optimized;
}

function versionFor(project: Project): number {
  return new Date(project.updatedAt).getTime();
}

export function getPublicProject(project: Project): Project {
  const version = versionFor(project);
  const image = isDataImageUrl(project.image)
    ? `/media/projects/${project.id}/thumbnail.webp?v=${version}`
    : project.image;
  const screenshots = project.screenshots
    ? project.screenshots.map((screenshot, index) =>
        isDataImageUrl(screenshot)
          ? `/media/projects/${project.id}/screenshot-${index}.webp?v=${version}`
          : screenshot,
      )
    : null;

  return { ...project, image, screenshots };
}

export function getProjectMediaSource(project: Project, asset: string): string | null {
  if (asset === "thumbnail.webp") return isDataImageUrl(project.image) ? project.image : null;

  const match = /^screenshot-(\d+)\.webp$/.exec(asset);
  if (!match) return null;
  const screenshot = project.screenshots?.[Number(match[1])];
  return isDataImageUrl(screenshot) ? screenshot : null;
}

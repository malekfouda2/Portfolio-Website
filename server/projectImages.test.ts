import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import type { Project } from "@shared/schema";
import {
  decodeDataImageUrl,
  getProjectMediaSource,
  getPublicProject,
  isDataImageUrl,
  optimizeProjectImage,
} from "./projectImages";

const tinyPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XwWZ4QAAAABJRU5ErkJggg==";

const project = {
  id: 7,
  title: "Example",
  description: "Example project",
  technologies: ["TypeScript"],
  image: tinyPng,
  type: "personal",
  url: null,
  screenshots: [tinyPng, "https://example.com/screenshot.jpg"],
  companyName: null,
  companyUrl: null,
  role: null,
  isVisible: true,
  sortOrder: 1,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
} satisfies Project;

test("recognizes and decodes supported data-image URLs", () => {
  assert.equal(isDataImageUrl(tinyPng), true);
  assert.equal(isDataImageUrl("data:text/html;base64,SGVsbG8="), false);
  assert.ok(decodeDataImageUrl(tinyPng)?.length);
});

test("replaces embedded public project images with versioned media URLs", () => {
  const publicProject = getPublicProject(project);

  assert.match(publicProject.image, /^\/media\/projects\/7\/thumbnail\.webp\?v=\d+$/);
  assert.match(publicProject.screenshots?.[0] || "", /^\/media\/projects\/7\/screenshot-0\.webp\?v=\d+$/);
  assert.equal(publicProject.screenshots?.[1], "https://example.com/screenshot.jpg");
  assert.equal(JSON.stringify(publicProject).includes("data:image"), false);
});

test("resolves only embedded media owned by the requested project", () => {
  assert.equal(getProjectMediaSource(project, "thumbnail.webp"), tinyPng);
  assert.equal(getProjectMediaSource(project, "screenshot-0.webp"), tinyPng);
  assert.equal(getProjectMediaSource(project, "screenshot-1.webp"), null);
  assert.equal(getProjectMediaSource(project, "../../secret.webp"), null);
});

test("normalizes uploaded images to bounded WebP files", async () => {
  const source = await sharp({
    create: { width: 2000, height: 1200, channels: 3, background: "#10b981" },
  }).png().toBuffer();
  const optimized = await optimizeProjectImage(source);
  const metadata = await sharp(optimized).metadata();

  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 1600);
  assert.equal(metadata.height, 960);
  assert.ok(optimized.length < source.length);
});

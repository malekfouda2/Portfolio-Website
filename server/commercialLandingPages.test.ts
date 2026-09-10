import test from "node:test";
import assert from "node:assert/strict";
import { commercialLandingPages } from "@shared/commercialLandingPages";

test("commercial landing pages have unique search signals", () => {
  const slugs = commercialLandingPages.map((page) => page.slug);
  const titles = commercialLandingPages.map((page) => page.seoTitle);
  const descriptions = commercialLandingPages.map((page) => page.seoDescription);

  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(titles).size, titles.length);
  assert.equal(new Set(descriptions).size, descriptions.length);

  for (const page of commercialLandingPages) {
    assert.match(page.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(page.seoTitle.length >= 35 && page.seoTitle.length <= 65);
    assert.ok(page.seoDescription.length >= 110 && page.seoDescription.length <= 165);
  }
});

test("commercial landing pages contain substantial buyer-focused content", () => {
  for (const page of commercialLandingPages) {
    assert.ok(page.painPoints.length >= 4);
    assert.ok(page.deliverables.length >= 5);
    assert.ok(page.outcomes.length >= 3);
    assert.ok(page.process.length >= 4);
    assert.ok(page.faqs.length >= 3);
    assert.ok(page.keywords.length >= 4);
    assert.ok(page.relatedService.slug);
  }
});

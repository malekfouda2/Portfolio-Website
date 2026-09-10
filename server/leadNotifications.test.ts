import assert from "node:assert/strict";
import test from "node:test";
import type { Contact } from "@shared/schema";
import { notifyAboutLead } from "./leadNotifications";

const lead: Contact = {
  id: 42,
  name: "Test Lead",
  email: "lead@example.com",
  company: null,
  websiteUrl: "https://example.com",
  projectType: "shopify",
  message: "An urgent Shopify URL issue needs investigation.",
  budgetRange: null,
  timeline: null,
  preferredContact: "email",
  landingPage: "/solutions/shopify-api-integration-developer",
  referrer: "https://google.com/",
  utmSource: "google",
  utmMedium: "organic",
  utmCampaign: null,
  status: "new",
  createdAt: new Date(),
  updatedAt: new Date(),
};

test("lead notification sends one admin email and one confirmation with idempotency keys", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.LEAD_FROM_EMAIL;
  const requests: Array<{ headers: Headers; body: Record<string, unknown> }> = [];

  process.env.RESEND_API_KEY = "test-key";
  process.env.LEAD_FROM_EMAIL = "Malek <leads@malekfouda.com>";
  globalThis.fetch = async (_input, init) => {
    requests.push({
      headers: new Headers(init?.headers),
      body: JSON.parse(String(init?.body)) as Record<string, unknown>,
    });
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  };

  try {
    assert.deepEqual(await notifyAboutLead(lead), { configured: true, delivered: true });
    assert.equal(requests.length, 2);
    assert.equal(requests[0].headers.get("Idempotency-Key"), "website-lead-admin/42");
    assert.equal(requests[1].headers.get("Idempotency-Key"), "website-lead-confirmation/42");
    assert.equal(requests[0].body.reply_to, "lead@example.com");
    assert.equal(String(requests[0].body.text).includes("urgent Shopify URL issue"), true);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
    if (originalFrom === undefined) delete process.env.LEAD_FROM_EMAIL;
    else process.env.LEAD_FROM_EMAIL = originalFrom;
  }
});

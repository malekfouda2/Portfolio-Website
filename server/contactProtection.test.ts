import assert from "node:assert/strict";
import test from "node:test";
import { containsHighConfidenceSpam, validateHumanSignals } from "./contactProtection";

test("human-signal validation accepts a normally completed form", () => {
  assert.deepEqual(validateHumanSignals("", 1_000, 5_000), { valid: true });
});

test("human-signal validation rejects honeypots and implausible timing", () => {
  assert.deepEqual(validateHumanSignals("bot value", 1_000, 5_000), { valid: false, reason: "honeypot" });
  assert.deepEqual(validateHumanSignals("", 4_500, 5_000), { valid: false, reason: "timing" });
  assert.deepEqual(validateHumanSignals("", undefined, 5_000), { valid: false, reason: "timing" });
});

test("spam checks allow legitimate urgent, investment, crypto, and URL enquiries", () => {
  assert.equal(containsHighConfidenceSpam("Urgent Shopify repair at https://example.com"), false);
  assert.equal(containsHighConfidenceSpam("We need an investment dashboard for a crypto platform"), false);
  assert.equal(containsHighConfidenceSpam("Claim a casino bonus and get rich quick"), true);
});

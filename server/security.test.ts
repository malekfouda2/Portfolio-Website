import test from "node:test";
import assert from "node:assert/strict";
import { cleanText } from "./security";

test("keeps business wording that looks like SQL keywords in contact messages", () => {
  const message = "I need to update my Shopify store; can you create a new checkout and delete old apps -- and select a theme?";
  assert.equal(cleanText(message, 2000), message);
});

test("keeps punctuation and words the old sanitizer removed", () => {
  const message = "Budget <5k & the document. is in the window. OR a=b";
  assert.equal(cleanText(message, 2000), message);
});

test("strips control characters but keeps line breaks and tabs", () => {
  assert.equal(cleanText("  Hello\u0000\u0007 there\n\tthanks\u007F  ", 100), "Hello there\n\tthanks");
});

test("trims, caps length, and rejects non-strings", () => {
  assert.equal(cleanText("  abcdef  ", 3), "abc");
  assert.equal(cleanText(undefined, 10), "");
  assert.equal(cleanText({ $gt: "" }, 10), "");
});

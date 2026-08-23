import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml, sanitizeHttpUrl, serializeJsonLd } from "./htmlSafety";

test("escapes hostile CMS values for HTML text and attributes", () => {
  assert.equal(
    escapeHtml(`"</title><script>alert('xss')</script>`),
    "&quot;&lt;/title&gt;&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
  );
});

test("serializes JSON-LD without allowing a closing script tag", () => {
  const value = { description: "</script><script>alert('xss')</script>" };
  const serialized = serializeJsonLd(value);

  assert.equal(serialized.includes("</script>"), false);
  assert.equal(serialized.includes("<script>"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});

test("allows only HTTP(S) outbound URLs", () => {
  assert.equal(sanitizeHttpUrl("https://example.com/project"), "https://example.com/project");
  assert.equal(sanitizeHttpUrl("http://example.com/project"), "http://example.com/project");
  assert.equal(sanitizeHttpUrl("javascript:alert(1)"), null);
  assert.equal(sanitizeHttpUrl("data:text/html,unsafe"), null);
  assert.equal(sanitizeHttpUrl("/relative-project"), null);
});
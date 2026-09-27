import test from "node:test";
import assert from "node:assert/strict";
import type { Request } from "express";
import { AUTH_COOKIE, isSecureRequest, readCookie, sessionCookieOptions } from "./sessionCookie";

test("reads the admin session cookie among other cookies", () => {
  const header = `theme=dark; ${AUTH_COOKIE}=abc.def.ghi; _ga=GA1.1`;
  assert.equal(readCookie(header, AUTH_COOKIE), "abc.def.ghi");
});

test("ignores missing, prefixed, and malformed session cookies", () => {
  assert.equal(readCookie(undefined, AUTH_COOKIE), undefined);
  assert.equal(readCookie(`x${AUTH_COOKIE}=forged`, AUTH_COOKIE), undefined);
  assert.equal(readCookie(`${AUTH_COOKIE}=%E0%A4%A`, AUTH_COOKIE), undefined);
});

test("session cookie is httpOnly and same-site lax, and secure only over https", () => {
  assert.deepEqual(sessionCookieOptions(true), { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  assert.equal(sessionCookieOptions(false).secure, false);
});

test("treats a proxied https request as secure", () => {
  const proxied = { secure: false, get: (name: string) => (name === "x-forwarded-proto" ? "https,http" : undefined) };
  const plain = { secure: false, get: () => undefined };
  assert.equal(isSecureRequest(proxied as unknown as Request), true);
  assert.equal(isSecureRequest(plain as unknown as Request), false);
});

import test from "node:test";
import assert from "node:assert/strict";
import { AUTH_COOKIE, readCookie, sessionCookieOptions } from "./sessionCookie";

test("reads the admin session cookie among other cookies", () => {
  const header = `theme=dark; ${AUTH_COOKIE}=abc.def.ghi; _ga=GA1.1`;
  assert.equal(readCookie(header, AUTH_COOKIE), "abc.def.ghi");
});

test("ignores missing, prefixed, and malformed session cookies", () => {
  assert.equal(readCookie(undefined, AUTH_COOKIE), undefined);
  assert.equal(readCookie(`x${AUTH_COOKIE}=forged`, AUTH_COOKIE), undefined);
  assert.equal(readCookie(`${AUTH_COOKIE}=%E0%A4%A`, AUTH_COOKIE), undefined);
});

test("session cookie is httpOnly, same-site strict, and secure in production", () => {
  assert.deepEqual(sessionCookieOptions(true), { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
  assert.equal(sessionCookieOptions(false).secure, false);
});

import type { CookieOptions, Request, Response } from "express";

// The admin JWT lives in an httpOnly cookie so page scripts (and any injected
// script) can never read it. SameSite=Strict keeps it off cross-site requests.
export const AUTH_COOKIE = "portfolio_admin";
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * `secure` follows the actual connection rather than NODE_ENV: a Secure cookie
 * is dropped by the browser on a plain-http origin, which would silently log
 * the admin straight back out. `SameSite=Lax` keeps the cookie on ordinary
 * navigations (following a link to /dashboard from elsewhere) while still
 * withholding it from cross-site form posts.
 */
export function sessionCookieOptions(secure: boolean): CookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  };
}

/** True when the browser reached us over https, including via a trusted proxy. */
export function isSecureRequest(req: Request): boolean {
  return req.secure || req.get("x-forwarded-proto")?.split(",")[0].trim() === "https";
}

export function setSessionCookie(req: Request, res: Response, token: string) {
  res.cookie(AUTH_COOKIE, token, { ...sessionCookieOptions(isSecureRequest(req)), maxAge: SESSION_MAX_AGE_MS });
}

export function clearSessionCookie(req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE, sessionCookieOptions(isSecureRequest(req)));
}

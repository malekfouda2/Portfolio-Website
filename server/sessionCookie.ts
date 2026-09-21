import type { CookieOptions, Response } from "express";

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

export function sessionCookieOptions(production = process.env.NODE_ENV === "production"): CookieOptions {
  return {
    httpOnly: true,
    secure: production,
    sameSite: "strict",
    path: "/",
  };
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE, token, { ...sessionCookieOptions(), maxAge: SESSION_MAX_AGE_MS });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE, sessionCookieOptions());
}

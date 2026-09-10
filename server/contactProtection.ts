const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MINIMUM_FORM_TIME_MS = 1_200;
const MAXIMUM_FORM_AGE_MS = 2 * 60 * 60 * 1000;

export type FormTimingResult =
  | { valid: true }
  | { valid: false; reason: "honeypot" | "timing" };

export function validateHumanSignals(
  honeypot: unknown,
  formStartedAt: unknown,
  now = Date.now(),
): FormTimingResult {
  if (typeof honeypot === "string" && honeypot.trim()) {
    return { valid: false, reason: "honeypot" };
  }

  const startedAt = typeof formStartedAt === "number"
    ? formStartedAt
    : Number(formStartedAt);
  const elapsed = now - startedAt;

  if (!Number.isFinite(startedAt) || elapsed < MINIMUM_FORM_TIME_MS || elapsed > MAXIMUM_FORM_AGE_MS) {
    return { valid: false, reason: "timing" };
  }

  return { valid: true };
}

export async function verifyTurnstile(
  token: unknown,
  remoteIp?: string,
): Promise<{ success: boolean; configured: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true, configured: false };
  if (typeof token !== "string" || !token.trim()) {
    return { success: false, configured: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
      signal: controller.signal,
    });
    if (!response.ok) return { success: false, configured: true };

    const result = await response.json() as { success?: boolean };
    return { success: result.success === true, configured: true };
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return { success: false, configured: true };
  } finally {
    clearTimeout(timeout);
  }
}

export function containsHighConfidenceSpam(...values: Array<string | null | undefined>): boolean {
  const content = values.filter(Boolean).join(" ");
  return /\b(?:viagra|cialis|online pharmacy|casino bonus|lottery winner|free money|get rich quick|make money fast)\b/i.test(content);
}

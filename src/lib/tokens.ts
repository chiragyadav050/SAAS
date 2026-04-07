import { randomBytes, createHash } from "crypto";

/**
 * Generate a URL-safe public access token for a document.
 */
export function generatePublicToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Create a deterministic hash for open tracking pixels.
 */
export function generateTrackingId(sendId: string): string {
  return createHash("sha256").update(sendId).digest("hex").slice(0, 16);
}

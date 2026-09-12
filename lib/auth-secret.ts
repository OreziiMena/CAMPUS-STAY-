/**
 * Campus Tent - Centralized Authentication Secret Provider
 * Enforces strict 32+ character entropy in production and prevents static fallback exploits.
 */

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (
      !secret ||
      secret.trim().length < 32 ||
      secret.includes("fallback-secret") ||
      secret.includes("placeholder")
    ) {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION ERROR: AUTH_SECRET is missing, too short (< 32 characters), or using an insecure placeholder in production. Set a cryptographically secure 32+ character string in your production environment variables."
      );
    }
    return secret.trim();
  }

  // Safe development fallback for local testing only
  if (!secret) {
    if (typeof window === "undefined" && !process.env.DEV_AUTH_SECRET_WARNED) {
      console.warn(
        "⚠️ [SECURITY NOTICE] AUTH_SECRET is not configured in your local environment. Using temporary development secret. Please configure a 32+ character AUTH_SECRET in .env for production."
      );
      process.env.DEV_AUTH_SECRET_WARNED = "true";
    }
    return "dev-local-secret-key-must-be-at-least-32-chars-long-temp";
  }

  return secret.trim();
}

/**
 * Campus Tent - Email Content & URL Sanitizer
 * Prevents HTML injection, XSS attacks, and malicious protocol links in transactional and broadcast emails.
 */

/**
 * Escapes unsafe HTML characters to prevent XSS / markup injection.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and sanitizes CTA and navigation URLs.
 * Rejects unsafe schemes (javascript:, data:, vbscript:, file:) and ensures only safe http/https/mailto/tel/relative paths.
 */
export function sanitizeUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Enforce allowed protocols
  const isSafeProtocol = /^(https?:\/\/|\/|mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|tel:\+?[0-9\s-]{3,20})/i.test(
    trimmed
  );

  if (!isSafeProtocol) {
    return null;
  }

  // Escape quotes and special characters
  return escapeHtml(trimmed);
}

/**
 * Safely converts plain text / basic markdown formatting into sanitized email paragraphs.
 * 1. Escapes all raw HTML characters first.
 * 2. Parses safe bold (**text** or __text__) and italics (*text* or _text_).
 * 3. Splits into styled paragraphs with line breaks.
 */
export function formatSafeEmailMessage(rawMessage: string): string {
  if (!rawMessage || typeof rawMessage !== "string") return "";

  // 1. Fully escape raw HTML characters first
  const escaped = escapeHtml(rawMessage.trim());

  // 2. Safe inline markdown parsing
  // Bold: **text** or __text__
  let formatted = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic: *text* or _text_ (single asterisk/underscore not preceded/followed by alphanumerics if underscore)
  formatted = formatted.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/(?<!\w)_([^_]+)_(?!\w)/g, "<em>$1</em>");

  // 3. Format paragraphs and newlines
  const paragraphs = formatted
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #374151; font-size: 15px;">${p.replace(
          /\n/g,
          "<br/>"
        )}</p>`
    )
    .join("");
}

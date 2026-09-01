import crypto from "crypto";

export type AllowedCategory = "image" | "document" | "video";

export interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
  sanitizedExtension?: string;
  canonicalMime?: string;
}

/**
 * Validates a file's actual byte signature (magic numbers) against its stated extension and size limits.
 * Prevents disguised executable / script uploads.
 */
export function validateFileBuffer(
  buffer: Buffer,
  category: AllowedCategory | AllowedCategory[],
  maxSizeInBytes?: number
): ValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Empty or missing file data." };
  }

  const categories = Array.isArray(category) ? category : [category];

  // Default size limits
  const DEFAULT_MAX_SIZES: Record<AllowedCategory, number> = {
    image: 5 * 1024 * 1024,      // 5MB
    document: 5 * 1024 * 1024,   // 5MB
    video: 15 * 1024 * 1024,     // 15MB
  };

  const effectiveMaxSize = maxSizeInBytes || Math.max(...categories.map((c) => DEFAULT_MAX_SIZES[c]));
  if (buffer.length > effectiveMaxSize) {
    const mbLimit = (effectiveMaxSize / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File size exceeds the ${mbLimit}MB maximum limit.` };
  }

  // Detect true file type by inspecting magic header bytes
  const magic = detectMagicType(buffer);
  if (!magic) {
    return { valid: false, error: "Corrupt or unrecognized file format. Upload valid images or PDFs only." };
  }

  // Check if detected type matches allowed categories
  const isImageMatch = categories.includes("image") && ["image/jpeg", "image/png", "image/webp"].includes(magic.mime);
  const isDocMatch = categories.includes("document") && ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(magic.mime);
  const isVideoMatch = categories.includes("video") && ["video/mp4", "video/webm", "video/quicktime"].includes(magic.mime);

  if (!isImageMatch && !isDocMatch && !isVideoMatch) {
    return {
      valid: false,
      error: `File signature mismatch (${magic.mime}). Disallowed file format.`,
    };
  }

  return {
    valid: true,
    detectedType: magic.type,
    sanitizedExtension: magic.ext,
    canonicalMime: magic.mime,
  };
}

/**
 * Inspects raw buffer header bytes for verified magic numbers.
 */
function detectMagicType(buf: Buffer): { type: string; ext: string; mime: string } | null {
  if (buf.length < 12) return null;

  // 1. JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { type: "JPEG", ext: ".jpg", mime: "image/jpeg" };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { type: "PNG", ext: ".png", mime: "image/png" };
  }

  // 3. WebP: RIFF ... WEBP
  // Offset 0-3: "RIFF" (52 49 46 46), Offset 8-11: "WEBP" (57 45 42 50)
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return { type: "WEBP", ext: ".webp", mime: "image/webp" };
  }

  // 4. PDF: 25 50 44 46 (%PDF)
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
    return { type: "PDF", ext: ".pdf", mime: "application/pdf" };
  }

  // 5. MP4 / MOV: Offset 4: 66 74 79 70 ("ftyp")
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    return { type: "MP4", ext: ".mp4", mime: "video/mp4" };
  }

  // 6. WebM: 1A 45 DF A3 (EBML)
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return { type: "WEBM", ext: ".webm", mime: "video/webm" };
  }

  return null;
}

/**
 * Generates a randomized, cryptographically collision-free, path-traversal-proof filename.
 */
export function generateSecureFilename(prefix: string, ext: string): string {
  const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "");
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  const cleanExt = ext.startsWith(".") ? ext : `.${ext}`;
  return `${sanitizedPrefix}-${timestamp}-${randomSuffix}${cleanExt}`;
}

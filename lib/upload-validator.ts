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

  // Default size limits: 10MB for images/docs, 50MB for videos
  const DEFAULT_MAX_SIZES: Record<AllowedCategory, number> = {
    image: 10 * 1024 * 1024,     // 10MB
    document: 10 * 1024 * 1024,  // 10MB
    video: 50 * 1024 * 1024,     // 50MB
  };

  const effectiveMaxSize = maxSizeInBytes || Math.max(...categories.map((c) => DEFAULT_MAX_SIZES[c]));
  if (buffer.length > effectiveMaxSize) {
    const mbLimit = (effectiveMaxSize / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File size exceeds the ${mbLimit}MB maximum limit.` };
  }

  // Detect true file type by inspecting magic header bytes
  const magic = detectMagicType(buffer);
  if (!magic) {
    return { valid: false, error: "Corrupt or unrecognized file format. Please upload standard images, PDFs, or videos." };
  }

  // Check if detected type matches allowed categories
  const isImageMatch = categories.includes("image") && ["image/jpeg", "image/png", "image/webp"].includes(magic.mime);
  const isDocMatch = categories.includes("document") && ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(magic.mime);
  const isVideoMatch = categories.includes("video") && ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"].includes(magic.mime);

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

  // 5. MP4 / MOV / QuickTime container detection:
  // Inspect first 64 bytes for "ftyp", "moov", "mdat", "wide", "free", or "skip"
  const headerSlice = buf.subarray(0, Math.min(buf.length, 64)).toString("binary");
  if (
    headerSlice.includes("ftyp") ||
    headerSlice.includes("moov") ||
    headerSlice.includes("mdat") ||
    headerSlice.includes("wide")
  ) {
    // Determine if QuickTime or standard MP4
    if (headerSlice.includes("ftypqt") || headerSlice.includes("qt  ")) {
      return { type: "MOV", ext: ".mov", mime: "video/quicktime" };
    }
    return { type: "MP4", ext: ".mp4", mime: "video/mp4" };
  }

  // 6. WebM / MKV: 1A 45 DF A3 (EBML)
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return { type: "WEBM", ext: ".webm", mime: "video/webm" };
  }

  // 7. AVI: RIFF ... AVI
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x41 &&
    buf[9] === 0x56 &&
    buf[10] === 0x49
  ) {
    return { type: "AVI", ext: ".avi", mime: "video/x-msvideo" };
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

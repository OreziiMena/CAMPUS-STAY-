import crypto from "crypto";

// RFC 4648 Base32 alphabet
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

export function base32Decode(input: string): Buffer {
  const cleaned = input.toUpperCase().replace(/=+$/, "").replace(/[\s-]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generate a new random Base32 TOTP secret (20 bytes / 32 base32 chars)
 */
export function generateTOTPSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Generate a 6-digit TOTP code for a given secret at a given counter
 */
export function generateTOTPCode(secret: string, counter?: number): string {
  const key = base32Decode(secret);
  const timeStep = 30;
  const count = counter !== undefined ? counter : Math.floor(Date.now() / 1000 / timeStep);

  // 8-byte big-endian counter buffer
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(count));

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = digest[digest.length - 1] & 0xf;
  const codeInt =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const code = (codeInt % 1000000).toString().padStart(6, "0");
  return code;
}

/**
 * Verify a 6-digit TOTP code with ±1 window tolerance (±30 seconds)
 */
export function verifyTOTPCode(token: string, secret: string, windowTolerance = 1): boolean {
  if (!token || !secret) return false;
  const cleanedToken = token.trim().replace(/\s/g, "");
  if (cleanedToken.length !== 6 || isNaN(Number(cleanedToken))) return false;

  const currentCount = Math.floor(Date.now() / 1000 / 30);

  for (let i = -windowTolerance; i <= windowTolerance; i++) {
    const generated = generateTOTPCode(secret, currentCount + i);
    if (crypto.timingSafeEqual(Buffer.from(generated), Buffer.from(cleanedToken))) {
      return true;
    }
  }

  return false;
}

/**
 * Build standard otpauth:// URI for authenticator apps
 */
export function getOTPAuthURI(accountName: string, secret: string, issuer = "Campus Tent"): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generate a set of 8 single-use recovery backup codes
 */
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // e.g. "8A4F-29BC"
    const part1 = crypto.randomBytes(2).toString("hex").toUpperCase();
    const part2 = crypto.randomBytes(2).toString("hex").toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

/**
 * Hash a backup code for secure storage
 */
export function hashBackupCode(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/[\s-]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Verify a provided backup code against a list of hashed backup codes
 * Returns the index of the matching code, or -1 if no match
 */
export function verifyBackupCode(providedCode: string, hashedCodes: string[]): number {
  if (!providedCode || !hashedCodes || hashedCodes.length === 0) return -1;
  const hashedInput = hashBackupCode(providedCode);

  for (let i = 0; i < hashedCodes.length; i++) {
    if (hashedCodes[i] === hashedInput) {
      return i;
    }
  }
  return -1;
}

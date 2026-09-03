import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth";
import { uploadToR2 } from "@/lib/r2";
import { validateFileBuffer, generateSecureFilename } from "@/lib/upload-validator";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
    const maxLimit = isVideo ? 25 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file.size > maxLimit) {
      const mb = (maxLimit / (1024 * 1024)).toFixed(0);
      return NextResponse.json({ success: false, error: `File size exceeds the ${mb}MB limit.` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate actual file magic bytes
    const validation = validateFileBuffer(buffer, ["image", "video"], maxLimit);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error || "Invalid file format." }, { status: 400 });
    }

    const safeExt = validation.sanitizedExtension || (isVideo ? ".mp4" : ".jpg");
    const filename = generateSecureFilename(`${user.id}-property`, safeExt);
    const contentType = validation.canonicalMime || (isVideo ? "video/mp4" : "image/jpeg");

    // 1. Upload to Cloudflare R2
    const r2Result = await uploadToR2(buffer, `properties/${filename}`, contentType);
    if (r2Result.success && r2Result.url) {
      return NextResponse.json({ success: true, url: r2Result.url });
    }

    // 2. Local fallback if R2 is not configured
    const uploadDir = path.join(process.cwd(), "public", "uploads", "properties");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/properties/${filename}` });
  } catch (err: any) {
    console.error("API upload error:", err);
    return NextResponse.json({ success: false, error: err.message || "Upload failed." }, { status: 500 });
  }
}

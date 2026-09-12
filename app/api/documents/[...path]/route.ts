import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth";
import { readFile, stat } from "fs/promises";
import path from "path";
import { getR2ObjectBuffer } from "@/lib/r2";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to view verification documents." },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const docPathSegments = resolvedParams.path;

    if (!docPathSegments || docPathSegments.length === 0) {
      return NextResponse.json({ success: false, error: "Document path not specified." }, { status: 400 });
    }

    // Sanitize filename and prevent directory traversal
    const safeSegments = docPathSegments.map((segment) => path.basename(segment));
    const requestedFileName = safeSegments[safeSegments.length - 1];

    // Authorization check: Admin can view all documents; non-admins can only view their own documents
    if (user.role !== "ADMIN") {
      const isOwner =
        (user.studentProfile && requestedFileName.startsWith(user.studentProfile.id)) ||
        (user.agentProfile && requestedFileName.startsWith(user.agentProfile.id));

      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: "Forbidden. You do not have permission to view this document." },
          { status: 403 }
        );
      }
    }

    const ext = path.extname(requestedFileName).toLowerCase();
    const defaultContentType = MIME_MAP[ext] || "application/octet-stream";

    // 1. Check in Cloudflare R2 private bucket first
    const r2Key = safeSegments.join("/");
    const r2Result = await getR2ObjectBuffer(r2Key);
    if (r2Result.success && r2Result.buffer) {
      return new NextResponse(new Uint8Array(r2Result.buffer), {
        status: 200,
        headers: {
          "Content-Type": r2Result.contentType || defaultContentType,
          "Content-Disposition": `inline; filename="${requestedFileName}"`,
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    // 2. Check in secure local private uploads directory
    const privateBaseDir = path.join(process.cwd(), "private_uploads");
    const primaryFilePath = path.join(privateBaseDir, ...safeSegments);

    // 3. Fallback to public uploads for backwards compatibility with seeded documents
    const legacyBaseDir = path.join(process.cwd(), "public", "uploads");
    const legacyFilePath = path.join(legacyBaseDir, ...safeSegments);

    let targetFilePath = primaryFilePath;
    let fileExists = false;

    try {
      const stats = await stat(primaryFilePath);
      if (stats.isFile()) fileExists = true;
    } catch {
      try {
        const stats = await stat(legacyFilePath);
        if (stats.isFile()) {
          targetFilePath = legacyFilePath;
          fileExists = true;
        }
      } catch {
        fileExists = false;
      }
    }

    if (!fileExists) {
      return NextResponse.json({ success: false, error: "Document file not found." }, { status: 404 });
    }

    const fileBuffer = await readFile(targetFilePath);
    const localExt = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_MAP[localExt] || defaultContentType;

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${requestedFileName}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("Secure document view error:", err);
    return NextResponse.json({ success: false, error: "Failed to retrieve document." }, { status: 500 });
  }
}

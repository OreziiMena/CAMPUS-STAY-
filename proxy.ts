import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "campus_stay_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key-at-least-32-chars-long-security-key";

// Helper to convert hex signature back to ArrayBuffer
function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

// Verification of signed session token using Web Crypto API (fully Edge-compliant)
async function verifySessionInEdge(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    
    // Import raw AUTH_SECRET key for HMAC validation
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(AUTH_SECRET),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["verify"]
    );
    
    // Timing-safe HMAC signature verification using browser native Web Crypto API
    const isSignatureValid = await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBuffer(signature),
      new TextEncoder().encode(data)
    );
    
    if (!isSignatureValid) {
      return null;
    }
    
    // Base64URL to UTF-8 JSON parsing
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const payload = JSON.parse(decoded);

    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Session verification in edge failed:", err);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Short-circuit redirects for easy root-level paths
  if (pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/rolepick";
    return NextResponse.redirect(url);
  }

  const isAgentRoute = pathname.startsWith("/agent-dashboard");
  const isStudentRoute = pathname.startsWith("/student-dashboard");
  const isAdminRoute = pathname.startsWith("/admin-dashboard");
  const isChatRoute = pathname.startsWith("/chat");

  if (isAgentRoute || isStudentRoute || isAdminRoute || isChatRoute) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifySessionInEdge(sessionCookie.value);
    if (!payload || !payload.userId) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Role-based authorization redirects
    if (isAgentRoute && payload.role !== "AGENT") {
      const url = request.nextUrl.clone();
      url.pathname = payload.role === "STUDENT" ? "/student-dashboard" : "/explore";
      return NextResponse.redirect(url);
    }

    if (isStudentRoute && payload.role !== "STUDENT") {
      const url = request.nextUrl.clone();
      url.pathname = payload.role === "AGENT" ? "/agent-dashboard" : "/explore";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && payload.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = payload.role === "AGENT" ? "/agent-dashboard" : "/student-dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/agent-dashboard/:path*",
    "/student-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/chat/:path*",
    "/login",
    "/signup",
  ],
};

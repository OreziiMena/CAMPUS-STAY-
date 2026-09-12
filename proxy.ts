import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSecret } from "@/lib/auth-secret";

const SESSION_COOKIE_NAME = "campus_stay_session";

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
    const secret = getAuthSecret();
    
    // Import raw AUTH_SECRET key for HMAC validation
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
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
    
    // Base64URL to UTF-8 JSON parsing with robust padding
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = atob(padded);
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
  const { pathname, search } = request.nextUrl;

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
  const isAuthRoute = ["/auth/login", "/auth/student-signup", "/auth/agent-signup", "/auth/rolepick"].includes(pathname);

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const payload = sessionCookie?.value ? await verifySessionInEdge(sessionCookie.value) : null;

  // 1. Protected Private Dashboard & Chat Routes
  if (isAgentRoute || isStudentRoute || isAdminRoute || isChatRoute) {
    if (!payload || !payload.userId) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }

    // Role-based authorization redirects
    if (isAgentRoute && payload.role !== "AGENT") {
      const url = request.nextUrl.clone();
      url.pathname = payload.role === "STUDENT" ? "/student-dashboard" : "/";
      return NextResponse.redirect(url);
    }

    if (isStudentRoute && payload.role !== "STUDENT") {
      const url = request.nextUrl.clone();
      url.pathname = payload.role === "AGENT" ? "/agent-dashboard" : "/";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && payload.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = payload.role === "AGENT" ? "/agent-dashboard" : "/student-dashboard";
      return NextResponse.redirect(url);
    }
  }

  // 2. Auth Routes: Redirect already logged-in users to their dashboard
  if (isAuthRoute && payload && payload.userId) {
    if (payload.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (payload.role === "AGENT") {
      return NextResponse.redirect(new URL("/agent-dashboard", request.url));
    } else if (payload.role === "STUDENT") {
      return NextResponse.redirect(new URL("/student-dashboard", request.url));
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
    "/auth/login",
    "/auth/student-signup",
    "/auth/agent-signup",
    "/auth/rolepick",
    "/login",
    "/signup",
  ],
};

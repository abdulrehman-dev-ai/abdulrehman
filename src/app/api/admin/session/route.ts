import { NextRequest, NextResponse } from "next/server";
import { adminCookieOptions, isAdminAuthenticated, mintSession, sessionCookieName, verifyPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.password !== "string" || body.password.length > 1024 || !verifyPassword(body.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  if (!process.env.ADMIN_SESSION_SECRET || !process.env.GITHUB_CONTENT_TOKEN) {
    return NextResponse.json({ error: "Admin system is not configured" }, { status: 503 });
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(sessionCookieName(), mintSession(), adminCookieOptions);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(sessionCookieName(), "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}

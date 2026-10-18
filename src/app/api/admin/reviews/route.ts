import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { d1Query } from "@/lib/d1-rest";
export const runtime = "nodejs";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const reviews = await d1Query("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100");
    return NextResponse.json({ reviews }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Database unavailable" }, { status: 503 }); }
}
export async function PATCH(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin || !await isAdminAuthenticated())
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.id !== "string" || !/^[a-f0-9-]{36}$/.test(body.id) ||
      !["approved", "rejected", "pending"].includes(body.status))
    return NextResponse.json({ error: "Invalid review decision" }, { status: 400 });
  try {
    await d1Query("UPDATE reviews SET status = ?, updated_at = ? WHERE id = ?",
      [body.status, new Date().toISOString(), body.id]);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Unable to save moderation decision" }, { status: 503 }); }
}

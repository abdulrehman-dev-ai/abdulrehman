import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { d1Query } from "@/lib/d1-rest";
export const runtime = "nodejs";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const orders = await d1Query(
      "SELECT id, service_title, amount, currency, customer_name, customer_email, payment_method, status, created_at FROM orders ORDER BY created_at DESC LIMIT 100",
    );
    return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Database unavailable" }, { status: 503 }); }
}
export async function PATCH(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin || !await isAdminAuthenticated())
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.id !== "string" || !/^ORD-[A-Z0-9-]+$/.test(body.id) ||
      !["cancelled", "pending_bank_transfer"].includes(body.status))
    return NextResponse.json({ error: "Invalid order state update" }, { status: 400 });
  try {
    await d1Query(
      "UPDATE orders SET status=?, updated_at=? WHERE id=? AND status IN ('pending_bank_transfer', 'cancelled')",
      [body.status, new Date().toISOString(), body.id],
    );
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Update failed" }, { status: 503 }); }
}

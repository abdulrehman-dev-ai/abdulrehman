import { NextResponse } from "next/server";

// Checkout intentionally unavailable until a durable database and fully
// verified payment integration have passed production tests.
export async function POST() {
  return NextResponse.json(
    { error: "Online orders are not available yet. Please request a project quote." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

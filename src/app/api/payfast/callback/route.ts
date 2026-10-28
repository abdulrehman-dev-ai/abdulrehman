import { NextResponse } from "next/server";

// Never accept client-supplied payment status as proof of settlement.
export async function POST() {
  return NextResponse.json(
    { error: "Payment callbacks unavailable until provider verification is implemented." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

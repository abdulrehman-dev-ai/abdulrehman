import { NextResponse } from "next/server";

// Never update an order based on unverified browser/query/form parameters.
// Payment callbacks must be authenticated, checked against the processor,
// and applied idempotently to durable order storage before being enabled.
export async function POST() {
  return NextResponse.json(
    { error: "Payment callbacks are unavailable pending verified gateway integration." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

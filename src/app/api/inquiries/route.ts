import { NextResponse } from "next/server";

// Email-only MVP. Do not claim persistence: CRM storage and abuse prevention
// must be added before enabling this route for public production traffic.
export const runtime = "nodejs";

const categories = new Set([
  "Full-stack application",
  "Business website / e-commerce",
  "Cloud migration / DevOps",
  "Security assessment",
  "Other",
]);
const budgets = new Set([
  "Let's discuss",
  "Below PKR 50,000",
  "PKR 50,000–150,000",
  "PKR 150,000+",
  "International / custom quote",
]);

function response(message: string, status: number) {
  return NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
function field(value: unknown, max: number) {
  return typeof value === "string" && value.length <= max ? value.trim() : null;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return response("Request origin not allowed.", 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return response("Send a JSON request.", 415);
  }

  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 8_000) return response("Inquiry is too large.", 413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return response("Invalid inquiry.", 400);
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return response("Invalid inquiry.", 400);
  }

  // Honeypot: bots submitting the hidden field get no delivery.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return response("Inquiry submitted.", 202);
  }

  const kind = field(payload.kind, 80);
  const budget = field(payload.budget, 80);
  const sender = field(payload.sender, 254);
  const goal = field(payload.goal, 180);
  const details = field(payload.details ?? "", 2400);
  const service = field(payload.service ?? "", 100);

  if (!kind || !categories.has(kind) || !budget || !budgets.has(budget) ||
      !sender || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender) ||
      !goal || goal.length < 10 || details === null || service === null ||
      (service !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service))) {
    return response("Please check the form fields and try again.", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;
  // No silent success: avoid collecting inquiries without a real destination.
  if (!apiKey || !from || !to) {
    return response("Direct submission is not configured. Please use the email option.", 503);
  }

  const text = [
    "New portfolio inquiry",
    "",
    "Project type: " + kind,
    ...(service ? ["Requested service: " + service] : []),
    "Client email: " + sender,
    "Budget: " + budget,
    "Goal: " + goal,
    "",
    "Additional context:",
    details || "(none)",
  ].join("\n");

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: sender,
        subject: "Portfolio inquiry: " + (service || kind),
        text,
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!result.ok) {
      console.error("Portfolio inquiry email provider returned HTTP", result.status);
      return response("Could not send your inquiry. Please use the email option.", 502);
    }
    // Provider accepted the email; delivery to the mailbox is not guaranteed.
    return response("Inquiry submitted successfully.", 200);
  } catch {
    console.error("Portfolio inquiry email provider connection failed.");
    return response("Could not send your inquiry. Please use the email option.", 502);
  }
}

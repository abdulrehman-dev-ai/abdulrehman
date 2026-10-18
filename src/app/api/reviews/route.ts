import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { d1Query } from "@/lib/d1-rest";

export const runtime = "nodejs";
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  try {
    const reviews = await d1Query(
      "SELECT id, author, project, rating, content, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 40",
    );
    return json({ reviews });
  } catch { return json({ reviews: [], error: "Reviews unavailable" }, 503); }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Invalid origin" }, 403);
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return json({ error: "Reviews are not accepting submissions." }, 503);
  const body = await request.json().catch(() => ({}));
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const project = typeof body.project === "string" ? body.project.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const rating = Number(body.rating);
  if (body.website || author.length < 2 || author.length > 80 || project.length < 2 || project.length > 100 ||
      content.length < 20 || content.length > 1500 || !Number.isInteger(rating) || rating < 1 || rating > 5 ||
      typeof body.turnstileToken !== "string") return json({ error: "Invalid review" }, 400);
  const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", body: new URLSearchParams({ secret, response: body.turnstileToken }),
    cache: "no-store",
  }).then(r => r.json()).catch(() => ({ success: false }));
  if (!verification.success) return json({ error: "Verification failed" }, 403);
  const now = new Date().toISOString();
  try {
    await d1Query(
      "INSERT INTO reviews (id, author, project, rating, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)",
      [randomUUID(), author, project, rating, content, now, now],
    );
    return json({ received: true, message: "Review submitted for moderation." }, 202);
  } catch { return json({ error: "Review submission unavailable" }, 503); }
}

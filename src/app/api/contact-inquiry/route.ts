import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function reply(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return reply({ error: "Invalid origin." }, 403);

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!apiKey || !recipient || !sender || !turnstileSecret) {
    return reply({ error: "Online contact form is unavailable. Please email us directly." }, 503);
  }

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (body.website || name.length < 2 || name.length > 90 || !emailPattern.test(email) || email.length > 254 ||
      subject.length < 3 || subject.length > 140 || message.length < 10 || message.length > 5000 ||
      typeof body.turnstileToken !== "string" || body.turnstileToken.length < 1) {
    return reply({ error: "Please check your submission and try again." }, 400);
  }

  const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: turnstileSecret, response: body.turnstileToken }),
    cache: "no-store",
  }).then(r => r.json()).catch(() => ({ success: false }));
  if (!verification.success) return reply({ error: "Verification failed. Please refresh and try again." }, 403);

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `Portfolio inquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      reply_to: email,
    }),
    cache: "no-store",
  });
  if (!result.ok) return reply({ error: "Unable to send. Please use direct email." }, 502);
  return reply({ ok: true }, 200);
}

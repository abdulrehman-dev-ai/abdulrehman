"use client";

import { useEffect, useState } from "react";

declare global { interface Window {
  turnstile?: { render: (selector: string, config: { sitekey: string; callback: (token: string) => void }) => void };
} }

export default function ContactInquiry({ siteKey, email }: { siteKey?: string; email: string }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) return;
    const tag = document.createElement("script");
    tag.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    tag.async = true;
    tag.onload = () => {
      if (window.turnstile) {
        window.turnstile.render("#portfolio-turnstile", { sitekey: siteKey, callback: setToken });
        setReady(true);
      }
    };
    document.head.appendChild(tag);
    return () => { tag.remove(); };
  }, [siteKey]);

  if (!siteKey) return <p>For project inquiries, contact <a href={`mailto:${email}`}>{email}</a>.</p>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!token || loading) return;
    setLoading(true); setFeedback("");
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      const response = await fetch("/api/contact-inquiry", { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"), email: values.get("email"), subject: values.get("subject"),
          message: values.get("message"), website: values.get("website"), turnstileToken: token,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send.");
      form.reset(); setFeedback("Thank you — your message has been sent.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to send. Please email directly.");
    } finally { setLoading(false); }
  }

  return <form onSubmit={submit} style={{ display: "grid", gap: 16, maxWidth: 650 }}>
    <label>Full name<input name="name" minLength={2} maxLength={90} required style={field} /></label>
    <label>Email<input name="email" type="email" required style={field} /></label>
    <label>Subject<input name="subject" minLength={3} maxLength={140} required style={field} /></label>
    <label>Project details<textarea name="message" minLength={10} maxLength={5000} required rows={6} style={field} /></label>
    <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div id="portfolio-turnstile" />
    <button type="submit" disabled={!ready || !token || loading}>{loading ? "Sending…" : "Send inquiry"}</button>
    {feedback && <p role="status">{feedback}</p>}
    <small>Alternatively, email <a href={`mailto:${email}`}>{email}</a>.</small>
  </form>;
}
const field: React.CSSProperties = {
  display: "block", width: "100%", padding: 12, marginTop: 6,
  border: "1px solid #6b7280", borderRadius: 10, background: "transparent", color: "inherit",
};

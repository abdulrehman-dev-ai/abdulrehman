"use client";
import { useEffect, useState } from "react";

declare global { interface Window {
  turnstile?: { render: (selector: string, config: { sitekey: string; callback: (token: string) => void }) => void };
} }

const field: React.CSSProperties = { width: "100%", background: "transparent", color: "inherit", padding: 12, borderRadius: 9, border: "1px solid #777", marginTop: 6 };
export default function ReviewSubmission({ siteKey }: { siteKey?: string }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!siteKey) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => window.turnstile?.render("#review-turnstile", { sitekey: siteKey, callback: setToken });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [siteKey]);
  if (!siteKey) return null;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!token || sending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setSending(true); setStatus("");
    try {
      const response = await fetch("/api/reviews", { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: values.get("author"), project: values.get("project"), rating: Number(values.get("rating")),
          content: values.get("content"), website: values.get("website"), turnstileToken: token,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Review submission failed");
      form.reset(); setStatus("Thank you. Your review is awaiting moderation.");
    } catch (e) { setStatus(e instanceof Error ? e.message : "Submission failed"); }
    finally { setSending(false); }
  }
  return <form onSubmit={submit} style={{ display: "grid", gap: 16, maxWidth: 620, marginTop: 40 }}>
    <h2>Share your experience</h2>
    <label>Your name<input name="author" style={field} minLength={2} maxLength={80} required /></label>
    <label>Project or service<input name="project" style={field} minLength={2} maxLength={100} required /></label>
    <label>Rating<select name="rating" style={field} defaultValue="5">
      {[5,4,3,2,1].map(n => <option value={n} key={n}>{n} / 5</option>)}
    </select></label>
    <label>Your review<textarea name="content" style={field} minLength={20} maxLength={1500} rows={5} required /></label>
    <div hidden><input name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" /></div>
    <div id="review-turnstile" />
    <button disabled={!token || sending} type="submit">{sending ? "Submitting..." : "Submit review"}</button>
    {status && <p role="status">{status}</p>}
  </form>;
}

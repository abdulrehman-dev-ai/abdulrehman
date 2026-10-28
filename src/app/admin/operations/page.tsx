"use client";
import { useEffect, useState } from "react";
type Order = { id: string; service_title: string; customer_name: string; customer_email: string; amount: number; currency: string; status: string; created_at: string };
type Review = { id: string; author: string; project: string; rating: number; content: string; status: string };
export default function AdminOperations() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    const [o, r] = await Promise.all([fetch("/api/admin/orders"), fetch("/api/admin/reviews")]);
    const [od, rd] = await Promise.all([o.json(), r.json()]);
    if (!o.ok || !r.ok) { setError(od.error || rd.error || "Unable to load data"); return; }
    setOrders(od.orders || []); setReviews(rd.reviews || []); setError("");
  }
  useEffect(() => { void load().catch(() => setError("Unable to load dashboard")); }, []);
  async function moderate(id: string, status: string) {
    setBusy(true);
    const r = await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }) });
    if (!r.ok) setError("Unable to update review");
    await load(); setBusy(false);
  }
  async function updateOrder(id: string, status: string) {
    setBusy(true);
    const r = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }) });
    if (!r.ok) setError("Unable to update order");
    await load(); setBusy(false);
  }
  return <main style={{ maxWidth: 1100, margin: "3rem auto", padding: 24 }}>
    <h1>Orders & Review Moderation</h1>
    <p><a href="/admin">Content management</a> · Payment verification and settlement are disabled pending gateway integration.</p>
    {error && <p role="alert">{error}</p>}
    <h2>Recent Orders</h2>
    <div style={{ display: "grid", gap: 14 }}>
      {orders.map(o => <article key={o.id} style={{ border: "1px solid #777", borderRadius: 10, padding: 18 }}>
        <strong>{o.service_title}</strong><p>{o.customer_name} · {o.customer_email}</p>
        <p>{o.currency} {o.amount} · {o.status} · {o.id}</p>
        {["pending_bank_transfer", "cancelled"].includes(o.status) &&
          <button disabled={busy} onClick={() => void updateOrder(o.id, o.status === "cancelled" ? "pending_bank_transfer" : "cancelled")}>
            {o.status === "cancelled" ? "Restore pending" : "Cancel order"}
          </button>}
      </article>)}
      {orders.length === 0 && <p>No orders available.</p>}
    </div>
    <h2 style={{ marginTop: 36 }}>Review Moderation</h2>
    <div style={{ display: "grid", gap: 14 }}>
      {reviews.map(r => <article key={r.id} style={{ border: "1px solid #777", borderRadius: 10, padding: 18 }}>
        <strong>{r.project} · {r.rating}/5</strong><p>{r.content}</p><p>{r.author} · {r.status}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button disabled={busy} onClick={() => void moderate(r.id, "approved")}>Approve</button>
          <button disabled={busy} onClick={() => void moderate(r.id, "rejected")}>Reject</button>
        </div>
      </article>)}
      {reviews.length === 0 && <p>No reviews available.</p>}
    </div>
  </main>;
}

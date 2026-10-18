import type { Metadata } from "next";
import { d1Query } from "@/lib/d1-rest";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Client Reviews", description: "Moderated reviews of completed projects." };
type Review = { id: string; author: string; project: string; rating: number; content: string };
export default async function ReviewsPage() {
  let reviews: Review[] = [];
  try {
    reviews = await d1Query(
      "SELECT id, author, project, rating, content FROM reviews WHERE status='approved' ORDER BY created_at DESC LIMIT 30",
    ) as Review[];
  } catch { /* Database integration can be provisioned later. */ }
  return <main style={{ maxWidth: 950, margin: "3rem auto", padding: "1.5rem" }}>
    <h1 style={{ fontSize: "2.5rem" }}>Client Reviews</h1>
    <p>Feedback from completed engagements, published after moderation.</p>
    {reviews.length === 0 ? <p>No approved reviews are available yet.</p> : <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
      {reviews.map(r => <article key={r.id} style={{ border: "1px solid #6b7280", borderRadius: 14, padding: 24 }}>
        <h2>{r.project}</h2>
        <p aria-label={`${r.rating} out of 5 stars`}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</p>
        <blockquote>{r.content}</blockquote>
        <p>— {r.author}</p>
      </article>)}
    </div>}
  </main>;
}

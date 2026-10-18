"use client";

import { useEffect, useState } from "react";

type Item = { name: string; path: string };
type ContentType = "projects" | "blogs";
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #6b7280", borderRadius: 9,
  padding: 12, color: "inherit", background: "transparent", margin: "8px 0 18px",
};
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [type, setType] = useState<ContentType>("projects");
  const [items, setItems] = useState<Item[]>([]);
  const [slug, setSlug] = useState("");
  const [document, setDocument] = useState("---\ntitle: \"\"\npublishedAt: \"2026-10-18\"\nsummary: \"\"\nimages: []\n---\n\n## Overview\n");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(category = type) {
    const response = await fetch(`/api/admin/content?type=${category}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Unable to load"); return; }
    setItems(Array.isArray(data) ? data.filter((x: Item) => x.name?.endsWith(".mdx")) : []);
  }
  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" }).then(r => r.json())
      .then(d => setAuthenticated(!!d.authenticated)).catch(() => {});
  }, []);
  useEffect(() => { if (authenticated) void load(type); }, [authenticated, type]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const r = await fetch("/api/admin/session", { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Login failed");
      setAuthenticated(true); setPassword("");
    } catch(e) { setNotice(e instanceof Error ? e.message : "Login failed"); }
    finally { setBusy(false); }
  }
  async function selectItem(name: string) {
    const selected = name.replace(/\.mdx$/, ""); setBusy(true); setNotice("");
    try {
      const r = await fetch(`/api/admin/content?type=${type}&slug=${selected}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not read document");
      setSlug(selected); setDocument(decodeURIComponent(escape(atob(data.content.replace(/\s/g, "")))));
    } catch(e) { setNotice(e instanceof Error ? e.message : "Read failed"); }
    finally { setBusy(false); }
  }
  async function save() {
    setBusy(true); setNotice("");
    try {
      const r = await fetch("/api/admin/content", { method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug, content: document }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || data.error || "Save failed");
      setNotice("Saved to GitHub successfully."); await load();
    } catch(e) { setNotice(e instanceof Error ? e.message : "Save failed"); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!slug || !window.confirm(`Delete ${slug}? This will commit a deletion to GitHub.`)) return;
    setBusy(true); setNotice("");
    try {
      const r = await fetch("/api/admin/content", { method: "DELETE",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, slug }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || d.error || "Delete failed");
      setSlug(""); setNotice("Deleted from GitHub."); await load();
    } catch(e) { setNotice(e instanceof Error ? e.message : "Delete failed"); }
    finally { setBusy(false); }
  }

  return <main style={{ maxWidth: 1040, margin: "4rem auto", padding: "1.5rem" }}>
    <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>Portfolio Administration</h1>
    {!authenticated ? <form onSubmit={signIn} style={{ maxWidth: 420 }}>
      <label htmlFor="admin-password">Admin password</label>
      <input id="admin-password" style={inputStyle} type="password" value={password}
        onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
      <button type="submit" disabled={busy}>Sign in</button>
    </form> : <>
      <p>Manage project case studies and blog posts stored in GitHub. Changes are versioned commits.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "16px 0" }}>
        <select aria-label="Content type" value={type} style={{ ...inputStyle, width: 180, margin: 0 }}
          onChange={e => { setType(e.target.value as ContentType); setSlug(""); }}>
          <option value="projects">Projects</option><option value="blogs">Blogs</option>
        </select>
        <button onClick={() => { setSlug(""); setDocument("---\ntitle: \"\"\npublishedAt: \"2026-10-18\"\nsummary: \"\"\nimages: []\n---\n\n"); }}>New entry</button>
        <button onClick={async () => { await fetch("/api/admin/session", { method: "DELETE" }); setAuthenticated(false); }}>Sign out</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1fr) minmax(0, 3fr)", gap: 24 }}>
        <nav aria-label="Content entries" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map(item => <button key={item.path} disabled={busy} onClick={() => void selectItem(item.name)}
            style={{ textAlign: "left", overflowWrap: "anywhere" }}>{item.name}</button>)}
        </nav>
        <section>
          <label htmlFor="content-slug">Slug (lowercase letters, numbers, hyphens)</label>
          <input id="content-slug" style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} />
          <label htmlFor="content-body">MDX content</label>
          <textarea id="content-body" style={{ ...inputStyle, minHeight: 450, fontFamily: "monospace", resize: "vertical" }}
            value={document} onChange={e => setDocument(e.target.value)} />
          <div style={{ display: "flex", gap: 12 }}>
            <button disabled={busy || !slug} onClick={() => void save()}>Save to GitHub</button>
            <button disabled={busy || !slug} onClick={() => void remove()}>Delete</button>
          </div>
        </section>
      </div>
    </>}
    {notice && <p role="status" style={{ marginTop: 20 }}>{notice}</p>}
  </main>;
}

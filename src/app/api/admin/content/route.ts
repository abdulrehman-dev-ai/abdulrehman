import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
const REPO = "abdulrehman-dev-ai/abdulrehman";
const PATHS = { projects: "src/app/work/projects", blogs: "src/app/blog/posts" } as const;

function makePath(type: string, slug: string) {
  if (!(type in PATHS) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 90) return null;
  return `${PATHS[type as keyof typeof PATHS]}/${slug}.mdx`;
}

async function github(path: string, options: RequestInit = {}) {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) return { status: 503, body: { error: "GITHUB_CONTENT_TOKEN is not configured" } };
  const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(process.env.GITHUB_CONTENT_BRANCH || "main")}`, {
    ...options,
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}
function output(result: { status: number; body: unknown }) {
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
function authorizedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !!origin && origin === request.nextUrl.origin;
}
export async function GET(request: NextRequest) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const type = request.nextUrl.searchParams.get("type") || "";
  const slug = request.nextUrl.searchParams.get("slug");
  if (!(type in PATHS)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  const path = slug ? makePath(type, slug) : PATHS[type as keyof typeof PATHS];
  if (!path) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  return output(await github(path));
}
export async function PUT(request: NextRequest) {
  if (!authorizedOrigin(request) || !await isAdminAuthenticated()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const path = makePath(body.type, body.slug);
  if (!path || typeof body.content !== "string" || body.content.length > 150000 || !body.content.startsWith("---\n")) {
    return NextResponse.json({ error: "Invalid document" }, { status: 400 });
  }
  const current = await github(path);
  if (current.status !== 200 && current.status !== 404) return output(current);
  const sha = current.status === 200 && typeof (current.body as { sha?: unknown }).sha === "string"
    ? (current.body as { sha: string }).sha : undefined;
  return output(await github(path, {
    method: "PUT",
    body: JSON.stringify({
      message: `content: admin update ${body.type}/${body.slug}`,
      content: Buffer.from(body.content, "utf8").toString("base64"),
      branch: process.env.GITHUB_CONTENT_BRANCH || "main", ...(sha ? { sha } : {}),
    }),
  }));
}
export async function DELETE(request: NextRequest) {
  if (!authorizedOrigin(request) || !await isAdminAuthenticated()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const path = makePath(body.type, body.slug);
  if (!path) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  const current = await github(path);
  if (current.status !== 200) return output(current);
  const sha = (current.body as { sha?: string }).sha;
  return output(await github(path, { method: "DELETE",
    body: JSON.stringify({ message: `content: admin delete ${body.type}/${body.slug}`,
      sha, branch: process.env.GITHUB_CONTENT_BRANCH || "main" }) }));
}

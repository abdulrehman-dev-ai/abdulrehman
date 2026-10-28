import assert from "node:assert/strict";

const origin = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3100";
const pages = [
  ["/", ["href=\"/work\"", "href=\"/contact\""]],
  ["/work", ["ocean-yacht-registration"]],
  ["/work/ocean-yacht-registration", ["Ocean Yacht", "Discuss a similar project"]],
  ["/services", ["Build", "Secure", "full-stack-web-development"]],
  ["/services/full-stack-web-development", ["Request a quote", "contact?service=full-stack-web-development"]],
  ["/about", ["Abdul Rehman"]],
  ["/blog", ["registration-platform-lessons"]],
  ["/blog/registration-platform-lessons", ["Registration Platform"]],
  ["/contact", ["START WITH A CLEAR BRIEF", "href=\"/work\""]],
  ["/privacy-policy", ["Privacy"]],
  ["/terms", ["Terms"]],
  ["/refund-policy", ["Refund"]],
  ["/service-policy", ["Service"]],
  ["/order/success", ["Online checkout is temporarily unavailable"]],
  ["/order/failed", ["Online checkout is temporarily unavailable"]],
  ["/secure-access", ["Restricted content", "Request access"]],
];
const failures = [];
const links = new Set();

async function pageCheck([path, markers]) {
  let response;
  try { response = await fetch(new URL(path, origin), { redirect: "follow" }); }
  catch (error) { failures.push(`${path}: request failed — ${String(error)}`); return; }
  if (!response.ok) { failures.push(`${path}: HTTP ${response.status}`); return; }
  const html = await response.text();
  for (const marker of markers) {
    if (!html.includes(marker)) failures.push(`${path}: expected content missing: ${marker}`);
  }
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const pathname = new URL(href, origin).pathname;
    if (!pathname.startsWith("/_next/") && pathname !== "/og") links.add(pathname);
  }
  console.log(`✓ ${path} (HTTP ${response.status})`);
}

await Promise.all(pages.map(pageCheck));

for (const pathname of links) {
  if (pages.some(([path]) => path === pathname)) continue;
  try {
    const res = await fetch(new URL(pathname, origin), { redirect: "follow" });
    if (!res.ok) failures.push(`Internal link ${pathname}: HTTP ${res.status}`);
  } catch (error) {
    failures.push(`Internal link ${pathname}: ${String(error)}`);
  }
}

for (const [path, method, expected] of [
  ["/api/orders", "POST", 503],
  ["/api/payfast/checkout", "POST", 503],
  ["/api/payfast/callback", "POST", 503],
  ["/api/payfast/callback", "GET", 405],
]) {
  const res = await fetch(new URL(path, origin), { method });
  if (res.status !== expected) failures.push(`${method} ${path}: HTTP ${res.status} instead of ${expected}`);
}

console.log(`Checked ${pages.length} pages, ${links.size} internal navigation destinations and payment safeguards.`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All link and routing smoke checks passed.");
}

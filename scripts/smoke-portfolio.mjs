import assert from "node:assert/strict";

const origin = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3100";
const pages = [
  ["/", ["href=\"/work\"", "href=\"/contact\""]],
  ["/work", ["ocean-yacht-registration", "/work/anyarabic"]],
  ["/work/ocean-yacht-registration", ["Ocean Yacht", "Discuss a similar project"]],
  ["/work/anyarabic", ["AnyArabic", "Fiverr", "Vultr VPS", "Cloudflare"]],
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


const inquiryEndpoint = new URL("/api/inquiries", origin);
const sampleInquiry = {
  kind: "Cloud migration / DevOps",
  budget: "Let's discuss",
  sender: "client@example.com",
  goal: "Migrate the existing website safely",
  details: "Please assess the hosting setup.",
  service: "cloud-migration",
  website: "",
};
for (const [testName, options, expected] of [
  ["no JSON content-type", { method: "POST" }, 415],
  ["malformed JSON", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }, 400],
  ["invalid fields", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...sampleInquiry, sender: "invalid" }) }, 400],
  ["cross-origin rejection", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://not-our-site.example" }, body: JSON.stringify(sampleInquiry) }, 403],
  ["honeypot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...sampleInquiry, website: "bot.example" }) }, 202],
  ["email provider not configured", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sampleInquiry) }, 503],
]) {
  try {
    const res = await fetch(inquiryEndpoint, options);
    if (res.status !== expected) failures.push("Inquiry API " + testName + ": HTTP " + res.status + " instead of " + expected);
  } catch (error) {
    failures.push("Inquiry API " + testName + ": " + String(error));
  }
}
console.log("Checked inquiry validation, honeypot, origin safeguards and missing provider configuration.");

console.log(`Checked ${pages.length} pages, ${links.size} internal navigation destinations and payment safeguards.`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All link and routing smoke checks passed.");
}

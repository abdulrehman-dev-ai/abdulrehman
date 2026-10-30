// Read-only production D1 inventory: no migrations or data changes.
import { readFileSync } from "node:fs";
const cfg=JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url),"utf8"));
const prod=cfg.d1_databases?.[0],preview=cfg.previews?.d1_databases?.[0];
const id="d24afa50-9b82-4b50-86b3-dc538396026b";
if(prod?.database_id!==id || prod?.database_name!=="abdul-portfolio-production" || preview?.database_id===id) throw Error("Production D1 isolation failed");
const token=process.env.CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID;
if(!token || !/^[0-9a-f]{32}$/i.test(account||"")) throw Error("Missing Cloudflare account credentials");
const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${id}/query`,{
  method:"POST",headers:{"Authorization":`Bearer ${token}`,"content-type":"application/json"},
  body:JSON.stringify({sql:"SELECT name FROM sqlite_master WHERE type='table' AND name IN ('inquiries','email_outbox','rate_limit_buckets','d1_migrations')"}),
  signal:AbortSignal.timeout(20000)
});
if(!response.ok)throw Error("Production D1 read-only inspection HTTP "+response.status);
const body=await response.json();
if(!body.success || !Array.isArray(body.result))throw Error("Production D1 inspection rejected");
const found=body.result.flatMap(x=>x.results||[]).map(x=>x.name);
console.log("Production D1 exists and is independently accessible. Tables present: "+(found.join(", ")||"(none)"));
console.log("No production migrations or Worker changes performed.");

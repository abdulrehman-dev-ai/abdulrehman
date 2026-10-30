import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
if(process.env.GITHUB_REF!=="refs/heads/staging" || process.env.PRODUCTION_D1_APPROVED!=="yes")
 throw Error("Production schema operation requires approved staging automation");
const cfg=JSON.parse(readFileSync(resolve(root,"wrangler.production-migrations.jsonc"),"utf8"));
const runtime=JSON.parse(readFileSync(resolve(root,"wrangler.jsonc"),"utf8"));
const id="d24afa50-9b82-4b50-86b3-dc538396026b";
const staging="863b6d6f-3197-4f34-b24d-2c43d0e0c4e4";
if(cfg.d1_databases?.length!==1 || cfg.d1_databases[0].database_id!==id ||
 cfg.d1_databases[0].database_name!=="abdul-portfolio-production" ||
 runtime.d1_databases?.[0]?.database_id!==id ||
 runtime.previews?.d1_databases?.[0]?.database_id!==staging ||
 id===staging)throw Error("Unsafe production migration target");
const args=["--yes","wrangler@4.156.0","d1","migrations","apply","abdul-portfolio-production","--remote","--config","wrangler.production-migrations.jsonc"];
const result=spawnSync("npx",args,{cwd:root,stdio:"inherit",timeout:180000});
if(result.error)throw result.error;
if(result.status!==0)throw Error("Production migration failed");
console.log("Approved production schema migration applied (or already current).");

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(resolve(root, "wrangler.jsonc"), "utf8"));
const stagingId = "863b6d6f-3197-4f34-b24d-2c43d0e0c4e4";
const preview = cfg.previews?.d1_databases || [];
const production = cfg.d1_databases || [];
if (preview.length !== 1 || preview[0].database_id !== stagingId ||
    preview[0].database_name !== "abdul-portfolio-staging") {
  throw new Error("Preview D1 must use only approved staging database.");
}
if (production.length > 1) throw new Error("Unexpected multiple production D1 bindings.");
if (production.some(x => x.database_id === stagingId || x.database_name === "abdul-portfolio-staging")) {
  throw new Error("Production D1 points to staging: deployment blocked.");
}
if (production.length === 1 && (!production[0].database_id || production[0].database_name !== "abdul-portfolio-production" || production[0].database_id !== "d24afa50-9b82-4b50-86b3-dc538396026b" || production[0].binding !== "DB")) {
  throw new Error("Production D1 binding does not match isolated production naming.");
}
console.log(production.length ? "Production and staging D1 bindings isolated." : "Production D1 not yet configured; staging remains isolated.");

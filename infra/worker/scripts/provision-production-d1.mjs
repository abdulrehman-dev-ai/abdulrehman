// One-time approved provisioning: create an EMPTY production D1 database.
// No migrations, bindings, SQL mutations, or Worker deployment.
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token || !/^[a-f0-9]{32}$/i.test(account || "")) throw Error("Missing Cloudflare credentials");
const name = "abdul-portfolio-production";
const base = `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database`;
const auth = { Authorization: `Bearer ${token}` };
const get = await fetch(base + "?per_page=100", {headers:auth,signal:AbortSignal.timeout(20000)});
if(!get.ok) throw Error("Unable to check existing databases: HTTP "+get.status);
const existing = await get.json();
if (!existing.success || !Array.isArray(existing.result)) throw Error("Could not verify database list");
const matches = existing.result.filter(db=>db.name===name);
if(matches.length>1) throw Error("Ambiguous production D1 database name");
if(matches.length===1){
  if(!/^[\da-f]{8}-[\da-f-]{27,}$/i.test(matches[0].uuid)) throw Error("Existing database missing valid ID");
  console.log("Production D1 database already exists. UUID: "+matches[0].uuid);
}else{
  const create = await fetch(base,{method:"POST",headers:{...auth,"content-type":"application/json"},body:JSON.stringify({name,read_replication:{mode:"disabled"}}),signal:AbortSignal.timeout(20000)});
  const result=await create.json();
  if(!create.ok || !result.success || result.result?.name!==name || !result.result?.uuid) throw Error("Production D1 creation failed: HTTP "+create.status);
  console.log("Created empty production D1 database. UUID: "+result.result.uuid);
}
console.log("No schema migrations or Worker bindings changed.");

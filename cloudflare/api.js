import { InputError,digest,equal,passwordHash,session,isAdmin,sameOrigin,readJSON,field,email,rateLimit,safeURL } from './security.js';
import { mailStatement,flushEmail } from './email.js';
export const json=(body,status=200,headers={})=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...headers}});
const kinds=['projects','posts','services','testimonials'];
const states=['requested','accepted','awaiting_payment','paid','in_progress','completed','cancelled','refunded'];
const transitions={requested:['accepted','cancelled'],accepted:['awaiting_payment','in_progress','cancelled'],awaiting_payment:['paid','cancelled'],paid:['in_progress','refunded'],in_progress:['completed','cancelled','refunded'],completed:['refunded'],cancelled:[],refunded:[]};
const audit=(env,action,target)=>env.DB.prepare('INSERT INTO audit(id,action,target) VALUES (?,?,?)').bind(crypto.randomUUID(),action,target);
async function profile(env){const row=await env.DB.prepare("SELECT data FROM settings WHERE id='profile'").first();return JSON.parse(row?.data||'{}');}
function contentInput(b){
 if(!kinds.includes(b.kind))throw new InputError('Unknown content type.');
 const slug=field(b.slug,'Slug',100);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new InputError('Use lowercase words separated by hyphens.');
 if(!['draft','published'].includes(b.status))throw new InputError('Invalid publication status.');
 const data={};for(const key of ['stage','stack','category','author'])if(b.data?.[key])data[key]=field(b.data[key],key,180);
 for(const key of ['url','image'])if(b.data?.[key]){data[key]=safeURL(b.data[key]);if(!data[key])throw new InputError('Use a valid image or source URL.');}
 if(b.kind==='services'){const price=Number(b.data?.price);if(!Number.isSafeInteger(price)||price<1||price>100000000)throw new InputError('Enter a valid PKR price.');data.price=price;data.currency='PKR';}
 if(b.kind==='testimonials'){data.rating=Number(b.data?.rating);if(!Number.isInteger(data.rating)||data.rating<1||data.rating>5)throw new InputError('Select a rating from 1 to 5.');if(!data.author||!data.url)throw new InputError('Testimonials require an author and original source link.');if(b.status==='published'&&b.permission!==true)throw new InputError('Confirm permission to republish this testimonial.');data.permission=b.permission===true;}
 return {kind:b.kind,slug,title:field(b.title,'Title',160),summary:field(b.summary||'','Summary',500,0),body:field(b.body||'','Body',24000,0),status:b.status,data:JSON.stringify(data)};
}
export async function api(ctx,path){const {request,env}=ctx;const method=request.method;
 if(method!=='GET'&&!sameOrigin(request))return json({error:'Request origin rejected.'},403);
 if(!env.DB)return json({error:'This feature is not configured yet.'},503);
 const admin=await isAdmin(request,env);
 if(path==='/api/session'&&method==='GET')return json({authenticated:admin});
 if(path==='/api/login'&&method==='POST'){
  if(!env.ADMIN_PASSWORD_HASH||!env.ADMIN_PASSWORD_SALT||!env.SESSION_SECRET||env.SESSION_SECRET.length<32)return json({error:'Admin login has not been configured.'},503);
  if(!await rateLimit(request,env,'login',5))return json({error:'Too many attempts. Try again in 15 minutes.'},429);
  const b=await readJSON(request);const pwd=field(b.password,'Password',200);if(!equal(await passwordHash(pwd,env.ADMIN_PASSWORD_SALT),env.ADMIN_PASSWORD_HASH))return json({error:'Invalid credentials.'},401);
  return json({ok:true},200,{'Set-Cookie':`portfolio_session=${await session(env)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`});
 }
 if(path==='/api/logout'&&method==='POST')return json({ok:true},200,{'Set-Cookie':'portfolio_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'});
 if(path==='/api/orders'&&method==='POST'){
  if(env.ORDERS_ENABLED!=='true')return json({error:'Online orders are not open yet. Please use the contact form.'},503);
  if(!env.ADMIN_EMAIL)return json({error:'Orders are temporarily unavailable.'},503);
  if(!await rateLimit(request,env,'orders',5))return json({error:'Please wait before submitting another order.'},429);
  const b=await readJSON(request);if(b.website)return json({error:'Submission rejected.'},400);
  const name=field(b.name,'Name',120),address=email(b.email),notes=field(b.notes,'Requirements',5000,20),key=field(b.requestKey,'Request key',80);
  if(!/^[a-zA-Z0-9-]{20,80}$/.test(key))throw new InputError('Invalid request key.');
  const service=await env.DB.prepare("SELECT * FROM content WHERE id=? AND kind='services' AND status='published'").bind(field(b.serviceId,'Service',100)).first();if(!service)return json({error:'Service unavailable.'},404);
  const existing=await env.DB.prepare('SELECT id FROM orders WHERE request_key=?').bind(key).first();if(existing)return json({ok:true,id:existing.id});
  const amount=JSON.parse(service.data).price;if(!Number.isSafeInteger(amount)||amount<=0)throw new InputError('Service price unavailable.');
  const id=`AR-${crypto.randomUUID().toUpperCase()}`;
  await env.DB.batch([env.DB.prepare('INSERT INTO orders(id,customer_name,email,service_id,service_title,amount,notes,request_key) VALUES (?,?,?,?,?,?,?,?)').bind(id,name,address,service.id,service.title,amount,notes,key),mailStatement(env,address,`Order request ${id}`,`Hello ${name},\n\nYour request for ${service.title} has been received.\nReference: ${id}\nStarting price: PKR ${amount.toLocaleString('en-PK')}\n\nThis is a request, not a payment confirmation. Scope, final price and delivery date will be agreed before work begins.\n\nAbdul Rehman`),mailStatement(env,env.ADMIN_EMAIL,`New order request ${id}`,`${name}\n${address}\n${service.title}\nStarting price PKR ${amount}\n\n${notes}\n\nReview this request in your admin dashboard.`)]);
  ctx.waitUntil(flushEmail(env));return json({ok:true,id},201);
 }
 if(path==='/api/contact'&&method==='POST'){
  if(!env.ADMIN_EMAIL)return json({error:'Contact delivery is not configured yet.'},503);
  if(!await rateLimit(request,env,'contact',5))return json({error:'Please try again later.'},429);
  const b=await readJSON(request);if(b.website)return json({error:'Submission rejected.'},400);
  const name=field(b.name,'Name',120),address=email(b.email),message=field(b.message,'Message',5000,20),id=crypto.randomUUID();
  await env.DB.batch([env.DB.prepare('INSERT INTO messages(id,name,email,message) VALUES (?,?,?,?)').bind(id,name,address,message),mailStatement(env,env.ADMIN_EMAIL,'New portfolio enquiry',`${name}\n${address}\n\n${message}`)]);ctx.waitUntil(flushEmail(env));return json({ok:true},201);
 }
 if(path==='/api/reviews'&&method==='POST'){
  if(!await rateLimit(request,env,'reviews',5))return json({error:'Please try again later.'},429);
  const b=await readJSON(request),token=field(b.token,'Review invitation',150),name=field(b.name,'Public name',120),body=field(b.body,'Review',2000,20),rating=Number(b.rating);
  if(!Number.isInteger(rating)||rating<1||rating>5)throw new InputError('Select a rating from 1 to 5.');
  const hash=await digest(token),now=Date.now();const order=await env.DB.prepare("SELECT id FROM orders WHERE review_hash=? AND review_expires>? AND status='completed'").bind(hash,now).first();if(!order)return json({error:'This review invitation is invalid or expired.'},400);
  const result=await env.DB.prepare("INSERT INTO reviews(id,order_id,name,rating,body) SELECT ?,id,?,?,? FROM orders WHERE id=? AND status='completed' AND review_hash=? AND review_expires>? ON CONFLICT(order_id) DO NOTHING").bind(crypto.randomUUID(),name,rating,body,order.id,hash,now).run();
  if(!result.meta.changes)return json({error:'A review has already been submitted or the invitation is no longer valid.'},409);
  return json({ok:true},201);
 }
 if(!path.startsWith('/api/admin/'))return json({error:'Not found.'},404);
 if(!admin)return json({error:'Sign in to continue.'},401);
 if(path==='/api/admin/data'&&method==='GET'){
  const queries=['SELECT * FROM content ORDER BY updated_at DESC','SELECT * FROM orders ORDER BY created_at DESC LIMIT 200','SELECT * FROM messages ORDER BY created_at DESC LIMIT 200','SELECT * FROM reviews ORDER BY created_at DESC LIMIT 200','SELECT id,recipient,subject,status,attempts,last_error,created_at FROM outbox ORDER BY created_at DESC LIMIT 100','SELECT * FROM audit ORDER BY created_at DESC LIMIT 100'];
  const results=await env.DB.batch(queries.map(q=>env.DB.prepare(q)));return json({content:results[0].results,orders:results[1].results,messages:results[2].results,reviews:results[3].results,outbox:results[4].results,audit:results[5].results,profile:await profile(env),configured:{orders:env.ORDERS_ENABLED==='true',email:!!(env.RESEND_API_KEY&&(env.EMAIL_MODE==='live'?env.EMAIL_FROM:env.EMAIL_MODE==='test'?env.TEST_EMAIL:false)),emailMode:env.EMAIL_MODE||'disabled',site:env.SITE_URL||null}});
 }
 if(path==='/api/admin/content'&&['POST','PUT','DELETE'].includes(method)){
  const b=await readJSON(request),id=method==='POST'?crypto.randomUUID():field(b.id,'Record',100);
  if(method==='DELETE'){await env.DB.batch([env.DB.prepare('DELETE FROM content WHERE id=?').bind(id),audit(env,'delete content',id)]);return json({ok:true});}
  const c=contentInput(b);
  const stmt=method==='POST'?env.DB.prepare('INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES (?,?,?,?,?,?,?,?)').bind(id,c.kind,c.slug,c.title,c.summary,c.body,c.status,c.data):env.DB.prepare('UPDATE content SET kind=?,slug=?,title=?,summary=?,body=?,status=?,data=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(c.kind,c.slug,c.title,c.summary,c.body,c.status,c.data,id);
  await env.DB.batch([stmt,audit(env,`${method} content`,id)]);return json({ok:true,id});
 }
 if(path==='/api/admin/profile'&&method==='PUT'){
  const b=await readJSON(request),data={};for(const key of ['name','role','headline','intro','email','location','availability','payment_instructions'])data[key]=field(b[key]||'',key,key==='payment_instructions'?2000:600,0);
  email(data.email);for(const key of ['fiverr','github','linkedin']){data[key]=safeURL(b[key]||'');if(b[key]&&!data[key])throw new InputError('Invalid social URL.');}
  await env.DB.batch([env.DB.prepare("UPDATE settings SET data=?,updated_at=CURRENT_TIMESTAMP WHERE id='profile'").bind(JSON.stringify(data)),audit(env,'update profile','profile')]);return json({ok:true});
 }
 if(path==='/api/admin/order'&&method==='PUT'){
  const b=await readJSON(request),id=field(b.id,'Order',100);if(!states.includes(b.status))throw new InputError('Invalid status.');const o=await env.DB.prepare('SELECT * FROM orders WHERE id=?').bind(id).first();if(!o)return json({error:'Order not found.'},404);
  if(!transitions[o.status]?.includes(b.status))throw new InputError(`Cannot change ${o.status} to ${b.status}.`);
  if(['paid','refunded'].includes(b.status)&&b.confirmed!==true)throw new InputError('Confirm that the bank transaction was verified.');
  const token=b.status==='completed'?`${crypto.randomUUID()}${crypto.randomUUID()}`:null;
  if(token&&!env.SITE_URL)throw new InputError('Configure SITE_URL before sending review invitations.');
  const p=await profile(env);let body=`Hello ${o.customer_name},\n\nYour order ${id} is now ${b.status.replaceAll('_',' ')}.\nService: ${o.service_title}\n`;
  if(b.status==='awaiting_payment')body+=`\n${p.payment_instructions||'Please reply to agree payment details with Abdul before sending funds.'}\n`;
  if(token)body+=`\nYou can share an honest review here within 30 days:\n${env.SITE_URL.replace(/\/$/,'')}/review#${token}\nReviews are moderated before publication.\n`;
  const eventId=crypto.randomUUID();
  const result=await env.DB.batch([
   env.DB.prepare('UPDATE orders SET status=?,last_event=?,review_hash=?,review_expires=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status=?').bind(b.status,eventId,token?await digest(token):null,token?Date.now()+30*86400000:null,id,o.status),
   env.DB.prepare('INSERT INTO audit(id,action,target) SELECT ?,?,id FROM orders WHERE id=? AND last_event=?').bind(eventId,`order ${o.status} → ${b.status}`,id,eventId),
   env.DB.prepare('INSERT INTO outbox(id,recipient,subject,body) SELECT ?,?,?,? FROM orders WHERE id=? AND last_event=?').bind(eventId,o.email,`Order update: ${id}`,body,id,eventId)
  ]);
  if(!result[0].meta.changes)return json({error:'Order changed. Refresh and try again.'},409);
  ctx.waitUntil(flushEmail(env));return json({ok:true});
 }
 if(path==='/api/admin/review'&&method==='PUT'){const b=await readJSON(request);if(!['published','rejected','pending'].includes(b.status))throw new InputError('Invalid review status.');await env.DB.batch([env.DB.prepare('UPDATE reviews SET status=? WHERE id=?').bind(b.status,field(b.id,'Review',100)),audit(env,`review ${b.status}`,b.id)]);return json({ok:true});}
 if(path==='/api/admin/message'&&method==='PUT'){const b=await readJSON(request);if(!['new','read','archived'].includes(b.status))throw new InputError('Invalid message status.');await env.DB.batch([env.DB.prepare('UPDATE messages SET status=? WHERE id=?').bind(b.status,field(b.id,'Message',100)),audit(env,`message ${b.status}`,b.id)]);return json({ok:true});}
 if(path==='/api/admin/email/retry'&&method==='POST')return json(await flushEmail(env));
 if(path==='/api/admin/maintenance'&&method==='POST'){await env.DB.batch([env.DB.prepare('DELETE FROM rate_limits WHERE expires<?').bind(Math.floor(Date.now()/1000)),env.DB.prepare("DELETE FROM audit WHERE created_at<datetime('now','-90 days')"),audit(env,'maintenance','rate limits and audit')]);return json({ok:true});}
 return json({error:'Not found.'},404);
}

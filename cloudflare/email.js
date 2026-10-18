import { escape } from './security.js';
export function mailStatement(env,to,subject,body,id=crypto.randomUUID()) {return env.DB.prepare('INSERT INTO outbox(id,recipient,subject,body) VALUES (?,?,?,?)').bind(id,to,subject,body);}
export async function flushEmail(env) {
 const mode=env.EMAIL_MODE||'disabled';
 if(!['test','live'].includes(mode))return {sent:0,configured:false,mode:'disabled'};
 if(!env.RESEND_API_KEY||(mode==='live'&&!env.EMAIL_FROM)||(mode==='test'&&!env.TEST_EMAIL))return {sent:0,configured:false,mode};
 const sender=mode==='test'?'Abdul Rehman <onboarding@resend.dev>':env.EMAIL_FROM;
 const {results}=await env.DB.prepare("SELECT * FROM outbox WHERE status='pending' AND attempts<5 AND created_at>datetime('now','-23 hours') ORDER BY created_at LIMIT 5").all();let sent=0;
 for(const msg of results){
  try{
   const recipient=mode==='test'?env.TEST_EMAIL:msg.recipient;
   const subject=mode==='test'?`[TEST] ${msg.subject}`:msg.subject;
   const body=mode==='test'?`TEST DELIVERY — no email was sent to ${msg.recipient}.\n\n${msg.body}`:msg.body;
   const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`${mode}-${msg.id}`},body:JSON.stringify({from:sender,to:[recipient],subject,text:body,html:`<div style="background:#f1f5f7;padding:32px;font-family:Arial,sans-serif;color:#13202b"><div style="max-width:560px;margin:auto;background:white;padding:32px;border-top:4px solid #167365"><h2>Abdul Rehman</h2><p style="color:#52636c">Cloud · Security · Web Applications</p><hr><div style="line-height:1.7;white-space:pre-wrap">${escape(body)}</div><hr><p style="font-size:12px;color:#52636c">Please reply to ${escape(env.ADMIN_EMAIL||env.EMAIL_FROM)} if you need assistance.</p></div></div>`,...(env.ADMIN_EMAIL?{reply_to:env.ADMIN_EMAIL}:{})}),signal:AbortSignal.timeout(8000)});
   if(!response.ok)throw new Error(`Email provider returned ${response.status}`);
   await env.DB.prepare("UPDATE outbox SET status=?,sent_at=CURRENT_TIMESTAMP,attempts=attempts+1,last_error=NULL WHERE id=?").bind(mode==='test'?'test_sent':'sent',msg.id).run();sent++;
  }catch(err){await env.DB.prepare('UPDATE outbox SET attempts=attempts+1,last_error=? WHERE id=?').bind(String(err.message).slice(0,180),msg.id).run();}
 }
 return {sent,configured:true,mode};
}

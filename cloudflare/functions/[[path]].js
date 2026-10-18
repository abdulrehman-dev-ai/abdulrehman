import { InputError } from '../security.js';
import { api,json } from '../api.js';
import { load,render } from '../render.js';
export async function onRequest(ctx){const path=new URL(ctx.request.url).pathname.replace(/\/$/,'')||'/';let response;
 try{
  if(['/secure-access',"/work/auto-mobile-modification-company's-portfolio"].includes(decodeURIComponent(path))){return Response.redirect(new URL(path==='/secure-access'?'/admin':'/work/auto-levels',ctx.request.url),301);}
  if(path.startsWith('/api/'))response=await api(ctx,path);
  else if(!['GET','HEAD'].includes(ctx.request.method))response=new Response('Method not allowed',{status:405});
  else if(path==='/robots.txt')response=new Response(`User-agent: *\nDisallow: /admin\nDisallow: /api/\nDisallow: /review\n${ctx.env.SITE_URL?`Sitemap: ${ctx.env.SITE_URL.replace(/\/$/,'')}/sitemap.xml`:''}`,{headers:{'Content-Type':'text/plain'}});
  else {const data=await load(ctx.env);
   if(path==='/sitemap.xml'){const base=ctx.env.SITE_URL?.replace(/\/$/,'');if(!base)return new Response('SITE_URL is not configured',{status:503});const {escape}=await import('../security.js');const paths=['/','/work','/services','/about','/blog','/contact','/reviews',...data.content.filter(c=>['projects','posts','services'].includes(c.kind)).map(c=>`/${{projects:'work',posts:'blog',services:'services'}[c.kind]}/${c.slug}`)];response=new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${escape(base+p)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});}
   else {const page=render(path,data,ctx.env);response=new Response(ctx.request.method==='HEAD'?null:page.html,{status:page.status,headers:{'Content-Type':'text/html; charset=utf-8'}});}
  }
 }catch(err){console.error('Portfolio request failed:',err.name);response=path.startsWith('/api/')?json({error:err instanceof InputError?err.message:err instanceof SyntaxError?'Invalid JSON data.':'Unable to complete this request. Please refresh and try again.'},err instanceof InputError||err instanceof SyntaxError?400:500):new Response('The site is temporarily unavailable. Please try again shortly.',{status:503});}
 response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');response.headers.set('X-Frame-Options','DENY');response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');response.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");response.headers.set('Cache-Control','no-store');
 return response;
}

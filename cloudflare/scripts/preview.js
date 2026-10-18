// Node-only preview server. Production uses Cloudflare Pages Functions.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {onRequest} from '../functions/[[path]].js';
import {database} from '../test/database.js';
const env={DB:database(),ORDERS_ENABLED:'false'};
try{for(const line of (await readFile(new URL('../.dev.vars',import.meta.url),'utf8')).split('\n')){const i=line.indexOf('=');if(i>0)env[line.slice(0,i)]=line.slice(i+1);}}catch{}
const types={'.css':'text/css','.js':'application/javascript','.webp':'image/webp','.ico':'image/x-icon'};
createServer(async(req,res)=>{try{const url=new URL(req.url,`http://${req.headers.host}`);const ext=url.pathname.match(/\.[a-z]+$/)?.[0];if(ext&&types[ext]&&!url.pathname.includes('..')){const bytes=await readFile(new URL('../public'+url.pathname,import.meta.url));res.writeHead(200,{'Content-Type':types[ext]});res.end(bytes);return;}
 const chunks=[];for await(const chunk of req)chunks.push(chunk);const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});const response=await onRequest({request,env,waitUntil:p=>p.catch(console.error)});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview error');}}).listen(8788,'127.0.0.1',()=>console.log('Preview: http://localhost:8788 (local test data only)'));

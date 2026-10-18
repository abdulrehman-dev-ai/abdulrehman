import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
export function database(){const db=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../migrations/',import.meta.url)).sort())db.exec(readFileSync(new URL(`../migrations/${f}`,import.meta.url),'utf8'));
 const wrap=(sql,args=[])=>({sql,args,bind(...values){return wrap(sql,values);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}});
 return {prepare:wrap,async batch(stmts){db.exec('BEGIN');try{const results=[];for(const stmt of stmts){if(/^\s*SELECT/i.test(stmt.sql))results.push(await stmt.all());else results.push(await stmt.run());}db.exec('COMMIT');return results;}catch(err){db.exec('ROLLBACK');throw err;}},raw:db};}


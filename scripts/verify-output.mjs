import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const files = [];
function walk(dir) { for(const entry of fs.readdirSync(dir,{withFileTypes:true})) { const file = path.join(dir,entry.name); if(entry.isDirectory()) walk(file); else files.push(file); } }
walk(root);
const htmlFiles = files.filter(f=>f.endsWith('.html'));
const errors = [];
if(JSON.parse(fs.readFileSync('vercel.json','utf8')).git.deploymentEnabled !== false) errors.push('Vercel automatic deployments must remain disabled');
for(const file of htmlFiles) {
  const html = fs.readFileSync(file,'utf8');
  if([...html.matchAll(/<h1[\s>]/g)].length !== 1) errors.push(`${file}: expected one h1`);
  if(!html.includes('rel="canonical"')) errors.push(`${file}: missing canonical`);
  const targets = [...html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]);
  for(const target of targets.filter(t=>t.startsWith('/'))) {
    const resolved = path.resolve(root,'.'+decodeURIComponent(target));
    if(!resolved.startsWith(root+path.sep) && resolved!==root) { errors.push(`Outside root: ${target}`); continue; }
    if(!fs.existsSync(resolved) || (fs.statSync(resolved).isDirectory() && !fs.existsSync(path.join(resolved,'index.html')))) errors.push(`${path.relative(root,file)}: broken target ${target}`);
  }
}
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!home.includes('PiLoop') || !home.includes('Legion')) errors.push('Featured projects missing');
if(home.indexOf('PiLoop') > home.indexOf('Legion')) errors.push('PiLoop must remain first');
const search = JSON.parse(fs.readFileSync(path.join(root,'search.json'),'utf8'));
if(search.filter(p=>p.type==='文章').length!==4) errors.push('Expected four original articles');
if(new Set(search.map(p=>p.url)).size!==search.length) errors.push('Duplicate search URLs');
if(errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${htmlFiles.length} HTML pages, internal targets, ${search.length} search entries and project order.`);

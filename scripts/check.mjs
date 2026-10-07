import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const catalog=JSON.parse(read('app/catalog.json'));
const html=read('release/index.html');
const match=html.match(/<script id="knowledge-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'The reader must embed its content');
assert.ok(!html.includes('__PAYLOAD__'),'Unreplaced build placeholder');
const data=JSON.parse(match[1]);
const ids=new Set(catalog.pages.map(p=>p.id));
assert.equal(ids.size,catalog.pages.length,'Duplicate article route');
assert.equal(new Set(catalog.pages.map(p=>p.path)).size,ids.size,'Duplicate source path');
assert.deepEqual(data.pages.map(p=>p.id),catalog.pages.map(p=>p.id));
// Conversation callbacks and production reports do not belong in public lessons.
// Generic reader address, fictional-case labels and action scopes remain valid.
const internalVoice=/(?:你(?:说的|提到的|提出的|最初的问题)|根据你的(?:要求|反馈)|(?:本轮|这一版|本版)(?:审校|检查|经过|修改)|编辑推演|本地阅读器的显示|(?:尚未开展|尚未经过)真实(?:读者|零基础读者)(?:学习效果研究|实验))/;
const checkReaderVoice=(text,label)=>assert.ok(!internalVoice.test(text),`Internal discussion or production wording in ${label}`);
for(const p of data.pages)checkReaderVoice([p.title,p.summary,p.html.replace(/<[^>]*>/g,'')].join(' '),p.id);
let images=0;
for(const p of data.pages){
 assert.ok(p.html.length>100,`Empty article: ${p.id}`);
 assert.ok(!/<p>\s*<figure>/.test(p.html),`Invalid figure nesting: ${p.id}`);
 assert.ok(!p.html.replace(/<[^>]*>/g,'').includes('**'),`Unrendered emphasis: ${p.id}`);
 for(const m of p.html.matchAll(/href="#\/([^"#]+)"/g))assert.ok(ids.has(m[1]),`Unknown link: ${p.id} → ${m[1]}`);
 for(const id of p.related)assert.ok(ids.has(id),`Unknown related route: ${id}`);
 for(const m of p.html.matchAll(/<img\s[^>]*src="([^"]+)"[^>]*>/g)){
  assert.match(m[1],/^data:image\/(svg\+xml|png);base64,/,'Image must be embedded');
  assert.match(m[0],/alt="[^"]+"/,'Missing alternative text');
  assert.ok(Buffer.from(m[1].split(',')[1],'base64').length>100);images++;
 }
}
assert.equal(images,catalog.pages.reduce((n,p)=>n+(read(p.path).match(/!\[[^\]]*\]\([^)]*\)/g)||[]).length,0),'Lost source image');
assert.ok(!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(html),'Offline reader loads external scripts or styles');
assert.ok(html.includes(read('LICENSE').trim()),'Project license must travel with offline HTML');
assert.ok(html.includes(read('READER_LICENSE.txt').trim()),'Original reader license must be retained');
// Scan only files shipped as source or reader, never local authoring records.
const files=[];
function collect(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())collect(f);else files.push(f);}}
for(const dir of ['content','app','release'])collect(dir);
for(const f of files){
 const s=read(f);
 checkReaderVoice(s,f);
 assert.ok(!/\/Users\/|\/private\/var\/folders\/|C:\\Users\\|_kb-control|_task-control/.test(s),`Local production data in ${f}`);
 assert.ok(!/(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(s),`Secret-like value in ${f}`);
}
console.log(JSON.stringify({status:'pass',articles:ids.size,embeddedImages:images,offline:true,license:'MIT',publicFilesScanned:files.length},null,2));

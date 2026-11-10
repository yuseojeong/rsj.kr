const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const originals = require('../data/service-analysis-originals.json');
const coverage = require('../data/service-analysis-coverage');
const edits = require('./service-analysis-edits');
const topics = require('../data/service-analysis-study-topics');
const evidence = require('../data/service-analysis-evidence.json');
const root=path.join(__dirname,'..');
let imageCount=0, displayedImages=0, reviewedUnits=0;
for(const [slug,source] of Object.entries(originals)) {
  const html=fs.readFileSync(path.join(root,`analysis-${slug}.html`),'utf8');
  assert(!/href="[^"]*notion\.(site|so|com)/.test(html),`${slug}: visible Notion link`);
  const units=[];
  function walk(block) {
    if(block.text&&block.text!=='Untitled'&&block.type!=='image')units.push(block.text);
    if(block.cells)units.push(block.cells.join(' | '));
    assert.equal((block.missingChildren||[]).length,0,`${slug}: incomplete block ${block.id}`);
    if(block.type==='image') {
      imageCount++;
      assert(fs.existsSync(path.join(root,block.source)),`${slug}: missing image ${block.source}`);
    }
    block.children.forEach(walk);
  }
  walk(source.tree);
  const marked=new Set();
  for(const [start,end,section,topic] of coverage[slug]||[]) {
    assert(html.includes(`id="${section}"`),`${slug}: no target section for ${topic}`);
    assert(start>=0&&end<units.length,`${slug}: stale coverage range for ${topic}`);
    for(let i=start;i<=end;i++)marked.add(i);
  }
  assert.equal(marked.size,units.length,`${slug}: source text/table unit missing from review ledger`);
  reviewedUnits+=marked.size;
  for(const section of ['concept','features','observation','proposal','tradeoffs','takeaways']) {
    assert(html.includes(`id="${section}"`),`${slug}: inconsistent outline`);
    for(const block of [...edits.selected(slug,section),...(topics[slug]?.[section]||[])]) {
      for(const {at} of block.images||[]) {
        const image=evidence[slug][at-1];
        assert(html.includes(`src="${image.src}"`),`${slug}: selected evidence omitted`);
        displayedImages++;
      }
    }
  }
  assert(!html.includes('analysis-original'),`${slug}: raw source renderer active`);
}
const pet=fs.readFileSync(path.join(root,'analysis-petfriends.html'),'utf8');
for(const term of ['발행 위치','회원등급 제한','최저/최대 사용 금액','사용 여부','댕댕케어 비법 채널','GIF','CS'])assert(pet.includes(term),`Petfriends source detail omitted: ${term}`);
console.log(`Checked ${Object.keys(originals).length} consistent outlines, ${reviewedUnits} source units mapped, ${displayedImages} selected images (${imageCount} originals retained).`);

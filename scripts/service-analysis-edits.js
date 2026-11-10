const editorial=require('../data/service-analysis-editorial');
const topics=require('../data/service-analysis-study-topics');
const evidence=require('../data/service-analysis-evidence.json');
const originals=require('../data/service-analysis-originals.json');
const fs=require('node:fs');
const path=require('node:path');
const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Reserve the intrinsic ratio of lazy-loaded flow diagrams to keep anchor jumps stable.
function imageSize(src) {
  if(!src.endsWith('.png'))return '';
  const bytes=fs.readFileSync(path.join(__dirname,'..',src));
  return ` width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}"`;
}

function selected(slug,section) {
  return (editorial[slug]?.[section]||[]).filter((b,i)=>b.images ||
    (slug==='petfriends'&&section==='takeaways') ||
    (slug==='naver-map'&&section==='takeaways') ||
    (slug==='29cm'&&section==='observation') ||
    (slug==='naver-booking'&&section==='observation') ||
    (slug==='naver-booking'&&section==='takeaways'&&i===0));
}
function renderBlock(slug,section,b,i) {
  const table=b.rows?`<div class="source-table-scroll" tabindex="0" role="region" aria-label="${esc(b.title)}"><table class="source-table ${b.columns.length===2?'source-table-pair':'source-table-comparison'}"><thead><tr>${b.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map((c,j)=>j===0?`<th scope="row">${esc(c)}</th>`:`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  const wide=b.wide||['soomgo','samzzam','tabling','zeta','ohouse'].includes(slug)||(slug==='yeogi'&&section==='observation');
  const figures=b.images?`<div class="analysis-evidence ${wide?'analysis-evidence-wide':''}" style="--evidence-columns:${Math.min(b.images.length,2)}">${b.images.map(({at,caption})=>{
    const asset=evidence[slug]?.[at-1];if(!asset)throw new Error(`Missing image: ${slug} ${at}`);
    return `<figure class="source-figure"><a href="${esc(asset.src)}" target="_blank" rel="noopener" aria-label="${esc(caption)} 크게 보기 · 새 탭"><img src="${esc(asset.src)}" alt="${esc(caption)}"${imageSize(asset.src)} loading="lazy" decoding="async"><span class="source-image-open">크게 보기 ↗</span></a><figcaption>${esc(caption)}</figcaption></figure>`;
  }).join('')}</div>`:'';
  return `<div class="analysis-topic" id="${slug}-${section}-topic-${i+1}">${b.title?`<h3>${esc(b.title)}</h3>`:''}${b.text?`<p>${esc(b.text)}</p>`:''}${b.items?`<dl class="analysis-topic-points">${b.items.map(([name,value])=>`<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`:''}${table}${b.code?`<pre class="source-code"><code>${esc(b.code)}</code></pre>`:''}${figures}${b.footnote?`<p class="analysis-topic-note">${esc(b.footnote)}</p>`:''}</div>`;
}
function render(slug,section) {
  return [...selected(slug,section),...(topics[slug]?.[section]||[])].map((b,i)=>renderBlock(slug,section,b,i)).join('');
}
function references(slug) {
  const links=new Set();
  const accept=value=>{if(/^https?:\/\//.test(value)&&!/(notion\.(site|so|com)|prod-files-secure|amazonaws\.com)/.test(value))links.add(value);};
  function walk(b){(b.links||[]).forEach(accept);if(['bookmark','embed','link_preview'].includes(b.type))accept(b.source);if(b.text?.trim().startsWith('http'))b.text.trim().split(/\s+/).forEach(accept);b.children.forEach(walk);}
  walk(originals[slug].tree);
  if(!links.size)return '';
  return `<details class="analysis-references"><summary>분석에 참고한 자료</summary><ul>${[...links].map((url,i)=>{let host;try{host=new URL(url).hostname}catch{return ''}return `<li><a href="${esc(url)}" target="_blank" rel="noopener">참고 자료 ${i+1} · ${esc(host)} ↗</a></li>`;}).join('')}</ul></details>`;
}
module.exports={render,references,selected,replaceDiagram:slug=>editorial[slug]?.replaceDiagram===true};

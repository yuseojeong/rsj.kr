// Keep the author's text, tables, images and collapsed notes together.
// Presentation follows the shared analysis layout; no generated claims are added.
const originals = require('../data/service-analysis-originals.json');
const escape = value => String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = value => escape(value).replace(/\n/g,'<br>');
const safeLink = url => /^https?:\/\//.test(url)&&!/(?:notion\.site|notion\.so|notion\.com)/.test(url);
const headings = {
  concept:'사용자와 해결 방향', features:'핵심 기능', observation:'사용자 흐름과 기획 의도',
  proposal:'문제와 개선 제안', tradeoffs:'장점과 아쉬운 지점', takeaways:'내가 주목한 점'
};
function category(label,slug) {
  const s=label.trim().replace(/^[✅👥🗣📍\s]+/u,'');
  if(/^(why|사용자 정의|사용자 분석|서비스를 한마디로|비즈니스 모델 이해|비즈니스 핵심 가치)/i.test(s)) return 'concept';
  if(/^(what|key feature|고객의 니즈를 반영한)/i.test(s)) return 'features';
  if(/^(how|benchmarking|벤치마킹|마켓컬리 PM|인터페이스 차이|AARRR)/i.test(s)) return 'observation';
  if(/^(pain point|개선점|기능 및 UX|서비스 기획 개선|자사 서비스에|자사에 적용|유저는 이런 점을 불편)/i.test(s)) return 'proposal';
  if(/^(if$|장단점|서비스 장단점|유저는 이런 점을 좋아)/i.test(s)) return 'tradeoffs';
  if(/^(내가 주목|인사이트|레퍼런스|비즈니스 수익 모델|여기어때의 향후)/i.test(s)) return 'takeaways';
  if(slug==='ably') {
    if(/서비스 가치|성공요소/.test(s)) return 'features';
    if(/지향점/.test(s)) return 'proposal';
  }
  if(slug==='29cm' && /패션, 라이프/.test(s)) return 'features';
  if(slug==='zeta') return 'observation';
  return null;
}
function renderBlocks(blocks,context='분석 기록') {
  let html='', heading=context;
  for(let i=0;i<blocks.length;i++) {
    const b=blocks[i];
    if(['bulleted_list','numbered_list'].includes(b.type)) {
      const tag=b.type==='bulleted_list'?'ul':'ol',items=[];
      while(i<blocks.length&&blocks[i].type===b.type) {
        const item=blocks[i++]; items.push(`<li>${text(item.text)}${renderBlocks(item.children,heading)}</li>`);
      }
      i--;html+=`<${tag}>${items.join('')}</${tag}>`;continue;
    }
    if(/header/.test(b.type)&&b.text) heading=b.text;
    if(b.type==='text'&&b.text.startsWith('✅')) heading=b.text.replace(/^✅\s*/,'');
    const children=()=>renderBlocks(b.children,heading);
    if(b.type==='image') {
      if(!b.source.startsWith('images/')) continue;
      const caption=b.caption||heading;
      html+=`<figure class="source-figure"><a href="${escape(b.source)}" target="_blank" rel="noopener" aria-label="${escape(caption)} 이미지 크게 보기 · 새 탭"><img src="${escape(b.source)}" alt="${escape(caption)} — 분석 당시 첨부한 이미지" loading="lazy" decoding="async"><span class="source-image-open">크게 보기 ↗</span></a>${b.caption?`<figcaption>${text(b.caption)}</figcaption>`:''}</figure>`;
    } else if(b.type==='column_list') html+=`<div class="source-columns" style="--source-columns:${Math.min(b.children.length,3)}">${children()}</div>`;
    else if(b.type==='column') html+=`<div class="source-column">${children()}</div>`;
    else if(b.type==='table') {
      const rows=b.children.filter(c=>c.type==='table_row');
      if(b.text)html+=`<h3 class="analysis-subheading">${text(b.text)}</h3>`;
      html+=`<div class="source-table-scroll" tabindex="0" role="region" aria-label="${escape(heading)} 표"><table class="source-table"><thead><tr>${(rows[0]?.cells||[]).map(c=>`<th scope="col">${text(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(r=>`<tr>${r.cells.map(c=>`<td>${text(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    } else if(b.type==='toggle') html+=`<details class="source-toggle" open><summary>${text(b.text)}</summary>${children()}</details>`;
    else if(b.type==='callout') html+=`<div class="source-callout">${b.text?`<p>${text(b.text)}</p>`:''}${children()}</div>`;
    else if(b.type==='quote') html+=`<blockquote class="source-quote">${text(b.text)}${children()}</blockquote>`;
    else if(/header/.test(b.type)) html+=b.text?`<h3 class="analysis-subheading">${text(b.text)}</h3>${children()}`:children();
    else if(b.type==='code') html+=`<pre class="source-code"><code>${escape(b.text)}</code></pre>`;
    else if(['bookmark','embed','link_preview'].includes(b.type)) html+=safeLink(b.source)?`<p class="source-reference"><a href="${escape(b.source)}" target="_blank" rel="noopener">${text(b.text||'참고 자료')} ↗</a></p>`:'';
    else if(b.type!=='divider') html+=`${b.text&&b.text!=='Untitled'?`<p>${text(b.text)}</p>`:''}${children()}`;
    const links=(b.links||[]).filter(safeLink);
    if(links.length) html+=`<p class="source-reference">${[...new Set(links)].map((url,j)=>`<a href="${escape(url)}" target="_blank" rel="noopener">참고 링크${links.length>1?' '+(j+1):''} ↗</a>`).join(' · ')}</p>`;
  }
  return html;
}
module.exports = function originalPage(n,next) {
  const source=originals[n.slug];if(!source)return null;
  const groups=Object.fromEntries(Object.keys(headings).map(key=>[key,[]]));
  let active=n.slug==='zeta'?'observation':'concept';
  for(const block of source.tree.children) {
    const eligible=/header/.test(block.type)||block.text?.startsWith('✅');
    if(eligible) active=category(block.text,n.slug)||active;
    // Standard section labels replace bare Why / What / How / If headings.
    if(/^(why|what|how|if|장단점|내가 주목한 점)\s*$/i.test(block.text||'')&&/header/.test(block.type))continue;
    groups[active].push(block);
  }
  const sections=Object.entries(groups).map(([id,blocks])=>({id,html:renderBlocks(blocks,headings[id])})).filter(s=>s.html.trim());
  return `<article class="analysis-article analysis-study analysis-original">
    <header class="notes-intro"><a class="notes-kicker" href="notes.html#analysis">서비스 분석 / ${escape(n.category)}</a><h1>${escape(n.name)}${n.status?`<span class="analysis-status">${escape(n.status)}</span>`:''}</h1><p class="analysis-question">${escape(n.question)}</p></header>
    <p class="analysis-context">분석 당시 작성한 내용과 첨부 이미지입니다. 서비스의 현재 상태와 다를 수 있으며, 기획 의도와 개선안은 개인의 해석입니다. 이미지는 클릭하면 크게 볼 수 있습니다.</p>
    <nav class="notes-tabs" aria-label="분석 목차">${sections.map(s=>`<a href="#${s.id}">${headings[s.id]}</a>`).join('')}</nav>
    ${sections.map((s,i)=>`<section id="${s.id}" class="analysis-section"><h2><span>${String(i+1).padStart(2,'0')}</span>${headings[s.id]}</h2>${s.html}</section>`).join('')}
    ${n.related?`<a class="resume-artifact-link analysis-related" href="${escape(n.related)}">이 분석에서 이어진 개인 프로젝트 <span aria-hidden="true">↗</span></a>`:''}
    <nav class="analysis-next" aria-label="다른 분석"><a href="notes.html#analysis">← 서비스 분석 목록</a><a href="analysis-${next.slug}.html">다음 기록 · ${escape(next.name)} →</a></nav>
  </article>`.replace(/[\t ]+\n/g,'\n');
};

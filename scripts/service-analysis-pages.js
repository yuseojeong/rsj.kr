const notes = require('../data/service-analyses');
const details = require('../data/service-analysis-details');
const sources = require('../data/service-analysis-sources.json');
const edits = require('./service-analysis-edits');
const esc = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries = notes.map((note,i)=>({...note,...details[note.slug],name:sources[i].title.trim(),source:sources[i].url}));
const list = `<section class="notes-section" id="analysis" aria-labelledby="analysis-title"><div class="analysis-heading"><h2 id="analysis-title">서비스 분석</h2><span data-analysis-count aria-live="polite">${entries.length}개의 기록</span></div><p class="analysis-lead">익숙한 기능을 다시 보고, 그 뒤의 선택을 짚어봤습니다.</p><div class="analysis-controls"><div class="analysis-filters" role="group" aria-label="서비스 분야">${['전체',...new Set(entries.map(n=>n.category))].map((name,i)=>`<button type="button" data-analysis-filter="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><label class="analysis-search"><span class="sr-only">서비스 분석 검색</span><input type="search" placeholder="서비스·주제 찾기" data-analysis-search></label></div><div class="analysis-grid">${entries.map(n=>`<article class="analysis-card" data-analysis-category="${n.category}"><a href="analysis-${n.slug}.html"><span class="analysis-category">${n.category}${n.status?' · '+n.status:''}</span><h3>${esc(n.name)} <span aria-hidden="true">↗</span></h3><p>${esc(n.question)}</p><small>${esc(n.focus)}</small></a></article>`).join('')}</div><p class="analysis-empty" hidden>일치하는 기록이 없습니다. 다른 서비스나 주제로 찾아보세요.</p></section><script src="js/planning-notes.js" defer></script>`;

const bullets = items => `<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
const section = (id,number,title,body) => `<section id="${id}" class="analysis-section"><h2><span>${number}</span>${title}</h2>${body}</section>`;
const diagram = n => !n.flow?'':`<figure class="analysis-diagram"><h3>${esc(n.flow.title)}</h3><picture><source media="(max-width:600px)" srcset="images/analysis/${n.slug}-flow-mobile.svg"><img src="images/analysis/${n.slug}-flow.svg" alt="${esc(n.flow.rows.map(r=>r.label+': '+r.steps.join(' → ')).join('. '))}" width="1000" height="340" loading="lazy"></picture><figcaption>${esc(n.flow.caption)}</figcaption></figure>`;
const pages = shell => entries.map((n,i)=>{
  const next=entries[(i+1)%entries.length], improvements=n.improvements||n.proposals;
  const content=`<article class="analysis-article analysis-study">
  <header class="notes-intro"><a class="notes-kicker" href="notes.html#analysis">서비스 분석 / ${esc(n.category)}</a><h1>${esc(n.name)}${n.status?`<span class="analysis-status">${esc(n.status)}</span>`:''}</h1><p class="analysis-question">${esc(n.question)}</p><p>${esc(n.service)}</p><p class="analysis-learning-purpose"><strong>학습 목적</strong>${esc(n.intro)}</p></header>
  <p class="analysis-context">개인 학습 기록 · 관찰한 경험, 기획 의도에 대한 해석, 개선 제안을 구분해 정리했습니다. 수치·요금·정책은 분석 당시 조사한 자료이며 현재 기준이나 직접 만든 성과가 아닙니다.</p>
  ${n.note?`<p class="analysis-scope">${esc(n.note)}</p>`:''}
  <nav class="notes-tabs" aria-label="분석 목차"><a href="#concept">사용자·콘셉트</a><a href="#features">핵심 기능</a><a href="#observation">흐름·의도</a><a href="#proposal">문제·개선</a><a href="#tradeoffs">장점·아쉬움</a><a href="#takeaways">인사이트·추가 학습</a></nav>
  ${section('concept','01','사용자와 해결 방향',`<p class="analysis-audience"><strong>누구를 위한 서비스인가</strong>${esc(n.audience)}</p><div class="analysis-why-what"><div><h3>Why · 사용자가 찾는 이유</h3><p>${esc(n.why)}</p></div><div><h3>What · 제공 경험과 해결 방식</h3><p>${esc(n.what)}</p></div></div>${n.needNote?`<p class="analysis-topic-note">${esc(n.needNote)}</p>`:''}${edits.render(n.slug,'concept')}`)}
  ${section('features','02','핵심 기능과 벤치마킹',`<dl class="analysis-features">${n.features.map(([name,text])=>`<div><dt>${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>${n.benchmarks.length?`<h3 class="analysis-subheading">비교해서 살펴본 지점</h3><dl class="analysis-features analysis-benchmarks">${n.benchmarks.map(([name,text])=>`<div><dt>${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`:''}${edits.render(n.slug,'features')}`)}
  ${section('observation','03',n.slug==='zeta'?'동작 구조와 설계 의도':'사용자 흐름과 기획 의도',`${edits.replaceDiagram(n.slug)?'':diagram(n)}<h3 class="analysis-subheading">${n.slug==='zeta'?'학습하며 정리한 구조':'관찰한 경험'}</h3>${bullets(n.observations)}${edits.render(n.slug,'observation')}<h3 class="analysis-subheading" id="interpretation">왜 이렇게 설계했을까 · 나의 해석</h3>${bullets(n.interpretation)}`)}
  ${section('proposal','04','문제와 개선 제안',`${n.pain.length?`<h3 class="analysis-subheading">Pain Point · 걸리는 지점</h3>${bullets(n.pain)}`:'<p class="analysis-pending">원문이 유입·활성화 분석 단계에서 끝나, 구체적인 문제와 개선안은 아직 정리하지 않았습니다.</p>'}${improvements.length?`<h3 class="analysis-subheading">${esc(n.proposalTitle||'내가 바꿔본다면')}</h3><ol class="analysis-proposals">${improvements.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}${edits.render(n.slug,'proposal')}`)}
  ${section('tradeoffs','05','장점과 아쉬운 지점',`<div class="analysis-tradeoffs"><div><h3>좋았던 점</h3>${bullets(n.strengths)}</div><div><h3>아쉬운 점 · 더 살필 점</h3>${bullets(n.cautions)}</div></div>${edits.render(n.slug,'tradeoffs')}`)}
  ${section('takeaways','06','내가 주목한 점',`${edits.render(n.slug,'takeaways')}<h3 class="analysis-subheading">기획에 가져갈 기준</h3>${bullets(n.takeaway)}`)}
  ${n.related?`<a class="resume-artifact-link analysis-related" href="${n.related}">이 분석에서 이어진 개인 프로젝트 <span aria-hidden="true">↗</span></a>`:''}
  ${edits.references(n.slug)}<nav class="analysis-next" aria-label="다른 분석"><a href="notes.html#analysis">← 서비스 분석 목록</a><a href="analysis-${next.slug}.html">다음 기록 · ${esc(next.name)} →</a></nav></article>`;
  const html=shell(`${n.name} · 서비스 분석`,n.question,content).replace('<a href="index.html">← 이력서로</a>','<a href="notes.html#analysis">← 서비스 분석</a>');
  return [`analysis-${n.slug}.html`,html];
});
module.exports={list,pages};

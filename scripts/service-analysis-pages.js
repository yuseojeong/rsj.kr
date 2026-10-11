const notes = require('../data/service-analyses');
const details = require('../data/service-analysis-details');
const sources = require('../data/service-analysis-sources.json');
const esc = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries = notes.map((note,i)=>({...note,...details[note.slug],name:sources[i].title.trim(),source:sources[i].url}));
const list = `<section class="notes-section" id="analysis" aria-labelledby="analysis-title"><div class="analysis-heading"><h2 id="analysis-title">Service Analysis</h2><span data-analysis-count aria-live="polite">${entries.length}개의 기록</span></div><p class="analysis-lead">익숙한 기능을 다시 보고, 그 뒤의 선택을 짚어봤습니다.</p><div class="analysis-controls"><div class="analysis-filters" role="group" aria-label="서비스 분야">${['전체',...new Set(entries.map(n=>n.category))].map((name,i)=>`<button type="button" data-analysis-filter="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><label class="analysis-search"><span class="sr-only">서비스 분석 검색</span><input type="search" placeholder="서비스·주제 찾기" data-analysis-search></label></div><div class="analysis-grid">${entries.map(n=>`<article class="analysis-card" data-analysis-category="${n.category}"><a href="analysis-${n.slug}.html"><span class="analysis-category">${n.category}${n.status?' · '+n.status:''}</span><h3>${esc(n.name)} <span aria-hidden="true">↗</span></h3><p>${esc(n.question)}</p><small>${esc(n.focus)}</small></a></article>`).join('')}</div><p class="analysis-empty" hidden>일치하는 기록이 없습니다. 다른 서비스나 주제로 찾아보세요.</p></section><script src="js/planning-notes.js" defer></script>`;

const bullets = items => `<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
const section = (id,number,title,body) => `<section id="${id}" class="analysis-section"><h2><span>${number}</span>${title}</h2>${body}</section>`;
const diagram = n => !n.flow?'':`<figure class="analysis-diagram"><h3>${esc(n.flow.title)}</h3><picture><source media="(max-width:600px)" srcset="images/analysis/${n.slug}-flow-mobile.svg"><img src="images/analysis/${n.slug}-flow.svg" alt="${esc(n.flow.rows.map(r=>r.label+': '+r.steps.join(' → ')).join('. '))}" width="1000" height="340" loading="lazy"></picture><figcaption>${esc(n.flow.caption)}</figcaption></figure>`;
const pages = shell => entries.map((n,i)=>{
  const next=entries[(i+1)%entries.length], improvements=n.improvements||n.proposals;
  const content=`<article class="analysis-article analysis-study">
  <header class="notes-intro"><a class="notes-kicker" href="notes.html#analysis">서비스 분석 / ${esc(n.category)}</a><h1>${esc(n.name)}${n.status?`<span class="analysis-status">${esc(n.status)}</span>`:''}</h1><p class="analysis-question">${esc(n.question)}</p><p>${esc(n.service)}</p></header>
  <p class="analysis-context">개인 학습 기록 · 원문에 기록한 당시의 경험을 재구성했습니다. 기획 의도는 개인 해석이며 개선안·확인 지표는 검증 전 제안입니다.</p>
  ${n.note?`<p class="analysis-scope">${esc(n.note)}</p>`:''}
  <nav class="notes-tabs" aria-label="분석 목차"><a href="#concept">사용자·콘셉트</a><a href="#features">핵심 기능</a><a href="#observation">흐름·의도</a><a href="#proposal">문제·개선</a><a href="#takeaways">인사이트</a></nav>
  ${section('concept','01','사용자와 해결 방향',`<p class="analysis-audience"><strong>누구를 위한 서비스인가</strong>${esc(n.audience)}</p><div class="analysis-why-what"><div><h3>Why · 사용자의 필요</h3><p>${esc(n.why)}</p></div><div><h3>What · 서비스의 답</h3><p>${esc(n.what)}</p></div></div>`)}
  ${section('features','02','핵심 기능과 벤치마킹',`<dl class="analysis-features">${n.features.map(([name,text])=>`<div><dt>${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>${n.benchmarks.length?`<h3 class="analysis-subheading">비교해서 살펴본 지점</h3><dl class="analysis-features analysis-benchmarks">${n.benchmarks.map(([name,text])=>`<div><dt>${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`:''}`)}
  ${section('observation','03',n.slug==='zeta'?'동작 구조와 설계 의도':'사용자 흐름과 기획 의도',`${diagram(n)}<h3 class="analysis-subheading">${n.slug==='zeta'?'학습하며 정리한 구조':'관찰한 경험'}</h3>${bullets(n.observations)}<h3 class="analysis-subheading" id="interpretation">왜 이렇게 설계했을까 · 나의 해석</h3>${bullets(n.interpretation)}`)}
  ${section('proposal','04','문제와 개선 제안',`${n.pain.length?`<h3 class="analysis-subheading">Pain Point · 걸리는 지점</h3>${bullets(n.pain)}`:'<p class="analysis-pending">원문이 유입·활성화 분석 단계에서 끝나, 구체적인 문제와 개선안은 아직 정리하지 않았습니다.</p>'}${improvements.length?`<h3 class="analysis-subheading">${esc(n.proposalTitle||'내가 바꿔본다면')}</h3><ol class="analysis-proposals">${improvements.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}<div class="analysis-validation"><h3>확인할 지표 · 검증 계획 제안</h3><p>${esc(n.validation)}</p></div>`)}
  ${section('tradeoffs','05','장점과 아쉬운 지점',`<div class="analysis-tradeoffs"><div><h3>좋았던 점</h3>${bullets(n.strengths)}</div><div><h3>아쉬운 점 · 더 살필 점</h3>${bullets(n.cautions)}</div></div>`)}
  ${section('takeaways','06','내가 주목한 점',bullets(n.takeaway))}
  ${n.related?`<a class="resume-artifact-link analysis-related" href="${n.related}">이 분석에서 이어진 개인 프로젝트 <span aria-hidden="true">↗</span></a>`:''}
  <div class="analysis-source"><span>분석 원문</span><a href="${esc(n.source)}" target="_blank" rel="noopener noreferrer">${esc(n.name)} · 노션 원문 ↗</a></div>
  <nav class="analysis-next" aria-label="다른 분석"><a href="notes.html#analysis">← 서비스 분석 목록</a><a href="analysis-${next.slug}.html">다음 기록 · ${esc(next.name)} →</a></nav></article>`;
  const html=shell(`${n.name} · 서비스 분석`,n.question,content).replace('<a href="index.html">← 이력서로</a>','<a href="notes.html#analysis">← 서비스 분석</a>');
  return [`analysis-${n.slug}.html`,html];
});
module.exports={list,pages};

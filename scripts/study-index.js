const notes = require('../data/service-analyses');
const details = require('../data/service-analysis-details');
const sources = require('../data/service-analysis-sources.json');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries = notes.map((n,i)=>({...n,...details[n.slug],name:sources[i].title.trim()}));
const themes = {'커머스':['peach','folder'],'금융':['blue','sparkle'],'콘텐츠':['mint','bookmark'],'생활·예약':['sky','folder'],'AI':['indigo','chat']};
const thumb = n => {const [theme,icon]=themes[n.category];return `<span class="feed-thumb feed-thumb-${theme}" aria-hidden="true"><span class="feed-thumb-orbit"></span><img src="images/icons/${icon}-3d.svg" alt="" loading="lazy" width="120" height="120"><b>${esc(n.name)}</b><small>${esc(n.focus.split(' · ')[0])}</small></span>`};
module.exports = function studyIndex(){
 return `<div class="wrap"><header class="notes-intro feed-intro"><p class="notes-kicker">스터디</p><h1>관찰에서 기획까지.</h1><p>서비스를 분석하며 발견한 질문과 직접 기획해본 답을 모았습니다.</p></header>
 </div>
 <div class="notes-analysis-background"><div class="wrap study-feed-layout">

 <section class="notes-section feed-collection" id="analysis" aria-label="서비스 분석 기록"><div class="analysis-heading"><span data-analysis-count aria-live="polite">${entries.length}개의 기록</span></div><div class="analysis-controls"><div class="analysis-filters" role="group" aria-label="서비스 분야">${['전체',...new Set(entries.map(n=>n.category))].map((name,i)=>`<button type="button" data-analysis-filter="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><label class="analysis-search"><span class="sr-only">서비스 분석 검색</span><input type="search" placeholder="궁금한 서비스나 주제를 찾아보세요" data-analysis-search></label></div>
 <div class="analysis-grid">${entries.map(n=>`<article class="analysis-card" data-analysis-category="${n.category}"><a href="analysis-${n.slug}.html"><div class="feed-card-copy"><span class="analysis-category">${n.category} · ${esc(n.name)}${n.status?' · '+n.status:''}</span><h3>${esc(n.question)}</h3><p>${esc(n.focus)}</p><span class="feed-card-more">기록 읽기 <span aria-hidden="true">↗</span></span></div>${thumb(n)}</a></article>`).join('')}</div><p class="analysis-empty" hidden>일치하는 기록이 없습니다. 다른 서비스나 주제로 찾아보세요.</p></section> <section class="feed-personal-section" id="personal" aria-labelledby="personal-title"><div class="feed-sidebar-heading"><h2 id="personal-title">개인 프로젝트</h2><p>발견한 문제를 직접 기획으로 옮겼습니다.</p></div>
 <div class="feed-personal-grid">${[['irocom','이로콤','AI 중고거래 사기 신고 도우미','2025.09'],['petfriends','펫프렌즈','동네 돌봄으로 넓힌 서비스 기획','2024.05']].map(([slug,name,desc,date])=>`<a class="feed-personal" href="study-${slug}.html"><img src="images/projects/${slug}-cover.png" alt="${name} 기획서 표지" width="640" height="360" loading="lazy"><span>${date} · 개인 프로젝트</span><h3>${name}<span aria-hidden="true">↗</span></h3><p>${desc}</p></a>`).join('')}</div>
 <a class="feed-about-link" href="index.html#work">실제로 만든 서비스도 살펴보세요 <span aria-hidden="true">→</span></a></section></div></div><script src="js/planning-notes.js" defer></script>`;
};

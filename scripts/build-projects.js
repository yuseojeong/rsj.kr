const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'data/projects.json'), 'utf8'));
const parseCsv = text => {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); if (row.some(value => value.trim())) rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  row.push(cell); if (row.some(value => value.trim())) rows.push(row);
  return rows;
};
const csv = file => parseCsv(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const koachIaCsv = csv('data/koach-ia.csv');
const pickColumns = (data, columns) => {
  const lookup = data[0].map((head, index) => ({head: head.replace(/^\uFEFF/, ''), index}));
  return [columns, ...data.slice(1).map(row => columns.map(head => row[lookup.find(column => column.head === head)?.index] || ''))];
};
const koachFeatureDefinitionCsv = pickColumns(csv('data/koach-feature-definition.csv'), ['기능명', '관련 화면 ID', '기능 설명', '목적']);
const koachRequirementsCsv = [['요구 기능', '관련 화면', '사용자 요구사항', '기획 목적'], ...koachFeatureDefinitionCsv.slice(1)];
const koachFeatureSpecRaw = csv('data/koach-feature-spec.csv');
const koachFeatureSpecCsv = pickColumns(koachFeatureSpecRaw, ['화면 ID', '구분', '주 기능', '처리 로직', '입력값', '출력값', '예외', '비고']);
const koachDataGuideRaw = csv('data/koach-data-guide.csv');
const koachDataGuideNormalized = [koachDataGuideRaw[0], ...koachDataGuideRaw.slice(1).reduce((rows, row) => {
  const previous = rows.at(-1);
  rows.push(row.map((cell, index) => index < 4 && !cell && previous ? previous[index] : cell));
  return rows;
}, [])];
const koachDataGuideCsv = pickColumns(koachDataGuideNormalized, ['페이지', '이벤트명', '태그', '트리거', '매개변수', '매개변수 값', 'type', '목적', '인사이트']);
const koachQaCsv = pickColumns(csv('data/koach-qa-scenarios.csv'), ['QA 넘버', '페이지', '시나리오', '작동 UI', '확인 사항', '정상 결과', 'P/F[웹_Chrome]', 'P/F[모바일_ios]', 'P/F[모바일_android]', '우선순위', '진행상황']);
const koachBacklogRaw = csv('data/koach-backlog.csv');
// Repeat the category of grouped CSV rows so it stays visible while scrolling.
const koachBacklogCsv = [koachBacklogRaw[0], ...koachBacklogRaw.slice(1).reduce((rows, row) => {
  rows.push([row[0] || rows.at(-1)?.[0] || '', ...row.slice(1)]);
  return rows;
}, [])];
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<svg class="icon" aria-hidden="true"><use href="#arrow"/></svg>';
const koachUserFlow = require('./koach-user-flow');
const renderKoachResearch = require('./koach-research');
const renderKoachUt = require('./koach-ut');
const ssokCase = require('./ssok-case');
const icons = home.match(/<svg class="icon-definitions"[\s\S]*?<\/svg>/)[0];
const serviceGallery = p => p.heroImages
  ? `<div class="service-gallery gallery-${p.slug} gallery-pair">${p.heroImages.map(img=>`<figure><a href="${esc(img.src)}" target="_blank" rel="noopener" aria-label="${esc(img.label)} 원본 크게 보기"><img src="${esc(img.src)}" alt="${esc(img.alt)}" fetchpriority="high"></a><figcaption>${esc(img.label)}</figcaption></figure>`).join('')}</div>`
  : `<div class="service-gallery gallery-${p.slug}"><a href="${esc(p.images[0].src)}" target="_blank" rel="noopener" aria-label="${esc(p.name)} 서비스 화면 원본 크게 보기"><img src="images/projects/${p.slug}-cutout.png" alt="${esc(p.name)} 핵심 서비스 화면" fetchpriority="high"></a></div>`;
function docs(p) {
  return [
    {id:'research',name:'문제 정의 · 리서치',type:'발견',icon:'search',description:'문제의 배경, 검증할 가설과 리서치 질문을 정리합니다.',body:`<div class="paper-kicker">RESEARCH BRIEF</div><h3>문제에서 출발하는 기획</h3><p class="paper-lead">관찰한 문제와 확인이 필요한 가설을 구분합니다.</p><div class="paper-note"><b>살펴볼 문제</b><p>${esc(p.problem)}</p></div><h4>검증할 가설</h4><p>${esc(p.hypothesis)}</p><h4>리서치 질문</h4><ol class="paper-list"><li>사용자는 현재 이 일을 어떤 방법으로 해결하고 있나요?</li><li>어느 단계에서 가장 큰 어려움이나 반복 작업을 겪나요?</li><li>새로운 흐름이 기존 방법보다 나아졌다고 판단할 기준은 무엇인가요?</li></ol><div class="paper-empty"><span>리서치 결과</span>실제 인터뷰·설문 결과와 근거 자료가 들어갈 자리입니다.</div>`},
    {id:'requirements',name:'요구사항 정의서',type:'기획',icon:'layers',description:'기능의 범위와 우선순위, 완료 기준을 한눈에 확인합니다.',body:`<div class="paper-kicker">REQUIREMENTS SPECIFICATION</div><h3>무엇을 만들 것인가</h3><p class="paper-lead">기능별 요구사항과 확인 기준을 연결합니다.</p><div class="paper-table-wrap"><table class="paper-table"><caption class="sr-only">기능 요구사항</caption><thead><tr><th scope="col">ID / 기능</th><th scope="col">요구사항</th><th scope="col">우선순위</th></tr></thead><tbody><tr><th scope="row"><small>REQ-01</small>${esc(p.feature)}</th><td>${esc(p.requirement)}</td><td><span class="priority">필수</span></td></tr><tr><th scope="row"><small>REQ-02</small>입력값 검증</th><td>필수 항목과 입력 형식을 확인하고 수정 위치를 안내한다.</td><td><span class="priority">필수</span></td></tr><tr><th scope="row"><small>REQ-03</small>오류와 재시도</th><td>요청이 실패하면 입력 내용을 유지하고 재시도 방법을 제공한다.</td><td><span class="priority soft">중요</span></td></tr></tbody></table></div><h4>완료 기준</h4><ul class="paper-checks"><li>${esc(p.acceptance)}</li><li>정상·빈 상태·오류 상태의 동작을 확인한다.</li><li>핵심 행동을 키보드로도 수행할 수 있다.</li></ul>`},
    {id:'policy',name:'기능 명세서',type:'기획',icon:'layers',description:'기능별 동작 조건과 처리 방식, 예외 기준을 정리합니다.',body:`<div class="paper-kicker">FUNCTIONAL SPECIFICATION</div><h3>기능이 동작하는 기준</h3><p class="paper-lead">기능별 조건과 처리 방식, 예외 상황을 명확하게 정의합니다.</p><div class="paper-table-wrap"><table class="paper-table"><caption class="sr-only">기능 명세</caption><thead><tr><th scope="col">기능</th><th scope="col">동작 조건</th><th scope="col">처리 방식</th></tr></thead><tbody><tr><th scope="row">필수 정보 확인</th><td>필수 입력값이 비어 있거나 형식이 맞지 않을 때</td><td>해당 항목을 표시하고 수정 위치를 안내</td></tr><tr><th scope="row">중복 요청 방지</th><td>처리 중 동일 요청을 다시 실행할 때</td><td>중복 실행을 막고 진행 상태 표시</td></tr><tr><th scope="row">실패 재시도</th><td>요청 처리에 실패했을 때</td><td>입력 내용을 유지하고 재시도 방법 안내</td></tr><tr><th scope="row">권한 확인</th><td>허용 범위 밖의 기능에 접근할 때</td><td>제한된 동작을 막고 가능한 경로 안내</td></tr></tbody></table></div><div class="paper-note"><b>명세 적용 범위</b><p>실제 서비스의 권한, 상태, 데이터 보관 기준에 맞춰 기능별 동작을 구체화합니다.</p></div>`},
    {id:'flow',name:'IA · 유저플로우',type:'설계',icon:'flow',description:'메뉴의 구조와 사용자가 목표에 도달하는 흐름을 보여줍니다.',body:`<div class="paper-kicker">INFORMATION ARCHITECTURE & FLOW</div><h3>복잡한 과정을 명확한 흐름으로</h3><p class="paper-lead">화면의 관계와 핵심 행동을 함께 확인합니다.</p><h4>정보구조</h4><div class="ia-tree"><div class="ia-root">${esc(p.screens[0])}</div><div class="ia-branches">${[p.screens[1],p.screens[2],'내 정보 · 설정'].map(name=>`<div>${esc(name)}</div>`).join('')}</div></div><h4>핵심 사용자 흐름</h4><ol class="journey">${p.journey.map((step,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${esc(step)}</li>`).join('')}</ol><div class="paper-note"><b>예외 흐름도 함께 설계합니다.</b><p>입력 오류 → 해당 항목 수정 → 다시 확인<br>요청 실패 → 입력 내용 유지 → 재시도</p></div>`},
    {id:'wireframes',name:'화면 설계서',type:'설계',icon:'app',description:'핵심 화면의 정보 구조와 기능 배치를 확인합니다.',body:`<div class="paper-kicker">SCREEN DESIGN</div><h3>구조를 화면으로 구체화하기</h3><p class="paper-lead">핵심 화면의 정보 순서와 기능 배치를 확인합니다.</p><div class="wireframes ${p.cover==='web'?'wireframes-web':''}">${p.screens.map((screen,i)=>`<figure><div class="wire-device" aria-hidden="true"><div class="wire-top"><i></i><span>${String(i+1).padStart(2,'0')}</span></div><div class="wire-title"></div><div class="wire-subtitle"></div><div class="wire-block">${i===0?'콘텐츠 / 현황':i===1?'핵심 정보 / 입력':'결과 / 다음 행동'}</div><div class="wire-lines"><i></i><i></i><i></i></div><div class="wire-action">${i===0?'시작하기':i===1?'확인하기':'완료'}</div></div><figcaption><span>${String(i+1).padStart(2,'0')}</span> ${esc(screen)}</figcaption></figure>`).join('')}</div><h4>화면 설계 시 확인할 내용</h4><ul class="paper-checks"><li>화면별 목적과 주요 행동이 명확한가</li><li>정보 우선순위와 버튼의 위치가 일관적인가</li><li>빈 상태와 로딩·오류 상태까지 정의했는가</li></ul>`},
    {id:'validation',name:'QA · QC',type:'검증',icon:'spark',description:'기능과 화면이 의도대로 동작하는지 점검하고 개선 사항을 기록합니다.',body:`<div class="paper-kicker">QA & QC</div><h3>출시 전 품질을 점검하기</h3><p class="paper-lead">핵심 시나리오와 화면 상태를 확인하고 개선 사항을 정리합니다.</p><div class="paper-note"><b>점검 범위</b><p>${esc(p.hypothesis)}</p></div><h4>QA · QC 체크 시나리오</h4><ol class="paper-list"><li>시작 화면에서 원하는 기능을 찾을 수 있는지 확인합니다.</li><li>핵심 과업이 정상적으로 완료되는지 점검합니다.</li><li>빈 상태·오류 상태·권한 제한이 의도대로 안내되는지 확인합니다.</li><li>발견한 이슈를 우선순위에 따라 수정하고 다시 점검합니다.</li></ol><div class="validation-grid"><div><span>QA</span><b>기능이 정상 동작하는가</b><p>시나리오와 예외 상황 점검</p></div><div><span>QC</span><b>화면이 기준에 맞는가</b><p>문구·레이아웃·상태 확인</p></div></div>`}
  ];
}

const story = {
  research:{en:'Research',head:'문제에서 출발했습니다',desc:p=>p.problem,points:p=>['관찰한 문제와 확인이 필요한 가설을 구분했습니다','리서치 질문 3가지로 검증할 범위를 정했습니다']},
  requirements:{en:'Requirements',head:'유저의 니즈를 기반으로 어떤 기능을 만들지 정했습니다',desc:()=>'가설을 기능으로 옮기고, 기능마다 우선순위와 완료 기준을 붙였습니다.',points:p=>[`핵심 기능 — ${p.feature}`,`완료 기준 — ${p.acceptance}`]},
  policy:{en:'Functional Spec',head:'어떻게 동작할지 기능을 구체화했습니다',desc:()=>'기능별 동작 조건과 처리 방식, 예외 상황까지 빠짐없이 정의했습니다.',points:()=>['정상 흐름과 예외 흐름을 함께 설계했습니다','실패해도 입력한 내용은 사라지지 않도록 했습니다']},
  flow:{en:'IA & User Flow',head:'서비스의 뼈대와 흐름을 설계했습니다',desc:()=>'화면의 관계를 정리하고, 사용자가 목표에 닿는 가장 짧은 길을 그렸습니다.',points:p=>[p.journey.join(' → '),`IA — ${p.screens.join(' · ')}`]},
  wireframes:{en:'Screen Design',head:'화면으로 구체화했습니다',desc:()=>'핵심 화면의 정보 순서와 기능 배치를 정하고 실제 화면으로 옮겼습니다.',points:p=>p.screens.map((s,i)=>`${String(i+1).padStart(2,'0')} ${s}`)},
  validation:{en:'QA · QC',head:'출시 전 품질을 점검했습니다',desc:()=>'핵심 시나리오와 화면 상태를 확인하고, 발견한 이슈를 우선순위대로 개선했습니다.',points:()=>['QA — 기능이 정상 동작하는가','QC — 화면이 기준에 맞는가']}
};
function deliverables(p) {
  const cut = src => { const alt = src.replace(/-screens\.png$/, '-screens-cut.png'); return fs.existsSync(path.join(root, alt)) ? alt : src; };
  const shots = `<div class="dv-shots">${p.images.map(img => `<img src="${esc(cut(img.src))}" alt="${esc(img.alt)}" loading="lazy">`).join('')}</div>`;
  if (p.slug === 'ssok') {
    return ssokCase.map(doc => {
      let visual = doc.render(), subtitle = doc.subtitle || '';
      if (doc.subtitleFromLead) visual = visual.replace(/<p class="opportunity-lead">([\s\S]*?)<\/p>/, (_, copy) => { subtitle = copy; return ''; });
      return {subtitle, id: doc.id, type: doc.type, name: doc.name, head: doc.head, visual};
    });
  }
  const allDocs = docs(p);
  if (p.slug === 'koach') {
    const heads = {
      research: '상황과 관계에 맞는 실용 한국어 학습 수요를 확인했습니다',
      requirements: '유저의 니즈를 기반으로 어떤 기능을 만들지 정했습니다',
      policy: '어떻게 동작할지 기능을 구체화했습니다',
      flow: '서비스의 뼈대와 흐름을 설계했습니다'
    };
    allDocs.forEach(doc => { if (heads[doc.id]) doc.head = heads[doc.id]; });
    allDocs.splice(4, 0, {id:'wireframe',name:'와이어프레임',type:'설계',head:'핵심 화면의 구조와 동선을 와이어프레임으로 설계했습니다'});
    allDocs.splice(6, 0, {id:'data-guide',name:'데이터 적재 가이드',type:'데이터 설계',head:'데이터 분석을 위해\n측정할 행동과 지표를 정의했습니다'});
    allDocs.splice(8, 0, {id:'ut',name:'UT 기획',type:'검증',head:'사용자 경험을 검증할 과제와 기준을 설계했습니다'});
    allDocs.push({id:'backlog',name:'백로그 관리',type:'운영',head:'MVP 기능과 고도화 과제를 나누어 관리했습니다'});
  }
  return allDocs.map(doc => {
    const s = story[doc.id] || {en:doc.id === 'backlog' ? 'Backlog' : 'Data Guide',head:doc.head,desc:()=>'',points:()=>[]}, image = (p.docImages || {})[doc.id], custom = (p.documentDetails || {})[doc.id];
    const sourceUrl = (p.sourceUrls || {})[doc.id];
    const embedUrl = (p.embedUrls || {})[doc.id];
    const sourceLink = sourceUrl ? `<a class="document-source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener">원문 보기 <span aria-hidden="true">↗</span></a>` : '';
    const sourceEmbed = embedUrl ? `<div class="notion-embed"><iframe title="${esc(p.name)} ${esc(doc.name)} 노션 문서" src="${esc(embedUrl)}" loading="lazy" allowfullscreen></iframe></div>` : '';
    const iaTable = p.slug === 'koach' && doc.id === 'flow'
      ? `<div class="case-copy"><h4 class="table-section-title">IA · 정보구조</h4><div class="case-table-wrap"><table class="case-table ia-data-table"><caption class="sr-only">koach 정보구조와 화면 요구사항</caption><thead><tr>${koachIaCsv[0].map(head=>`<th scope="col">${esc(head)}</th>`).join('')}</tr></thead><tbody>${koachIaCsv.slice(1).map(row=>`<tr>${row.map((cell,index)=>`<${index===0?'th scope="row"':'td'}>${esc(cell)}<${index===0?'/th':'/td'}>`).join('')}</tr>`).join('')}</tbody></table></div></div>`
      : '';
    const koachJourneyMap = p.slug === 'koach' && doc.id === 'flow'
      ? koachUserFlow()
      : '';
    const koachWireframe = p.slug === 'koach' && doc.id === 'wireframe'
      ? `<figure class="koach-wireframe"><img src="images/projects/koach-wireframe.png" alt="koach 로그인, 회원가입, 채팅방, 보관함 와이어프레임" loading="lazy"><figcaption>로그인부터 대화·표현 보관까지, 핵심 화면의 정보 구조와 동선을 설계했습니다.</figcaption></figure>`
      : '';
    const koachScreenDesign = p.slug === 'koach' && doc.id === 'wireframes'
      ? `<div class="figma-panel"><iframe title="koach 화면 설계서" src="https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(sourceUrl)}" loading="lazy" allowfullscreen></iframe></div>`
      : '';
    const csvTable = (data, label, variant) => `<div class="case-table-wrap"><table class="case-table feature-data-table ${variant}"><caption class="sr-only">${label}</caption><thead><tr>${data[0].map(head=>`<th scope="col">${esc(head)}</th>`).join('')}</tr></thead><tbody>${data.slice(1).map(row=>`<tr>${row.map((cell,index)=>`<${index===0?'th scope="row"':'td'} data-label="${esc(data[0][index])}">${esc(cell)}<${index===0?'/th':'/td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const koachResearch = p.slug === 'koach' && doc.id === 'research' ? renderKoachResearch() : '';
    const koachRequirements = p.slug === 'koach' && doc.id === 'requirements'
      ? `<div class="case-copy"><div class="case-subsection"><h4>요구사항 정의</h4>${csvTable(koachRequirementsCsv,'koach 요구사항 정의','function-definition-table')}</div></div>`
      : '';
    const featureSpecs = p.slug === 'koach' && doc.id === 'policy'
      ? `<div class="case-copy"><div class="case-subsection"><h4>기능 상세 명세</h4>${csvTable(koachFeatureSpecCsv,'koach 기능 상세 명세','function-spec-table')}</div></div>`
      : '';
    const dataGuide = p.slug === 'koach' && doc.id === 'data-guide'
      ? `<div class="case-copy"><div class="case-subsection"><h4>이벤트 적재 기준</h4>${csvTable(koachDataGuideCsv,'koach 데이터 적재 가이드','data-guide-table')}</div></div>`
      : '';
    const qaScenarios = p.slug === 'koach' && doc.id === 'validation'
      ? `<div class="case-copy"><div class="case-subsection"><h4>QA 테스트 시나리오</h4>${csvTable(koachQaCsv,'koach QA 테스트 시나리오','qa-scenario-table')}</div></div>`
      : '';
    const koachUt = p.slug === 'koach' && doc.id === 'ut' ? renderKoachUt(sourceUrl) : '';
    const backlog = p.slug === 'koach' && doc.id === 'backlog'
      ? `<div class="case-copy"><div class="case-subsection"><h4>기능별 백로그</h4>${csvTable(koachBacklogCsv,'koach 기능별 백로그 관리','backlog-table')}</div></div>`
      : '';
    let visual = image
      ? `<div class="dv-originals">${(Array.isArray(image)?image:[image]).map((src,i)=>`<figure class="dv-original"><img src="${esc(src)}" alt="${esc(p.name)} ${esc(doc.name)} 원문 ${i+1}" loading="lazy"></figure>`).join('')}</div>`
      : koachScreenDesign ? koachScreenDesign
      : doc.id === 'wireframes' ? `${sourceLink}${shots}`
      : koachResearch ? koachResearch
      : koachRequirements ? koachRequirements
      : iaTable ? `${iaTable}${koachJourneyMap}`
      : koachWireframe ? koachWireframe
      : featureSpecs ? featureSpecs
      : dataGuide ? dataGuide
      : qaScenarios ? qaScenarios
      : koachUt ? koachUt
      : backlog ? backlog
      : embedUrl ? sourceEmbed
      : `<div class="dv-paper">${doc.body.replace(/^<div class="paper-kicker">[\s\S]*?<p class="paper-lead">[\s\S]*?<\/p>/, '')}</div>${sourceEmbed}`;
    let subtitle = '';
    if (p.slug === 'koach' && doc.id === 'research') {
      visual = visual.replace(/<p class="opportunity-lead">([\s\S]*?)<\/p>/, (_, copy) => { subtitle = copy; return ''; });
    }
    return {subtitle,id:doc.id,en:s.en,type:custom?.type||doc.type,name:custom?.name||doc.name,head:custom?.head||doc.head||s.head,desc:s.desc(p),points:s.points(p),visual};
  });
}
for (let index=0;index<projects.length;index++) {
  const p=projects[index], next=projects[(index+1)%projects.length], items=deliverables(p);
  const rich = ['koach', 'ssok'].includes(p.slug);
  const profileResults = p.highlights ? `<div class="profile-results"><dt>핵심 성과</dt><dd><ul>${p.highlights.map(item=>`<li>${esc(item).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</li>`).join('')}</ul></dd></div>` : p.slug === 'koach' ? `<div class="profile-results"><dt>핵심 성과</dt><dd><ul><li>사전 예약 2주간 <strong>354명</strong> 모집 · 사용자 <strong>282명</strong> 획득</li>${p.outcomes.map(item=>`<li>${esc(item.title)} <strong>${esc(item.before)} → ${esc(item.after)}</strong> <span>(${esc(item.change)})</span></li>`).join('')}</ul></dd></div>` : '';
  const projectProfile = p.projectProfile ? `<dl class="project-profile">${p.projectProfile.map(item=>`<div><dt>${esc(item.label)}</dt><dd>${esc(item.value)}</dd></div>`).join('')}${profileResults}</dl>` : '';
  const outcomeDetails = p.outcomes ? `<div class="outcome-comparisons" aria-label="핵심 성과 개선 전후">${p.outcomes.map(item=>`<article class="outcome-comparison"><div><h3>${esc(item.title)}</h3><p>${esc(item.action)}</p></div><div class="outcome-values"><div><small>개선 전</small><span>${esc(item.before)}</span></div><span class="outcome-arrow" aria-hidden="true">→</span><div><small>개선 후</small><strong>${esc(item.after)}</strong></div><b class="outcome-change">${esc(item.change)}</b></div></article>`).join('')}</div>` : '';
  for(const [key,url] of Object.entries(p.sourceUrls)) if(url && !/^https?:\/\//.test(url) && !/^documents\/[\w./-]+$/.test(url)) throw new Error(`Invalid source URL for ${p.id}/${key}`);
  const html=`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f4f5ff"><meta name="description" content="${esc(p.summary)} — 프로젝트 소개와 기획 산출물"><title>${esc(p.name)} — 유서정 Portfolio</title><link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/project.css"><link rel="stylesheet" href="css/services.css"><link rel="stylesheet" href="css/deliverables.css">${p.slug === 'koach' ? '<link rel="stylesheet" href="css/koach-deliverables.css"><link rel="stylesheet" href="css/koach-research.css"><link rel="stylesheet" href="css/koach-ut.css">' : p.slug === 'ssok' ? '<link rel="stylesheet" href="css/ssok-case.css"><link rel="stylesheet" href="css/ssok-extra.css">' : ''}<script src="js/project.js" defer></script></head>
<body class="project-page theme-${p.slug}"><a class="skip-link" href="#main">본문으로 건너뛰기</a>${icons}
<header class="project-header"><nav class="wrap project-nav" aria-label="프로젝트 메뉴"><a class="brand" href="index.html">seojeong<span class="brand-star">✳</span></a><a class="return-link" href="index.html#work">← <span>전체 프로젝트</span></a></nav></header>
<main id="main"><section class="project-hero wrap" aria-labelledby="project-title"><div class="project-heading"><div class="eyebrow"><span class="project-mark">—</span> PROJECT ${p.id}</div><div class="project-tags">${p.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><div class="service-name">${esc(p.name)}</div><h1 id="project-title">${p.title.split('\n').map(esc).join('<br>')}</h1><p>${esc(p.summary)}</p><dl class="project-facts">${rich ? `<div><dt>기간</dt><dd>${esc(p.period)}</dd></div><div><dt>역할</dt><dd>${esc(p.role)}</dd></div><div><dt>기여도</dt><dd>${esc(p.contribution)}</dd></div>` : `<div><dt>ROLE</dt><dd>${esc(p.role)}</dd></div><div><dt>PERIOD</dt><dd>${esc(p.period)}</dd></div><div><dt>CONTRIBUTION</dt><dd>${esc(p.contribution||"정리 중")}</dd></div><div><dt>STATUS</dt><dd>${esc(p.result)}</dd></div>`}</dl>${rich ? projectProfile : ''}${rich ? '' : `<a class="project-deliverables-link" href="#deliverables">기획 산출물 보기 ${arrow}</a>`}</div><div class="project-art" aria-label="프로젝트 ${p.id} 대표 이미지">${serviceGallery(p)}${rich ? '' : `<span class="art-caption">${esc(p.name)} · SERVICE SCREENS / 이미지를 누르면 크게 볼 수 있어요</span>`}</div></section>
<nav class="project-tabs" aria-label="상세 페이지 목차"><div class="wrap"><a href="#overview" aria-current="location">프로젝트 소개</a><a href="#deliverables">기획 산출물 <span>${String(items.length).padStart(2,'0')}</span></a><a href="#reflection">성과 · 회고</a></div></nav>
<section class="project-section wrap" id="overview" aria-labelledby="overview-title"><div class="section-caption"><div class="eyebrow">01 / OVERVIEW</div></div><div class="overview-heading"><h2 id="overview-title">어떤 문제를, 어떻게 풀고자 했는지.</h2><p>${esc(p.overview)}</p></div>${rich ? '' : projectProfile}<div class="overview-cards"><article><h3><span class="card-num">01</span>발견한 문제</h3><p>${esc(p.problem)}</p></article><article><h3><span class="card-num">02</span>검증할 가설</h3><p>${esc(p.hypothesis)}</p></article><article><h3><span class="card-num">03</span>설계 방향</h3><p>${esc(p.direction)}</p></article></div></section>
<section class="documents-section" id="deliverables" aria-labelledby="deliverables-title"><div class="wrap"><div class="documents-heading"><div><div class="eyebrow">02 / DELIVERABLES</div><h2 id="deliverables-title">서비스가 되기까지, 기획의 과정.</h2><p>문제 정의부터 출시까지, 서비스를 만들며 거친 순서대로 담았습니다.</p></div><span class="document-total">${items.length}개의 문서</span></div><div class="document-workspace"><nav class="document-menu" aria-label="기획 산출물 목차"><div class="document-menu-title">DOCUMENT INDEX</div>${items.map((d,i)=>`<a href="#doc-${d.id}" class="document-choice${i===0?' is-selected':''}" data-document="${d.id}"${i===0?' aria-current="true"':''}><span class="document-index">${String(i+1).padStart(2,'0')}</span><span><b>${esc(d.name)}</b><small>${esc(d.type)}</small></span><span class="document-choice-arrow" aria-hidden="true">↗</span></a>`).join('')}</nav><div class="document-stream">${items.map((d,i)=>`<article class="document-viewer doc-step" id="doc-${d.id}" aria-labelledby="doc-${d.id}-title"><div class="doc-step-head"><div class="deliv-num">${String(i+1).padStart(2,'0')} · ${esc(d.name)}</div><h3 id="doc-${d.id}-title">${esc(d.head)}</h3>${d.subtitle ? `<p class="doc-subtitle">${esc(d.subtitle)}</p>` : ''}</div><div class="document-canvas">${d.visual}</div></article>`).join('')}</div></div></div></section>
<section class="project-section wrap retro-section" id="reflection" aria-labelledby="reflection-title"><div class="section-caption"><div class="eyebrow">03 / RETROSPECTIVE</div></div><div class="retro-top"><div class="retro-title"><h2 id="reflection-title">성과 및 회고</h2><p>${esc(p.resultDetail)}</p></div><div class="retro-stats">${p.stats.filter(s=>s.label!=='프로젝트 기여도').slice(0,2).map(s=>`<div class="retro-stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div></div>${outcomeDetails}${p.retrospectiveImage?`<figure class="retro-original"><img src="${esc(p.retrospectiveImage)}" alt="${esc(p.name)} 프로젝트 회고 원문" loading="lazy"></figure>`:''}<div class="retro-learn"><h3>배운 점</h3>${(p.learnings||[]).length?`<div class="overview-cards">${p.learnings.map((l,i)=>`<article><h3><span class="card-num">${String(i+1).padStart(2,'0')}</span>${esc(l.title)}</h3><p>${esc(l.text)}</p></article>`).join('')}</div>`:`<p class="retro-empty">이 프로젝트에서 배운 점과 다음에 시도할 것을 정리하고 있어요.</p>`}</div></section>
<div class="wrap project-bottom-nav"><a href="index.html#work">← 전체 프로젝트</a><a href="work-${next.id}.html" class="next-project"><span>다음 프로젝트 <b>${esc(next.name)} · ${esc(next.category)}</b></span>${arrow}</a></div></main>
<footer class="site-footer wrap"><a class="brand" href="index.html">seojeong<span class="brand-star">✳</span></a><span>© 2026 Yu Seojeong</span><a class="back-to-top" href="#main">Back to top ↑</a></footer>
</body></html>`;
  fs.writeFileSync(path.join(root,`work-${p.id}.html`),html);
}
console.log(`Generated ${projects.length} project pages.`);

// 쏙은 koach 산출물 레이아웃을 그대로 쓰되, 보라 계열 색을 쏙 블루 계열로 회전해 생성한다.
{
  const rotate = hex => {
    const h = hex.slice(1), full = h.length <= 4 ? [...h].map(c => c + c).join('') : h;
    let [r, g, b] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
    const alpha = full.length === 8 ? full.slice(6) : '';
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return hex;
    const d = max - min, s = l > .5 ? d / (2 - max - min) : d / (max + min);
    let hue = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hue *= 60;
    if (hue < 240 || hue > 300) return hex;
    hue -= 30;
    const k = n => (n + hue / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return '#' + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('') + alpha;
  };
  const koachCss = ['koach-deliverables', 'koach-research', 'koach-ut']
    .map(name => fs.readFileSync(path.join(root, `css/${name}.css`), 'utf8')).join('\n');
  const ssokCss = '/* 자동 생성: scripts/build-projects.js — koach-*.css를 쏙 테마로 변환. 직접 수정하지 마세요. */\n'
    + koachCss.replace(/theme-koach/g, 'theme-ssok').replace(/#[0-9a-fA-F]{3,8}\b/g, rotate);
  fs.writeFileSync(path.join(root, 'css/ssok-case.css'), ssokCss);
}

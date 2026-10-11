// Independent personal-study pages; does not rebuild or modify the main projects.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const studyLayout = require('./study-layout');
const serviceAnalyses = require('./service-analysis-pages');
const iroUrl = 'https://melodic-weather-784.notion.site/2ee9b5c9498981ffb8a2c37d118812fe?pvs=73';
const petUrl = 'https://melodic-weather-784.notion.site/2ee9b5c9498981b0ae51c49395cb9d3d?pvs=73';
const pdfUrl = 'https://drive.google.com/file/d/1szINwHpvgSxJuSBK33ByL_w2BBQgFuZ0/view?usp=sharing';
const link = (url, label) => `<a href="${url.replaceAll('&', '&amp;')}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const table = (headers, rows, label) => `<div class="note-table-wrap"><table class="note-table" aria-label="${label}"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const panel = (title, text) => `<section class="note-panel"><h4>${title}</h4><p>${text}</p></section>`;
const flow = items => `<ol class="note-flow">${items.map(([title, text])=>`<li><strong>${title}</strong>${text}</li>`).join('')}</ol>`;
const step = (n, title, why, content) => `<article class="doc-step" id="step-${n}" aria-labelledby="step-title-${n}"><header class="doc-step-head"><div class="deliv-num">${String(n).padStart(2,'0')} · ${title}</div><h3 id="step-title-${n}">${why}</h3></header><div class="document-canvas note-copy">${content}</div></article>`;
const shell = (title, description, content, detail=false) => detail ? studyLayout(title, description, content) : `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${description}"><title>${title} — 유서정</title><link rel="stylesheet" href="css/style.css">${detail?'<link rel="stylesheet" href="css/project.css"><link rel="stylesheet" href="css/deliverables.css">':''}<link rel="stylesheet" href="css/home-resume.css"><link rel="stylesheet" href="css/planning-notes.css"><link rel="stylesheet" href="css/soft-ui.css"></head>
<body id="page-top" class="resume-home notes-page${detail?' project-page notes-detail':''}"><a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="site-header"><nav class="site-nav" aria-label="주 메뉴"><a class="brand" href="index.html">seojeong<span class="brand-star">✳</span></a><div class="nav-links"><a href="index.html">Home</a><a href="index.html#about">About</a><a href="index.html#work">Projects</a><a href="notes.html" aria-current="page">Study</a></div><a class="resume-contact" href="index.html#contact">Contact <span aria-hidden="true">↗</span></a></nav></header><main class="wrap" id="main">${content}</main><footer class="wrap notes-footer"><a href="${detail?'notes.html':'index.html'}">← ${detail?'Study':'이력서로'}</a><a href="#page-top">상단으로 ↑</a></footer></body></html>`;

const index = shell('기획 노트', '개인 프로젝트와 서비스 분석. 불편에서 출발해 서비스의 흐름과 운영 기준을 설계한 기록.', `
<div class="wrap">
<header class="notes-intro"><p class="notes-kicker">Study</p><h1>직접 기획하고, 서비스를 살펴본 기록.</h1></header>
<nav class="notes-tabs" aria-label="기획 노트 분류"><a href="#personal">Personal Projects</a><a href="#analysis">Service Analysis</a></nav>
<section class="notes-section personal-collection" id="personal" aria-labelledby="personal-title"><div class="personal-collection-heading"><h2 id="personal-title">Personal Projects</h2><span>02 projects</span></div><div class="note-list">
<article class="note-card"><div class="note-card-index"><span>01</span><span>2025.09</span></div><a class="note-cover" href="study-irocom.html" aria-label="이로콤 기획 산출물 보기"><img src="images/projects/irocom-cover.png" alt="이로콤 기획서 첫 페이지" width="1920" height="1080"></a><div class="note-card-body"><p class="notes-kicker">AI 서비스 · 상위 기획</p><h3>이로콤<span>중고거래 사기 신고 도우미</span></h3><p>증거 정리부터 신고 준비까지, AI의 역할과 사용자 흐름 설계</p><a class="resume-artifact-link" href="study-irocom.html">기획 산출물 보기 <span aria-hidden="true">↗</span></a></div></article>
<article class="note-card"><div class="note-card-index"><span>02</span><span>2024.05</span></div><a class="note-cover" href="study-petfriends.html" aria-label="펫프렌즈 기획 산출물 보기"><img src="images/projects/petfriends-cover.png" alt="펫프렌즈 기획서 첫 페이지" width="1600" height="900"></a><div class="note-card-body"><p class="notes-kicker">서비스 확장 · 상위 기획</p><h3>펫프렌즈<span>쇼핑에서 동네 돌봄으로</span></h3><p>전문 시터와 이웃을 연결하는 매칭·결제·정산·보상 정책 설계</p><a class="resume-artifact-link" href="study-petfriends.html">기획 산출물 보기 <span aria-hidden="true">↗</span></a></div></article>
</div></section>
</div><div class="notes-analysis-background"><div class="wrap">${serviceAnalyses.list}</div></div>`)
  .replace('<main class="wrap" id="main">','<main id="main">')
  .replace('<div class="notes-analysis-background">','</main><div class="notes-analysis-background">')
  .replace('</div></div></main><footer','</div><footer')
  .replace('</footer></body>','</footer></div></body>');

const iroSteps = [
step(1,'문제 정의','피해 이후의 막막함을, 증거 정리와 신고 절차의 문제로 나눴습니다.',`
<p>중고거래 사기를 직접 겪으며 증거를 모으고, 신고서를 쓰고, 제출할 곳을 찾는 과정의 부담을 경험했습니다. 실제 피해자 대상 설문을 통해 ‘증거 정리의 어려움’과 ‘신고 절차의 복잡성’을 확인하고, 신고를 준비하는 과정을 돕는 AI 서비스로 구체화했습니다.</p>
<div class="note-grid" style="margin-top:20px">${panel('무엇부터 해야 할지 모름','신고 경로마다 준비 항목과 절차가 달라, 피해 직후 혼란스러운 상태에서 정보를 다시 찾아야 합니다.')}${panel('증거가 있어도 문서로 정리하기 어려움','대화·송금 내역·계좌 정보가 흩어져 있고, 익숙하지 않은 신고 양식에 맞춰 사건을 설명해야 합니다.')}</div>
<p class="note-caveat">개인 기획 프로젝트입니다. 원문의 시장 수치와 기대 효과는 검증된 출시 성과로 제시하지 않았습니다.</p>`),
step(2,'페르소나 · 사용자 여정','신고 경험이 적은 사용자가 어느 단계에서 막히는지 정리했습니다.',`
<div class="note-grid">${panel('이상혁 · 33세','유사사례와 신고 방법을 찾아 온라인 접수를 시도하지만, 생소한 문서 작성과 보완 요청에 어려움을 겪는 사용자. 필요한 것은 상황별 절차 안내와 사건 내용의 구조화입니다.')}${panel('류민석 · 22세','경찰서에 방문했지만 증거가 부족해 다시 준비하는 사용자. 필요한 것은 방문 전 증거 체크리스트와 문서 예시, 이후 과정에 대한 안내입니다.')}</div>
${table(['단계','사용자의 고민','기획 대응'],[
['정보 탐색','경찰서·온라인·플랫폼 중 어디에 신고해야 할까?','상황과 신고 경로에 맞는 단계별 준비 안내'],
['사례 확인','비슷한 피해는 어떻게 대응했을까?','유사사례의 핵심 증거·진행 과정·출처 정리'],
['신고 준비','어떤 내용과 자료가 빠졌을까?','필수 정보 입력과 증거 정리, 문서 생성 연결']],'이로콤 사용자 여정')}`),
step(3,'요구사항 · MVP 범위','정보를 찾는 데서 끝나지 않고 신고 준비까지 이어지도록 기능을 묶었습니다.',
table(['핵심 기능','입력·사용 맥락','기획한 처리'],[
['신고 절차 가이드','사용자의 상황과 선택한 신고 경로','경로별 단계·준비 자료·주의사항 안내'],
['AI 맞춤 상담','언제·어디서·누구에게·얼마를·어떻게 피해 입었는지와 증거','피해 유형과 필요한 증거 정리, 신고 경로 제안. OCR로 날짜·금액·계좌 정보 추출하는 방식 구상'],
['AI 신고 문서 생성','육하원칙으로 구조화한 사건 정보','신고 경로별 템플릿에 맞춰 초안 생성, PDF·DOCX 다운로드 구상'],
['AI 유사사례 참조','사건 정보와 사례 데이터','유사도 기반 상위 5개 사례를 핵심 증거·진행 기간·결과·출처와 함께 제시']],'이로콤 MVP 요구사항')),
step(4,'정보 구조 · 사용자 흐름','흩어진 정보를 다시 입력하지 않도록 하나의 신고 준비 흐름으로 연결했습니다.',`
${flow([['피해 정보 입력','거래 내역·상황과 증거 자료 업로드'],['AI 분석','피해 유형과 필요한 자료, 신고 경로 안내'],['유사사례 확인','대응 과정·제출 증거·출처 참고'],['문서 생성','구조화된 정보로 신고 문서 초안 작성']])}
${table(['화면 영역','주요 정보·행동'],[['피해 정보·증거','사건 정보 입력, 대화·송금 내역 업로드'],['신고 안내','신고 경로별 절차와 필요한 자료 확인'],['사례 참조','유사사례 요약과 원문 출처 확인'],['문서 작성','진정서·진술서 초안 확인 및 다운로드']],'이로콤 정보 구조')}
<p class="note-caveat">원문에 기술한 기능과 사용자 프로세스를 바탕으로 재구성한 정보 구조입니다. 자동 신고 접수나 법률 판단의 정확성이 검증된 구현으로 표현하지 않았습니다.</p>`),
step(5,'AI 역할 · 실행 구조','하나의 프롬프트에 몰렸던 역할을 나누고, 호출 조건을 설계했습니다.',`
<p>초기에는 여러 명령을 한 프롬프트에 넣으면서 역할이 섞이고 실행 흐름이 불안정해졌습니다. Supervisor–Agent 구조를 학습하고, 에이전트별 역할·입력·출력·실행 조건을 구분하는 방향으로 재설계했습니다.</p>
${flow([['사용자 입력','피해 상황과 증거가 들어오는 시점'],['Supervisor','입력에 따라 필요한 역할 호출'],['역할별 처리','분석·사례 참조·문서 생성 기능 분리'],['결과 연결','다음 단계에서 사용할 정보로 정리']])}
<ul><li>‘언제 어떤 Agent를 실행하는가’를 사용자 입력 시점과 연결해 문서화</li><li>프롬프트·입력값을 저장할 데이터 구조와 필요한 컬럼 설계 연습</li><li>데이터셋, 프롬프트 입력값, 실행 시점을 함께 시뮬레이션</li></ul>`),
step(6,'개인 회고','AI가 해줄 일을 나열하는 것에서, 동작할 조건을 설계하는 쪽으로 옮겨갔습니다.',`
${table(['배운 점','시행착오','다음 기획에 적용할 기준'],[
['역할을 나누는 AI 설계','Supervisor 구조를 뒤늦게 이해해 초기 설계를 반복 수정','기획 초기에 역할·입출력·실행 시점을 구조도로 정리'],
['웹 정보 배치','앱과 다른 해상도·반응형 구조 때문에 레이아웃 수정','초기부터 화면 규격·그리드·반응형 기준 검토'],
['구현 가능성 검토','프롬프트와 데이터 저장, 실행 조건을 함께 그리지 못함','기능 제안과 동시에 기술 흐름·데이터 구조 검토']],'이로콤 회고')}
<p>출발점은 제가 겪은 불편이었지만, 기획을 구체화할수록 중요한 질문은 달라졌습니다. ‘AI가 할 수 있을까?’에서 ‘어떤 정보를 받아, 언제 실행하고, 무엇을 다음 단계에 전달해야 할까?’로요.</p>`)
].join('');
const iro = shell('이로콤 · 개인 프로젝트','사기 피해 이후 증거 수집부터 신고 문서 작성까지 돕는 AI 서비스 개인 기획안.',`
<header class="notes-intro"><p class="notes-kicker">개인 프로젝트 · AI 서비스 기획</p><h1>이로콤<br>피해 이후의 막막함을, 다음 행동으로.</h1><p>증거 정리부터 신고 문서 생성까지 연결하는 AI 직거래 사기 신고 도우미 기획안</p><div class="notes-meta"><span>개인 기획 · 웹 서비스</span><span>문제 정의 / MVP / AI 구조 설계</span></div><div class="notes-sources">${link(iroUrl,'기획 원문')}</div></header>
<nav class="notes-tabs" aria-label="페이지 목차"><a href="#deliverables">기획 산출물</a><a href="#step-6">회고</a></nav><section id="deliverables" aria-label="이로콤 기획 산출물"><div class="document-stream">${iroSteps}</div></section>`,true);

const petSteps = [
step(1,'문제 정의 · 서비스 확장','반려용품 구매 이후에도 남는 돌봄의 공백에 주목했습니다.',`
<p>펫프렌즈의 커머스를 반려생활 전반으로 확장하는 개인 제안입니다. 출장·야근·여행 때 믿고 맡길 사람을 구하기 어렵다는 문제에서 출발해, 동네 기반 방문·위탁 돌봄 서비스를 기획했습니다.</p>
<div class="note-grid" style="margin-top:20px">${panel('바쁠 때 믿고 맡길 사람이 필요함','공고마다 경험·자격·가격 정보를 따로 확인해야 하고, 노령견이나 투약처럼 구체적인 돌봄 조건을 비교하기 어렵습니다.')}${panel('매번 지인에게 부탁하기 어려움','낯선 시설에 대한 반려동물의 스트레스와 비용 부담 때문에 지인을 찾지만, 부탁이 반복되면 관계에도 부담이 생깁니다.')}</div>
<p class="note-caveat">펫프렌즈의 공식 출시 기능이나 실제 운영 정책이 아닌 개인 서비스 확장 제안입니다. 정책 수치와 보상 한도는 기획 당시의 제안값입니다.</p>`),
step(2,'서비스 컨셉 · 매칭 구조','전문성과 가까운 이웃의 접근성을 함께 고려했습니다.',`
<div class="note-grid">${panel('전문 시터 풀','자격·교육·검증을 완료한 인력. 목적과 반려동물 상태에 맞는 전문성을 선택할 수 있도록 설계했습니다.')}${panel('이웃 시터 풀','전문 자격이 없더라도 기본 안전교육과 신원 검증, 평판으로 신뢰를 보완하는 구조입니다. 원 기획의 품앗이 모델은 이웃 간 상호 돌봄 교환을 지향합니다.')}</div>
${table(['매칭 방식','제안한 동작'],[['자동 이중 매칭','전문 시터 매칭 실패 시 이웃 시터 후보군 제안'],['실시간 매칭 지도','반경 1~3km 내 즉시 가능한 시터 표시'],['긴급 돌봄 모드','‘지금 필요해요’ 선택 시 즉시 응답 가능한 시터 우선 노출']],'펫프렌즈 매칭 방식')}
<p class="note-caveat">유료 돌봄과 품앗이 교환의 결제·정산 경계, 실제 공급 가능 범위는 운영 전 추가 검증이 필요한 항목입니다.</p>`),
step(3,'사용자 흐름 · 정보 구조','보호자·시터·운영자의 행동이 예약 이후에도 이어지도록 설계했습니다.',`
${flow([['요청·탐색','반려동물 상태와 돌봄 업무 입력, 시터 후보 비교'],['예약·선결제','조건 확인 후 앱 결제로 예약 확정'],['돌봄·기록','돌봄 수행과 일지·소통을 통한 상태 확인'],['완료·정산','완료 확정 또는 자동 확정 후 수수료 차감 정산']])}
${table(['역할','핵심 정보·행동'],[['보호자','공고 작성, 후보 비교, 결제, 돌봄 일지 확인, 완료 확정, 후기'],['시터','경험·자격과 자기소개, 지원·예약, 돌봄 수행·일지, 정산 확인'],['운영자','교육·신원 검증, 자격 레벨 관리, 취소·분쟁·제재·보상 검토']],'펫프렌즈 역할별 정보 구조')}
<p class="note-caveat">원 기획의 역할과 프로세스를 정리한 구조입니다. 자동 확정까지의 시간 및 이의 제기 절차는 제공된 정책에서 확정되지 않았습니다.</p>`),
step(4,'결제 · 정산 · 취소 정책','예약을 확정하는 조건과 취소 주체별 금액 처리를 나눴습니다.',`
<ul><li><strong>선결제:</strong> 앱에서 사전 결제를 완료한 예약만 확정</li><li><strong>에스크로 보관:</strong> 플랫폼이 결제 금액을 보관하고 서비스 완료 확정 또는 자동 확정 시 정산</li><li><strong>정산:</strong> 중개 수수료를 차감한 나머지 금액을 시터에게 지급</li></ul>
${table(['취소 조건','이용자 환불','시터 정산·조치'],[['이용자 · 시작 24시간 전까지','100% 전액 환불','해당 건 정산 없음'],['이용자 · 시작 24시간 이내','결제 금액 50% 환불','나머지 50%를 시터 정산금으로 지급'],['이용자 · 돌봄 시작 후','환불 불가','완료·정산 정책에 따른 처리'],['시터 · 일방 취소 또는 노쇼','전액 환불','해당 건 정산 0원 및 패널티'],['시터 · 반복 위반','귀책 예약 전액 환불','정산 제한·활동 정지·계정 해지 등 단계적 제재']],'취소 및 환불 정책')}
<p class="note-caveat">제공된 정책의 ‘24시간 전까지’와 ‘24시간 이내’는 경계가 겹칩니다. 정확히 24시간 전 취소의 적용 기준은 구현 전에 확정해야 합니다.</p>`),
step(5,'신뢰 · 자격 · 패널티 · 보상','믿을 수 있다는 설명을, 확인 가능한 자격과 운영 기준으로 바꿨습니다.',`
<h4>시터 자격 레벨</h4>
${table(['레벨','자격 조건'],[['Lv.1 베이직','기본 안전교육 수료 + 신원 검증. 대학생·반려 경험자 등'],['Lv.2 인증','관련 자격증 보유 또는 플랫폼 자체 교육 수료'],['Lv.3 전문','수의사·수의대생·행동교정사 등 전문 자격 보유자']],'시터 자격 레벨')}
<p>매칭 시 레벨을 사용자에게 명시해 돌봄 목적에 맞는 선택을 돕는 안입니다.</p>
<h4>시터 패널티</h4><ul><li>귀책 예약 건의 정산금은 0원 처리</li><li>위반 사안에 따라 5,000~10,000원의 추가 차감액을 이후 정산 건에서 공제</li><li>검색·노출 순위 하락, 일정 기간 예약 제한</li><li>1회 경고 → 2회 일정 기간 활동 정지 → 3회 누적 계정 해지</li><li>선택안: 시터 등록 시 보증금을 예치하고 위반 시 공제</li></ul>
<h4>안전 보상 프로그램 · 제안 한도</h4>
${table(['항목','지원 범위'],[['검사비','최대 20만 원 · 1회'],['치료비','최대 40만 원 · 회당 20만 원, 2회 한도'],['입원비','최대 10만 원'],['장례비','최대 30만 원'],['펫시터 부상','최대 10만 원'],['법률 자문','변호사 자문 지원'],['사망','지정 병원 부검 후 최대 300만 원'],['실종','수색 비용 포함 최대 200만 원']],'안전 보상 프로그램 제안')}
<p>우발적 사고에 한해 적용하며, 과실·사전 고지 누락은 제외하는 안으로 정리했습니다.</p>
<h4>공고·지원자 작성 기준</h4><div class="note-grid">${panel('시터 지원','반려동물 관련 경험·자격을 필수 기재합니다. 연락 신속성·시간 엄수·책임감 등 신뢰 요소를 구체적으로 설명하고, 자기소개는 100자 내외로 작성하도록 안내합니다.')}${panel('보호자 공고','반려동물 특성·습관·건강 상태와 요청 업무(산책·배식·투약·위생)를 구체적으로 작성합니다. 주의사항을 사전 안내하고 좋아하는 활동도 함께 기재합니다.')}</div>
<p class="note-caveat">레벨별 허용 업무, ‘과실’의 판단 주체·범위, 보상 항목 간 중복 지급 여부, 보험·법률 적합성 및 비용 구조는 검증 전입니다. 실제 보장이나 자격 인증을 약속하는 안내가 아닙니다.</p>`),
step(6,'목표 지표 · 개인 회고','돌봄 연결뿐 아니라 다시 이용할 이유와 운영 리스크를 함께 고민했습니다.',`
${table(['검증하고 싶은 것','기획안의 목표·관찰 지표'],[['지속 이용','커뮤니티 이용 고객의 3개월 내 돌봄 재이용률 25% 목표'],['신뢰 정보 축적','리뷰 작성률 30% 목표'],['매칭 품질','유입률·매칭 전환율·재이용 고객 비율·평균 재이용 횟수·리뷰 내 긍정 비율']],'돌봄 서비스 목표 지표')}
<p class="note-caveat">모두 기획 단계의 목표이며 측정된 성과가 아닙니다.</p>
<h4>운영까지 그려 보며 남은 질문</h4><ul><li>정책–프로세스–IA를 연결하며 ‘신뢰’를 결제·자격·리뷰·보상 기준으로 구체화</li><li>실제 결제·정산 API와 보험 연동, 운영 리스크·비용 시뮬레이션은 미검증</li><li>예약 겹침·사고 발생 등 예외와 운영자·시터·보호자 간 책임 범위는 추가 설계 필요</li><li>다음 단계: 파트너 운영·어드민·정산 자동화 흐름과 후기 기반 추천 구조 검토</li></ul>`)
].join('');
const pet = shell('펫프렌즈 돌봄 서비스 · 개인 프로젝트','전문 시터와 이웃을 연결하는 지역 기반 돌봄 서비스 개인 기획안. 매칭부터 정산과 보상까지.',`
<header class="notes-intro"><p class="notes-kicker">개인 프로젝트 · 서비스 확장 제안</p><h1>펫프렌즈<br>사는 곳에서, 믿고 맡기는 곳으로.</h1><p>반려용품 커머스에서 동네 기반 방문·위탁 돌봄으로 확장하는 서비스 기획안</p><div class="notes-meta"><span>2024.05 · 기획 / UX·UI 100%</span><span>개인 제안 · 미출시</span></div><div class="notes-sources">${link(petUrl,'기획 원문')}${link(pdfUrl,'기획서 PDF')}</div></header>
<nav class="notes-tabs" aria-label="페이지 목차"><a href="#deliverables">기획 산출물</a><a href="#step-4">운영 정책</a><a href="#step-6">회고</a></nav><section id="deliverables" aria-label="펫프렌즈 기획 산출물"><div class="document-stream">${petSteps}</div></section>`,true);
for (const [file, html] of [['notes.html', index], ['study-irocom.html', iro], ['study-petfriends.html', pet], ...serviceAnalyses.pages(shell)]) fs.writeFileSync(path.join(root, file), html+'\n');
for (const [file, svg] of require('./analysis-diagrams')()) {
  fs.mkdirSync(path.dirname(path.join(root,file)), {recursive:true});
  fs.writeFileSync(path.join(root,file),svg+'\n');
}
console.log('Built planning notes, 2 personal projects and 17 service analyses');

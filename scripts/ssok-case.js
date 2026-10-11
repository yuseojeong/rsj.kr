// 쏙 산출물: 포트폴리오 원본 슬라이드(images/projects/ssok-*.png)에 적힌 수치와 문구만 사용한다.
const table = (label, heads, rows, variant = '') => `<div class="case-table-wrap"><table class="case-table feature-data-table ${variant}"><caption class="sr-only">${label}</caption><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row" data-label="${heads[i]}">${cell}</th>` : `<td data-label="${heads[i]}">${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const evidence = (src, alt, caption) => `<figure class="ssok-evidence"><a href="${src}" target="_blank" rel="noopener" aria-label="${alt} 크게 보기"><img src="${src}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
const section = (title, body) => `<div class="case-subsection"><h4>${title}</h4>${body}</div>`;
const ring = (id, value, display, caption) => `<div class="finding-ring" role="img" aria-label="${caption} ${display.replace(/<[^>]*>/g, '')}"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a9b4fb"/><stop offset="1" stop-color="#4d5fe9"/></linearGradient></defs><circle class="ring-track" cx="100" cy="100" r="83"/><circle class="ring-value" cx="100" cy="100" r="83" pathLength="100" stroke="url(#${id})" stroke-dasharray="${value} 100" transform="rotate(-90 100 100)"/></svg><div class="ring-label"><span>${caption}</span><strong>${display}</strong></div></div>`;

function research() {
  const pains = [['어디로 보냈는지 기억이 안 남', 70.6], ['채팅에 묻혀 찾기 힘듦', 56.8], ['다른 여러 콘텐츠와 혼재', 35.8], ['검색 제한 및 식별 어려움', 29.7]];
  return `<div class="research-editorial">
<p class="opportunity-lead">저장한 링크를 다시 찾고 함께 활용하기 어려운 이유를 사용자 설문으로 살펴봤습니다.</p>
    <dl class="study-meta"><div><dt>조사 방식</dt><dd>사용자 설문 · 경쟁 서비스 분석</dd></div><div><dt>참여자</dt><dd>총 <b>50명</b> · n=50</dd></div><div><dt>대상</dt><dd>여럿이 함께 링크를 저장·공유해 본 사용자</dd></div></dl>
    <div class="research-section-label"><span>설문에서 발견한 세 가지 단서</span><small>01 — 03</small></div>
    <div class="research-findings">
      <section class="research-finding" aria-labelledby="ssok-finding-sns"><div class="finding-index"><span>01</span> 흩어진 저장 위치</div><h4 id="ssok-finding-sns">함께 모은 콘텐츠는<br><strong>대부분 SNS 대화 속에 저장된다</strong></h4>
        ${ring('ssok-sns-ring', 74.8, '74.8<small>%</small>', 'SNS에 저장하는 비율')}
        <p class="finding-evidence">콘텐츠를 저장할 때 <b>74.8%가 SNS를 활용</b>했고, 협업 시 링크를 카카오톡·인스타그램·디스코드 등 SNS에 저장하는 비율도 <b>68.1%</b>였습니다.</p>
      </section>
      <section class="research-finding" aria-labelledby="ssok-finding-find"><div class="finding-index"><span>02</span> 재탐색의 어려움</div><h4 id="ssok-finding-find">저장은 했지만<br><strong>필요한 순간에 다시 찾기 어렵다</strong></h4>
        <div class="ssok-pain-bars" role="img" aria-label="SNS에서 저장한 콘텐츠를 다시 찾을 때 불편한 점">${pains.map(([label, value]) => `<div class="ssok-pain"><span>${label}</span><div class="ssok-pain-track"><i style="width:${value}%"></i></div><b>${value}%</b></div>`).join('')}</div>
        <p class="finding-evidence">SNS에 저장한 콘텐츠를 다시 찾을 때 <b>70.6%가 “어디로 보냈는지 기억이 안 난다”</b>고 답했습니다.</p>
      </section>
      <section class="research-finding" aria-labelledby="ssok-finding-together"><div class="finding-index"><span>03</span> 함께 쓰는 공간의 부재</div><h4 id="ssok-finding-together">여럿이 함께<br><strong>저장하고 이야기할 곳이 없다</strong></h4>
        <div class="ssok-quote-card"><p>“왜 여럿이서 링크를 저장할 수 있는 곳이 없지?”</p><div class="expression-samples" aria-hidden="true"><span>#콘텐츠 분류</span><span>#중요한 콘텐츠 선별</span><span>#링크별 소통</span></div></div>
        <p class="finding-evidence">여행 계획처럼 여럿이 링크를 모을 때 <b>함께 저장하고 쉽게 찾을 수 있는 아카이빙 공간이 없다</b>는 점을 문제로 인식했습니다.</p>
      </section>
    </div>
    <p class="study-source">출처: 쏙 사용자 설문 · 총 참여자 n=50 · 비율은 기존 리서치 요약 기준</p>
    ${evidence('images/projects/ssok-doc-survey-source.png', '쏙 사용자 설문 응답 원본', '사용자 설문 응답 · n=50')}
    <div class="research-translation"><div class="translation-heading"><span>발견에서 기획으로</span><h4>그래서 기획한 경험은<br><strong>함께 모으고, 필요할 때 쏙 찾는 링크 아카이빙</strong></h4></div><div class="translation-body"><div class="translation-labels"><span>사용자 어려움</span><span></span><span>기획 방향</span></div>
      <div class="translation-row"><p>어디로 보냈는지 기억이 안 나고<br>여러 플랫폼에 흩어짐</p><span aria-hidden="true">→</span><p><b>개인 · 그룹 파일</b><small>한곳에 모으고 카테고리로 분류</small></p></div>
      <div class="translation-row"><p>채팅에 묻혀<br>다시 찾기 힘듦</p><span aria-hidden="true">→</span><p><b>키워드 검색 · 핀</b><small>자주 보는 링크를 빠르게 재탐색</small></p></div>
      <div class="translation-row"><p>링크 내용을 알려면<br>일일이 열어 봐야 함</p><span aria-hidden="true">→</span><p><b>썸네일 · 제목 미리보기, AI 요약</b><small>열기 전에 핵심을 식별</small></p></div>
      <div class="translation-row"><p>공유한 링크에 대해<br>따로 이야기하기 어려움</p><span aria-hidden="true">→</span><p><b>링크별 댓글</b><small>링크 단위로 의견 나누기</small></p></div>
    </div></div>
    <div class="research-takeaway"><span aria-hidden="true">“</span><p>링크를 저장하는 것보다,<br><strong>저장한 콘텐츠를 나중에 다시 찾고 함께 활용하는 과정이 더 어렵다.</strong></p><small>핵심 문제 정의</small></div>
    <div class="case-note"><b>핵심 가설</b><p>저장 과정의 입력 부담을 줄이고 콘텐츠를 구조화하면, 사용자는 더 빠르게 저장하고 필요할 때 쉽게 다시 찾을 수 있을 것이다.</p></div>
  </div>`;
}

function personas() {
  const people = [
    {tag: '페르소나 1 · 정보 수집형', name: '김지훈 (28) · 마케터', story: '출퇴근 시간에 여러 사이트에서 마케팅 정보글을 모으고, 업무에 참고할 글은 카카오톡 ‘나에게 보내기’로 전송해 두었다가 필요할 때 찾아봐요.', needs: ['흩어진 정보들을 한곳에 모아 보고 싶어요', '경쟁 분석·고객 세그먼트·트렌드처럼 세부 주제로 나눠 저장하고 싶어요', '필요한 순간에 빠르게 찾아 핵심만 보고 싶어요'], pains: ['정보의 비체계적인 저장', '불필요한 정보와의 혼합', '검색의 비효율성']},
    {tag: '페르소나 2 · 그룹 공유형', name: '김나비 · 학생', story: '친구 5명과 3박 4일 제주도 여행을 계획하며 숙소, 맛집, 카페, 놀거리 링크를 각자 찾아 공유하고 있어요.', needs: ['링크들을 한곳에 모아 분류해서 보고 싶어요', '공유한 링크마다 효율적으로 이야기하고 싶어요', '어떤 링크가 좋은지 쉽고 빠르게 종합해 결정하고 싶어요'], pains: ['중복된 링크가 공유돼 정리가 안 돼요', '정보가 플랫폼마다 흩어져 있어요', '내용을 알려면 링크를 일일이 눌러야 해요', '대화가 길어지면 링크를 찾기 힘들어요']}
  ];
  const journey = [
    ['1. 링크 발견 및 저장', '브런치 글 탐색 → 여러 글을 카톡 ‘나에게 보내기’', '호기심 → 안도감', '링크만 전송되어, 어떤 내용인지·왜 보냈는지 알려면 다시 들어가 읽어야 함', '링크 저장 시 제목 수정, 메모 기능'],
    ['2. 카톡 접속', '업무 중 참고하려고 나와의 채팅방 접속', '안도감 → 혼란', '여러 정보가 한곳에 쌓여 해당 링크를 찾기 어려움', '중요·고정·나중에 볼 것 등 분류 기능'],
    ['3. 링크 검색', '키워드로 검색', '혼란 → 불안, 불편', '정확한 제목·내용을 입력해야 검색되고, 불필요한 텍스트까지 결과에 섞임', '제목·내용·카테고리·태그·메모 통합 검색'],
    ['4. 링크 파일 탐색', '링크 파일에 접속해 스크롤로 탐색', '불안, 불편 → 스트레스 최고조', '주제가 다른 링크 사이에 분류 기능이 없어 찾을 때까지 스크롤 반복, 필요 없어진 링크도 함께 쌓임', '파일·카테고리·태그 세분화, 주기적인 자동 정리'],
    ['5. 링크 발견', '링크를 열어 내용 확인', '스트레스 → 지침, 피로', '겨우 찾은 뒤에도 필요한 부분을 찾으려 여러 번 읽어 시간이 더 걸림', 'AI 요약, 인사이트 제공']
  ];
  return `<div class="case-copy">
    <div class="ssok-personas">${people.map(p => `<article class="ssok-persona"><span class="ssok-persona-tag">${p.tag}</span><h4>${p.name}</h4><p class="ssok-persona-story">${p.story}</p><div class="ssok-persona-cols"><div><b>니즈</b><ul>${p.needs.map(n => `<li>${n}</li>`).join('')}</ul></div><div><b>페인포인트</b><ul>${p.pains.map(n => `<li>${n}</li>`).join('')}</ul></div></div></article>`).join('')}</div>
    ${section('유저저니맵 · 정보 수집형 사용자', `<p class="ssok-journey-goal">목표 — 정보를 효과적으로 분류해 저장하고, 나중에 쉽게 찾아 업무 흐름이 끊기지 않게 한다</p>${table('쏙 유저저니맵', ['단계', '행동', '감정', '페인포인트', '솔루션'], journey, 'ssok-journey-table')}`)}
    <div class="case-note"><b>결과</b><p>유저저니맵을 디자인 산출물의 기준으로 공유해, 기획과 디자인 사이의 UX/UI 의사결정 기준을 통일하고 협업 효율을 높였습니다.</p></div>
  </div>`;
}

function requirements() {
  const rows = [
    ['파일 생성', '개인 / 그룹 파일', '<span class="ssok-scope mvp">MVP · 핵심</span>', '링크를 개인 또는 함께 쓰는 그룹 단위로 모은다'],
    ['파일 생성', '카테고리 생성', '<span class="ssok-scope mvp">MVP</span>', '파일 안에서 주제별 카테고리를 만든다'],
    ['파일 생성', '친구 초대', '<span class="ssok-scope mvp">MVP</span>', '초대 링크로 그룹 파일에 구성원을 참여시킨다'],
    ['링크 저장', '카테고리 선택', '<span class="ssok-scope mvp">MVP · 핵심</span>', '저장할 때 파일과 카테고리를 지정한다'],
    ['링크 저장', '핀 설정', '<span class="ssok-scope mvp">MVP</span>', '중요한 링크를 핀으로 표시한다'],
    ['링크 저장', '태그 설정 · 메모 입력', '<span class="ssok-scope next">MVP 이후</span>', '태그와 짧은 메모로 저장 맥락을 남긴다'],
    ['링크 탐색', '키워드 검색', '<span class="ssok-scope mvp">MVP · 핵심</span>', '저장한 링크를 키워드로 다시 찾는다'],
    ['링크 탐색', '핀 조회', '<span class="ssok-scope mvp">MVP</span>', '핀 표시한 링크만 모아 본다'],
    ['링크 탐색', '태그 기반 관련 링크 · AI 핵심 요약 · 자동 정리', '<span class="ssok-scope next">MVP 이후</span>', '관련 링크를 이어 보고, 열기 전에 핵심을 파악한다'],
    ['소통', '댓글', '<span class="ssok-scope mvp">MVP · 핵심</span>', '링크 단위로 구성원과 의견을 나눈다']
  ];
  return `<div class="case-copy">
    ${section('요구사항 정의 · MVP 범위', table('쏙 요구사항과 MVP 범위', ['사용자 흐름', '기능', '범위', '사용자 요구사항'], rows, 'ssok-req-table'))}
    ${evidence('images/projects/ssok-doc-walking-skeleton.webp', '쏙 워킹 스켈레톤 기반 MVP 보드', '워킹 스켈레톤 기반 MVP — 파일 생성 · 링크 저장 · 링크 탐색 · 소통 흐름별로 우선순위를 나누고 MVP 라인을 그었습니다')}
  </div>`;
}

function spec() {
  const rows = [
    ['—', '링크 저장', '링크 입력', 'URL 붙여넣기 → 형식 확인 → 주소 존재 여부 확인 → 미리보기 조회', 'URL', '미리보기 또는 오류 안내', '형식 오류: “유효하지 않은 URL 형식입니다”<br>없는 주소: “존재하지 않는 URL입니다”', '필수 입력'],
    ['—', '링크 저장', '제목 · 썸네일 추출', '제목: og:title → og:description → &lt;title&gt; → og:url<br>썸네일: og:image → 본문 첫 번째 이미지 → 기본 썸네일', 'URL · 페이지 메타데이터', '제목 · 썸네일', '값이 없으면 다음 우선순위로 대체', '사이트별 메타데이터 구조 고려'],
    ['—', '링크 저장', '분류 저장', '파일 선택 → 카테고리 선택<br>분류 영역 선택 시 확대하고 상세 입력 영역은 접음', '파일 · 카테고리', '저장 위치', '파일이 없으면 파일명 · 카테고리명 입력 후 생성', '필수 입력'],
    ['—', '링크 저장', '상세 저장', '필요한 경우에만 태그 · 메모 · 핀 설정', '태그 · 메모 · 핀 여부', '링크의 부가 정보', '입력하지 않아도 저장 가능', '선택 입력'],
    ['—', '상세 저장', '태그 입력', '태그 이름 입력 후 Enter로 생성', '태그 이름', '생성된 태그', '최대 5개<br>초과 시 “태그는 최대 5개 추가할 수 있어요” 안내<br>중복 태그는 미등록', '선택 입력'],
    ['—', '상세 저장', '메모 입력', '링크에 짧은 메모를 추가', '메모', '링크 메모', '최대 20자', '선택 입력'],
    ['—', '상세 저장', '핀 설정', '토글로 핀 켜기 · 끄기', '핀 여부', '핀 설정 상태', '—', '기본값 꺼짐'],
    ['—', '링크 저장', '저장 완료', '저장 처리 → 개인 / 그룹 파일 분기 → 완료 안내', 'URL · 저장 위치 · 선택 입력값', '저장된 링크 · 완료 안내', '저장 실패 시 입력 내용 유지', '파일 유형별 안내'],
    ['—', '그룹 공유', '그룹 초대 · 참여', '초대 링크 → 랜딩페이지 → 앱 설치 · 진입<br>회원 / 비회원 분기 및 토큰 검증 후 참여', '초대 토큰 · 딥링크', '그룹 참여', '회원 여부에 따라 진입 경로 분기', '토큰 · 딥링크 기반'],
    ['—', '링크 탐색', 'AI 핵심 요약', 'HTML 크롤링 → 본문 텍스트(&lt;p&gt;, &lt;h1&gt;–&lt;h3&gt;) 파싱 → GPT-4o 요청 → 링크 ID와 DB 저장 → 결과 노출', '링크 ID · 본문 텍스트', '핵심 요약', '불러올 수 없는 링크는 오류 안내', '하루 3회 제공<br>“별로예요 / 유용해요” 피드백']
  ];
  return `<div class="case-copy">
    ${section('기능 상세 명세', table('쏙 기능 상세 명세', ['화면 ID', '구분', '주 기능', '처리 로직', '입력값', '출력값', '예외', '비고'], rows, 'ssok-spec-table'))}
  </div>`;
}

function flow() {
  return `<div class="ssok-flow-images">
    ${evidence('images/projects/ssok-doc-save-flowchart-source.png', '쏙 링크 저장 플로우차트', '링크 저장 플로우')}
    ${evidence('images/projects/ssok-doc-invite-flow-source.png', '쏙 그룹 초대 및 참여 플로우차트', '그룹 초대 · 참여 플로우')}
  </div>`;
}

function screens() {
  const figmaUrl = 'https://www.figma.com/design/NUVax28p8w21jtrBMaDyjz/Untitled?node-id=0-5623&m=dev';
  return `<div class="figma-panel"><iframe title="쏙 화면 설계서" src="https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}" loading="lazy" allowfullscreen></iframe></div>`;
}

function ut() {
  const tasks = [
    {title: '공유 파일 생성하기', scenario: '여러 사람들과 함께 볼 새 파일을 만들어보세요. 카테고리를 4개 추가하고, 해당 파일을 공유해보세요.', focus: '네 번째 카테고리가 입력 중인 상태와 추가 완료된 상태를 구분하는지 확인합니다. 3개만 추가한 채 생성 버튼을 누르는지 관찰합니다.', flow: '공유 파일 선택 → 파일 생성 버튼 → 파일 이름 입력 → [카테고리 이름 입력 → 키보드 완료] × 4 → 생성 → 홈 · 토스트 메시지 → 공유하기', questions: ['공유 파일 생성 흐름이 자연스러웠나요? <small>매우 그렇다 ~ 전혀 아니다</small>', '어느 부분이 부자연스럽게 느껴졌나요? <small>부자연스럽다고 답한 경우 · 서술형</small>', '이 기능을 어떤 상황에서 쓰고 싶다고 느꼈나요?']},
    {title: '링크 저장하기', scenario: '복사한 링크를 {파일 이름} 파일의 {카테고리 이름} 카테고리에 저장해보세요. 태그와 메모를 추가하고 핀 설정까지 완료해보세요.', focus: '링크 저장 과정에서 입력 항목이 번거롭게 느껴지는지 확인합니다.', flow: '링크 추가 → 붙여넣기 → 파일 열기 → 카테고리 선택 → 태그 추가 → 메모 입력 → 핀 설정 → 저장 → 파일 상세 · 토스트 메시지', questions: ['링크를 저장할 때 번거롭게 느껴지는 부분이 있었나요? <small>매우 그렇다 ~ 전혀 아니다</small>', '어느 부분이 번거롭게 느껴졌나요? <small>번거로웠다고 답한 경우 · 서술형</small>']},
    {title: '저장한 링크 다시 찾아보기', scenario: '어제 저장한 ‘명언’ 링크를 다시 보고 싶어요. 링크를 찾아 열어보세요.', focus: '최근 저장·검색·핀·파일 탐색 중 어떤 경로를 선택하는지, 원문까지 쉽게 도달하는지 확인합니다.', flow: '최근 저장 / 검색 / 핀 / 파일 탐색 중 선택 → 링크 카드 진입 → 원문 조회', questions: ['저장한 링크를 찾는 경로를 쉽게 예상할 수 있었나요? <small>쉬움 / 좀 복잡함 / 찾기 어려움</small>', '‘좀 복잡함’ 또는 ‘찾기 어려움’을 선택한 이유는 무엇인가요?']},
    {title: '내 파일을 공유 파일로 바꾸기', scenario: '내 파일을 ‘민지’에게 공유하고 싶어요. 공유 파일로 바꾸고 민지에게 공유해보세요.', focus: '설정 안의 공유 전환 기능을 발견하고, 공유하기까지 진행할 수 있는지 확인합니다.', flow: '내 파일 → 설정 → 공유 전환 → 팝업의 전환하기 → 멤버 + 아이콘 → 공유하기 → 민지', questions: ['‘공유하기’라는 개념이 직관적으로 이해됐나요?', '공유하기 버튼에 도달하기까지의 흐름은 어땠나요?', '이동 과정이 자연스러웠나요? 헷갈리거나 막히는 부분이 있었다면 알려주세요.']},
    {title: '자동정리 기능 설정하기', scenario: '안 보게 된 링크들이 많아졌어요. 자동정리 기간을 7일로 설정하고 필요한 링크를 복원해보세요.', focus: '자동정리 아이콘을 인지해 해당 기능을 찾는지, 정리와 복원의 역할을 이해하는지 확인합니다.', flow: '자동정리 페이지 진입 → 기간 선택 → 복원 알림 → 복원하기', questions: ['자동정리 기능이 어떤 역할을 하는지 쉽게 이해되었나요?', '자동정리 기간을 설정하는 과정에서 어려움이 있었나요?', '이 기능이 실제로 도움이 될 거라고 느끼셨나요? <small>객관식</small>']},
    {title: '핵심요약 보기', scenario: '{링크 이름} 링크의 핵심요약만 보고 싶어요. 어떻게 하면 볼 수 있을까요?', focus: '링크 목록에서 핵심요약 기능을 찾아 내용을 확인할 수 있는지 살펴봅니다.', flow: '링크 리스트 → 핵심요약 버튼 → 모달 노출', questions: ['전체적으로 쏙이라는 서비스는 어떤 느낌이 들었나요? <small>직관적이다 / 복잡하다 / 기대 이상이다 등</small>']}
  ];
  return `<div class="ut-plan">
    <section class="ut-process" aria-labelledby="ssok-ut-process"><h4 id="ssok-ut-process">진행 순서</h4><ol class="ut-sequence"><li>가설 설정</li><li>과업 · 시나리오 설계</li><li>1차 테스트</li><li>보완 후 2차 테스트</li><li>결과 분석</li></ol></section>
    <section class="ut-checks" aria-labelledby="ssok-ut-tasks"><h4 id="ssok-ut-tasks">과업과 확인 기준</h4>
      <div class="ssok-ut-tasks">${tasks.map((task, i) => `<details class="ssok-ut-task"${i === 0 ? ' open' : ''}><summary><span class="ssok-task-number">${String(i + 1).padStart(2, '0')}</span><span><b>${task.title}</b><span class="ssok-task-scenario">${task.scenario}</span></span><span class="ssok-task-toggle" aria-hidden="true">＋</span></summary><div class="ssok-task-body"><dl><div><dt>검증 포인트</dt><dd>${task.focus}</dd></div><div><dt>목표 행동</dt><dd>${task.flow}</dd></div><div><dt>사후 질문</dt><dd><ol>${task.questions.map(question => `<li>${question}</li>`).join('')}</ol></dd></div></dl></div></details>`).join('')}</div>
    </section>
    <section class="ut-measure" aria-labelledby="ssok-ut-measure"><h4 id="ssok-ut-measure">측정 기준</h4><ul><li>과업 수행 시간</li><li>미스클릭</li><li>히트맵 · 이동 경로</li><li>사후 인터뷰</li></ul></section>
    <section class="ssok-ut-result" aria-labelledby="ssok-ut-result"><h4 id="ssok-ut-result">결과</h4>
      <div class="result-grid"><article><span>USER TASK</span><b>44%</b><p>과업 수행 시간 평균 단축</p></article><article><span>MISCLICK</span><b>23%</b><p>미스클릭률 개선</p></article></div>
    </section>
  </div>`;
}

module.exports = [
  {id: 'research', name: '문제 정의 · 리서치', type: '발견', head: '저장 이후의 재탐색 경험을 문제로 정의했습니다', render: research, subtitleFromLead: true},
  {id: 'persona', name: '페르소나 · 유저저니맵', type: '공감', head: '사용자의 하루를 따라가며 페인포인트를 찾았습니다', subtitle: '설문을 페르소나와 유저저니로 정리해, 기획과 디자인의 판단 기준을 맞췄습니다.', render: personas},
  {id: 'requirements', name: '요구사항 정의서', type: '기획', head: '유저의 니즈를 기반으로 어떤 기능을 만들지 정했습니다', subtitle: '“함께 저장하고 쉽게 찾는다”는 핵심 경험을 기준으로 MVP 범위와 우선순위를 정했습니다.', render: requirements},
  {id: 'policy', name: '기능 명세서', type: '기획', head: '어떻게 동작할지 기능을 구체화했습니다', subtitle: '저장 부담을 줄이고 개발 중 혼선을 막도록, 기능별 처리 기준과 예외를 정의했습니다.', render: spec},
  {id: 'flow', name: 'IA · 유저플로우', type: '설계', head: '서비스의 뼈대와 흐름을 설계했습니다', render: flow},
  {id: 'wireframes', name: '화면 설계서', type: '설계', head: '입력 부담을 줄인 저장 화면을 설계했습니다', subtitle: '필수 분류와 선택 입력을 나누고, 필요한 정보만 단계적으로 보여주도록 설계했습니다.', render: screens},
  {id: 'ut', name: 'UT · A/B 테스트', type: '검증', head: '사용자 테스트로 저장 경험을 검증했습니다', render: ut}
];

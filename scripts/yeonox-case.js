// Editorial reconstruction from the owner's process and service references.
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const processCopy = require('./yeonox-process-copy');
const wrap = s => '<div class="case-copy yeonox-copy">'+s+'</div>';
const why = (a,b,c) => '<dl class="yx-reasoning">'+[a,b,c].map((s,i)=>'<div><dt>'+['고민','액션','구체적 해결'][i]+'</dt><dd>'+s+'</dd></div>').join('')+'</dl>';
const flow = a => '<ol class="yx-flow">'+a.map((s,i)=>'<li><small>'+String(i+1).padStart(2,'0')+'</small><b>'+s+'</b></li>').join('')+'</ol>';
const table = (label,heads,rows) => '<div class="case-table-wrap" tabindex="0" role="region" aria-label="'+label+'"><table class="case-table yeonox-table"><caption class="sr-only">'+label+'</caption><thead><tr>'+heads.map(s=>'<th scope="col">'+s+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((s,i)=>i?'<td>'+s+'</td>':'<th scope="row">'+s+'</th>').join('')+'</tr>').join('')+'</tbody></table></div>';
const figma = 'https://www.figma.com/design/YhSAPM8z8iEKAvJS9VcDUX/%EC%8F%99%EC%8F%9A%EC%8F%9A%EC%8F%9A?node-id=2682-1056&m=dev';
module.exports = [
{id:'research',name:'컨셉 · 문제 정의',type:'01 · 기획',head:'말하기 어려운 연애 고민을 나누도록 익명·투표·후기를 연결했습니다.',render:()=>wrap(`
  <div class="yx-research-meta"><span>기획의 출발점</span><span>개인적 관찰 기반 · 사용자 조사 결과 아님</span></div>
  <div class="yx-findings">
    <article><div class="yx-art yx-bubbles"><span>또 같은 고민이라고 할까 봐…</span><span>친구에게는 말하기 어려워</span></div><small>01 · 말하기의 부담</small><h4>알면서도 정리하기 어려운 관계</h4><p>관계가 불편해도 쉽게 떠나지 못하면 같은 고민을 지인에게 다시 꺼내기 망설여집니다.</p><b class="yx-answer">→ 익명으로 상황을 이야기하기</b></article>
    <article><div class="yx-art yx-ox"><span>O</span><span>X</span></div><small>02 · 판단의 어려움</small><h4>내가 불편해도 되는 일일까?</h4><p>연애 경험이 적으면 불편한 상황도 당연하게 넘기기 쉽습니다. 자신의 판단 외에 다른 관점이 필요합니다.</p><b class="yx-answer">→ 투표·댓글로 관점 비교하기</b></article>
    <article><div class="yx-art yx-loop"><span>고민</span><i>→</i><span>조언</span><i>↻</i></div><small>03 · 듣는 사람의 부담</small><h4>한 친구에게 반복되는 감정 노동</h4><p>늘 같은 친구가 조언을 감당하지 않도록, 경험을 나눌 수 있는 사람들에게 참여를 열어둡니다.</p><b class="yx-answer">→ 원하는 깊이로 의견 보태기</b></article>
  </div>
  <div class="yx-takeaway"><small>서비스 가설</small><h4>혼자 감당하던 고민을, 여러 관점을 참고하는 경험으로.</h4><p>익명 사연으로 말하기의 부담을 낮추고 OX로 가볍게 참여하게 합니다. 후기 요청과 알림은 이후 이야기를 확인하러 돌아올 이유로 연결했습니다. 투표는 관계의 정답이 아닌 참고할 의견입니다.</p></div>
  <details class="yx-details" open><summary>초기 기능 요구사항 · 화면 구현 전에 정한 범위</summary>
  ${table('초기 기능 요구사항',['영역','정한 범위','기획 의도'],[
    ['회원·사연','Apple·Google 로그인 / 제목·내용 필수 / 이미지 최대 3장','참여 기록은 계정에 연결하되, 사연과 의견은 익명으로 나눈다.'],
    ['투표·댓글','한 사용자·한 사연당 1회 투표 / 투표 후 댓글 조회·작성 / 댓글 공감','다른 의견을 보기 전에 자신의 판단을 먼저 남기는 참여 순서.'],
    ['후기·알림','후기 요청 / 작성자 후기 / 요청·작성 알림','단발성 반응을 넘어 이후 선택과 경험까지 연결한다.'],
    ['신고·차단·지원','신고 / 사용자 차단 / 피드백·문의 / 탈퇴','민감한 고민을 나누는 공간의 안전과 운영 경로를 마련한다.']
  ])}</details>
`)},
{id:'agent-rules',name:'AGENTS.md · AI 개발 규칙',type:'02 · 개발 기준',head:'한 화면도 컴포넌트와 역할별로 나눠 코드를 작성하도록 규칙을 정했습니다.',render:()=>wrap(`
  <div class="yx-architecture"><div class="yx-code-label">AGENTS.md <span>코드 작성 전 우선 참조</span></div><div class="yx-layers"><article><code>_area</code><b>화면 레이아웃</b><p>정적 뷰와 표현</p></article><article><code>_action</code><b>사용자 행동</b><p>인터랙션과 상태</p></article><article><code>_lib</code><b>데이터 통신</b><p>Supabase 순수 함수</p></article></div><div class="yx-rule-tags"><span>거대 단일 파일 금지</span><span>임의 더미 배열 금지</span><span>UI에서 DB 직접 호출 금지</span></div></div>
  <div class="yx-folder-structure"><div><span class="yx-label">실제 화면별 폴더 구조</span><h4>한 화면을 한 파일에 몰아넣지 않고,<br>컴포넌트와 역할별로 분리했습니다.</h4><p>화면 단위인 <code>screens/chat</code> 안에 화면 영역, 컴포넌트, 액션, 상태 등을 나눴습니다. 상세 화면인 <code>detail</code>도 독립된 폴더 안에서 같은 방식으로 구성하도록 했습니다.</p><p>AI가 새 기능을 만들 때도 화면 전체를 다시 작성하는 대신, 해당 컴포넌트와 역할에 맞는 위치에 코드를 추가하도록 구조화했습니다.</p></div><pre class="yx-folder-tree" aria-label="제공된 스크린샷의 chat 화면 폴더 구조"><code>src/
└─ screens/
   └─ chat/
      ├─ _action/
      ├─ _area/
      ├─ _component/
      ├─ _handler/
      ├─ _lib/
      ├─ _state/
      ├─ _svg/
      └─ detail/
         ├─ _action/
         ├─ _area/
         ├─ _component/
         ├─ _lib/
         ├─ _model/
         ├─ _state/
         ├─ _svg/
         └─ ChatDetailScreen.tsx</code></pre></div>
  ${why(...processCopy['agent-rules'])}
`)},
{id:'prototype',name:'와이어프레임 · 프로토타입',type:'03 · 구체화',head:'와이어프레임을 코드로 옮겨 모바일에서 직접 조작하며 다듬었습니다.',render:()=>wrap(`
  <div class="yx-section-title"><h4>와이어프레임</h4><a class="yx-link" href="${figma}" target="_blank" rel="noopener">Figma 원본 열기 ↗</a></div>
  <iframe class="yx-figma" title="연OX 와이어프레임 · Figma" loading="lazy" src="https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figma)}" allowfullscreen></iframe>
  <p class="yx-footnote">Figma 접근 권한에 따라 로그인이 필요할 수 있습니다. 임베드가 표시되지 않으면 원본 링크로 확인해 주세요.</p>
  ${flow(['와이어프레임으로 동선 설정','Expo 화면으로 즉시 구현','시뮬레이터에서 터치·전환 확인','어색한 동선 수정'])}
  ${why(...processCopy['prototype'])}
`)},
{id:'policy',name:'정책 설계 · 요구사항 구체화',type:'04 · 정책',head:'투표·댓글·익명 식별의 예외를 발견하며 참여 규칙을 구체화했습니다.',render:()=>wrap(`
  <ul class="yx-policy-list" aria-label="주요 정책">
    <li><strong>투표 횟수</strong> 한 사용자당 같은 글에 한 번만 투표할 수 있습니다.</li>
    <li><strong>댓글 접근</strong> 해당 글에 투표한 뒤에만 댓글을 보고 작성할 수 있습니다.</li>
    <li><strong>익명 식별</strong> 같은 글에서는 같은 작성자의 익명 번호를 유지합니다.</li>
    <li><strong>공통 UI</strong> 모달을 개별적으로 늘리지 않고 공통 바텀시트로 통일합니다.</li>
  </ul>
  ${why(...processCopy['policy'])}
  <div class="yx-identity"><code>같은 게시글 · user_id A</code><span>→</span><strong>익명 1</strong><span>→</span><p>첫 댓글도, 다음 댓글도<br><b>같은 번호 유지</b></p></div>
`)},
{id:'frontend',name:'프론트엔드 · 모바일 UX',type:'05 · 구현',head:'바텀시트의 스크롤과 키보드 충돌을 모바일 구조에 맞게 해결했습니다.',render:()=>wrap(`
  <div class="yx-mobile-ux"><div class="yx-phone"><div class="yx-phone-top">D+365 <span>사연 피드</span></div><div class="yx-sheet"><i></i><b>댓글</b><div class="yx-scroll-area"><p>익명 1 <span>긴 의견도 끊김 없이</span></p><p>익명 2 <span>댓글 영역 안에서 스크롤</span></p><p>익명 1 <span>아래로 스와이프해 닫기</span></p></div><div class="yx-phone-input">의견을 남겨주세요 <b>↑</b></div></div><div class="yx-keyboard" aria-hidden="true">Q W E R T Y U I O P<br>A S D F G H J K L<br>⇧ Z X C V B N M ⌫</div></div><div class="yx-ux-notes"><article><span>01</span><h4>바텀시트가 스크롤을 소유</h4><p>일반 ScrollView 대신 BottomSheetScrollView를 최상위 스크롤러로 연결했습니다.</p></article><article><span>02</span><h4>키보드와 입력창을 함께 고려</h4><p>bottomInset과 SafeArea를 계산해 입력창이 키보드에 가려지지 않도록 조정했습니다.</p></article><article><span>03</span><h4>웹이 아닌 모바일 제스처 기준</h4><p>목록 스크롤과 시트 닫기 동작의 충돌을 분리해서 확인했습니다.</p></article></div></div>
  ${why(...processCopy['frontend'])}
`)},
{id:'data',name:'ERD · AI 프롬프트',type:'06 · 설계',head:'참여 정책은 데이터 제약으로, 사연의 맥락은 AI 예시로 구체화했습니다.',render:()=>wrap(`
  <div class="yx-section-title"><h4>ERD · 누가 어떤 글에 투표했는지 기록</h4><span>핵심 관계 발췌</span></div>
  <div class="yx-erd"><div class="yx-erd-origin"><article><code>users</code><b>참여 주체</b></article><span>×</span><article><code>posts</code><b>사연과 작성자</b></article></div><div class="yx-erd-arrow">↓ 사용자와 사연을 연결</div><div class="yx-erd-children"><article><code>votes</code><b>한 사연 · 한 사용자 · 한 표</b><small>UNIQUE (post_id, user_id)</small></article><article><code>comments</code><b>투표 이후 조회·작성</b><small>해당 사용자의 투표 이력 확인</small></article><article><code>reviews</code><b>원 사연의 후속 이야기</b><small>post_id UNIQUE · 작성자 연결</small></article></div></div>
  <div class="yx-takeaway compact"><h4>투표 기록으로 두 가지를 확인합니다.</h4><p><strong>① 이미 투표한 글인가?</strong> 사용자 ID와 글 ID를 함께 기록해, 같은 사람이 같은 글에 두 번 투표하지 못하게 합니다.</p><p><strong>② 이 글의 댓글을 볼 수 있는가?</strong> 해당 글에 투표한 기록이 있는 사용자에게만 댓글 조회와 작성을 허용하는 정책입니다.</p></div>
  <div class="yx-section-title"><h4>AI O/X 선택지 · 프롬프트 설계</h4></div>
  ${flow(['사연의 갈등 맥락','상황별 Few-shot 예시','서로 다른 두 관점','맥락·표현 적합성 확인'])}
  ${why(...processCopy['data'])}
  <div class="yx-section-title"><h4>운영 어드민 · 프롬프트 적용과 테스트</h4><span>AI로 제작한 관리 화면</span></div>
  <figure class="yx-evidence"><a href="images/projects/yeonox-ai-admin.png" target="_blank" rel="noopener" aria-label="연OX AI 프롬프트 및 검수 엔진 관리 화면 크게 보기"><img src="images/projects/yeonox-ai-admin.png" alt="연OX 어드민: O/X 선택지 생성·게시글 검수 프롬프트를 관리하고 제목과 본문으로 AI 응답을 테스트하는 화면" loading="lazy"></a><figcaption>AI 프롬프트 및 검수 엔진 관리 · 게시글 품질·스팸 검수 탭. 이미지를 누르면 원본을 확인할 수 있습니다.</figcaption></figure>
  ${why('프롬프트를 수정할 때마다 코드와 테스트 도구를 오가는 과정이 번거로웠습니다. 운영 단계에서도 게시글·신고·문의 관리가 필요할 것이라 판단했습니다.','AI와 함께 어드민을 제작하고, 프롬프트를 저장·적용하는 편집 영역과 실시간 테스트 영역을 한 화면에 배치했습니다.','O/X 생성과 게시글 검수 프롬프트를 구분했습니다. 테스트 제목·본문으로 Gemini를 호출하고 JSON 응답을 확인해, 문구 수정과 결과 검토를 같은 흐름에서 할 수 있게 했습니다.')}
  ${table('검수 프롬프트의 판단 기준',['판단 대상','구체화한 기준','응답 연결'],[
  ['일상적인 짧은 글','짧은 문장·줄임말·초성이라는 이유만으로 차단하지 않음','PASS · 일상 표현과 도배를 구분'],
  ['도배·광고·부적절한 표현','무작위 반복 문자열 / 상업적 홍보 / 과도한 비속어와 비방을 분리','사유 코드와 지정된 안내 문구 반환'],
  ['출력 형식','is_approved / reason_code / message를 가진 JSON','승인 여부와 사용자 안내를 일관되게 연결']
  ])}
`)},
{id:'api',name:'API 명세 · Swagger',type:'07 · 검증',head:'명세를 읽는 자리에서 요청과 응답까지 확인하도록 연결했습니다.',render:()=>wrap(`
  <div class="yx-api-board"><div class="yx-api-bar"><b>API EXPLORER</b><span>대화형 명세의 확인 흐름</span></div><div class="yx-api-row"><span class="yx-method">GET</span><b>데이터 조회</b><span>사연 · 댓글 · 후기</span></div><div class="yx-api-row"><span class="yx-method post">POST</span><b>데이터 생성·요청</b><span>투표 · 사연 · AI 선택지</span></div><div class="yx-api-panels"><section><small>REQUEST</small><h4>입력과 인증 조건 설정</h4><p>필수값 · 사연 ID · 사용자 맥락</p><span class="yx-try">Try it out → Execute</span></section><section><small>RESPONSE</small><h4>응답 구조와 오류 확인</h4><p>상태 코드 · 응답 필드 · 정책 위반</p><code>요청 → 서버 처리 → 응답 비교</code></section></div></div>
  ${why(...processCopy['api'])}
  <p class="yx-footnote">위 UI는 확인 흐름을 재구성한 도식이며, 실제 엔드포인트나 테스트 실행 로그를 나타내지 않습니다.</p>
`)},
{id:'marketing',name:'마케팅 콘텐츠',type:'현재 · 준비 중',head:'말하지 못한 고민에 공감하고 참여할 이유를 전하는 콘텐츠를 준비했습니다.',render:()=>wrap(`
  <div class="yx-marketing-status"><span>지금은</span><b>마케팅 준비 중</b><p>기능 소개보다 “내 이야기 같다”는 공감에서 시작합니다.</p></div>
  <figure class="yx-evidence"><a href="images/projects/yeonox-marketing-source.png" target="_blank" rel="noopener" aria-label="연OX 마케팅 콘텐츠 5종 원본 크게 보기"><img src="images/projects/yeonox-marketing-source.png" alt="연OX 마케팅 콘텐츠 5종: 고민 공감, 익명 사연, 투표와 댓글, 작성자 후기, 연애 상담" loading="lazy" width="2048" height="735"></a><figcaption>직접 제작한 마케팅 콘텐츠 원본 · 이미지를 누르면 크게 볼 수 있습니다.</figcaption></figure>
  ${why('친구에게 말하기 어려운 고민을 가진 사람에게 기능 목록만으로는 서비스의 필요성이 전달되지 않습니다.','공감 → 익명 표현 → 의견 비교 → 후속 이야기 순서로 마케팅 메시지를 정리했습니다.','투표를 “객관적 정답”으로 약속하지 않고, 여러 관점을 참고하는 경험으로 소개합니다. 제공 범위와 홍보 문구를 맞추며 마케팅을 준비하고 있습니다.')}
`)}
];

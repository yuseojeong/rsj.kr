const ring = (id, value, display, caption) => `<div class="finding-ring" role="img" aria-label="${caption} ${display.replace(/<[^>]*>/g, '')}"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b39ae9"/><stop offset="1" stop-color="#7950df"/></linearGradient></defs><circle class="ring-track" cx="100" cy="100" r="83"/><circle class="ring-value" cx="100" cy="100" r="83" pathLength="100" stroke="url(#${id})" stroke-dasharray="${value} 100" transform="rotate(-90 100 100)"/></svg><div class="ring-label"><span>${caption}</span><strong>${display}</strong></div></div>`;

module.exports = function koachResearch() {
  return `<div class="research-editorial">
    <p class="opportunity-lead">단어와 문법을 아는 것만으로는 실제 대화에서 자연스러운 한국어를 구사하기 어렵습니다. 한국 문화를 학습한 챗봇을 통해, 실제 한국인과 대화하듯 표현을 익히는 경험을 기획했습니다.</p>
    <dl class="study-meta"><div><dt>설문 기간</dt><dd>2025.09.10 – 09.13</dd></div><div><dt>참여자</dt><dd>총 <b>17명</b></dd></div><div><dt>대상</dt><dd>한국어 학습 6개월 이상 중인 학습자</dd></div></dl>
    <div class="research-section-label"><span>설문에서 발견한 세 가지 단서</span><small>01 — 03</small></div>
    <div class="research-findings">
      <section class="research-finding" aria-labelledby="finding-context"><div class="finding-index"><span>01</span> 관계의 장벽</div><h4 id="finding-context">표현을 알아도,<br><strong>예의와 격식은 여전히 어렵다</strong></h4>
        ${ring('context-ring',80,'80<small>%+</small>','예의·격식으로 곤란 경험')}
        <p class="finding-evidence">응답자의 <b>80% 이상</b>이 예의, 격식 때문에 곤란했던 경험이 있다고 답했습니다.</p>
      </section>
      <section class="research-finding" aria-labelledby="finding-demand"><div class="finding-index"><span>02</span> 맞춤 교정의 수요</div><h4 id="finding-demand">지금 대화하는 상대에게<br><strong>맞는 표현을 알고 싶다</strong></h4>
        ${ring('demand-ring',96,'96<small>%</small>','AI 맞춤 교정 사용 의향')}
        <p class="finding-evidence">상황과 친밀도에 맞춰 문장을 교정하는 AI 서비스를 <b>사용해 보고 싶다는 응답은 96%</b>였습니다.</p>
      </section>
      <section class="research-finding" aria-labelledby="finding-everyday"><div class="finding-index"><span>03</span> 실생활 표현의 가치</div><h4 id="finding-everyday">교과서 밖의 표현도<br><strong>학습의 대상이 된다</strong></h4>
        <div class="everyday-chart" role="img" aria-label="줄임말·문자체 학습이 도움 된다는 응답 92%"><div class="expression-samples" aria-hidden="true"><span>밤티</span><span>킹받네</span><span>갓생</span><span>억텐</span></div><span class="everyday-chart-label">줄임말·문자체 학습에 긍정적</span><strong>92<small>%</small></strong><div class="everyday-bar"><i></i></div><div class="everyday-scale" aria-hidden="true"><span>0</span><span>100%</span></div></div>
        <p class="finding-evidence">친구 사이의 줄임말과 문자체 등 <b>실제로 쓰는 표현이 학습에 도움이 된다는 응답은 92%</b>였습니다.</p>
      </section>
    </div>
    <p class="study-source">출처: koach 1차 유저리서치 결과 요약 · 2025.09 · 17명 응답</p>
    <div class="research-translation"><div class="translation-heading"><span>발견에서 기획으로</span><h4>그래서 기획한 경험은<br><strong>한국인과 대화하듯 배우는 한국어</strong></h4></div><div class="translation-body"><div class="translation-labels"><span>사용자 어려움</span><span></span><span>기획 방향</span></div><div class="translation-row"><p>상대와의 관계에 따라<br>예의와 격식을 판단하기 어려움</p><span aria-hidden="true">→</span><p><b>거리감 슬라이더</b><small>친밀도와 격식을 설정하는 대화</small></p></div><div class="translation-row"><p>지금 상황에 맞는<br>자연스러운 표현을 알고 싶음</p><span aria-hidden="true">→</span><p><b>대화 속 맞춤 교정</b><small>문화적 맥락에 맞는 표현과 이유 안내</small></p></div><div class="translation-row"><p>교재의 정형화된 표현만으로는<br>실제 일상 대화에 한계</p><span aria-hidden="true">→</span><p><b>한국 문화 기반 챗봇</b><small>일상 대화로 실제 쓰는 표현 학습</small></p></div></div></div>
    <div class="research-takeaway"><span aria-hidden="true">“</span><p>한국 문화를 학습한 챗봇을 통해,<br><strong>실제 한국인과 대화하듯 배우는 한국어.</strong></p><small>koach의 기획 출발점</small></div>
  </div>`;
};

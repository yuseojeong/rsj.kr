module.exports = function renderKoachUt(figmaUrl) {
  const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`;
  return `<div class="ut-plan">
    <section class="ut-process" aria-labelledby="ut-process-title">
      <h4 id="ut-process-title">진행 순서</h4>
      <ol class="ut-sequence"><li>퍼소나·목표 설정</li><li>시나리오·과제 설계</li><li>참여자 모집</li><li>UT 진행</li></ol>
    </section>
    <section class="ut-checks" aria-labelledby="ut-checks-title">
      <h4 id="ut-checks-title">과제와 확인 기준</h4>
      <dl class="ut-task-list">
        <div><dt>첫 대화 시작</dt><dd>가입부터 첫 채팅까지 스스로 진행할 수 있는지</dd></div>
        <div><dt>거리감 조절</dt><dd>같은 문장을 존댓말·반말로 바꾸며 슬라이더를 이해하는지</dd></div>
        <div><dt>교정 확인</dt><dd>틀린 문장의 교정 이유를 이해하고 부담 없이 수정하는지</dd></div>
      </dl>
      <p class="ut-scope-note">앱 목적 이해는 리서치·인터뷰로 확인하고, 표현 저장 → 복습 동선도 함께 점검합니다.</p>
    </section>
    <section class="ut-measure" aria-labelledby="ut-measure-title">
      <h4 id="ut-measure-title">측정 기준</h4>
      <ul><li>기능 이해도</li><li>과제 성공·실패</li><li>사용 소감</li><li>재사용·추천 의향</li></ul>
    </section>
    <section class="ut-figma" aria-labelledby="ut-figma-title">
      <h4 id="ut-figma-title">UT 시나리오 · 준비 문서</h4>
      <iframe title="koach UT 준비 문서" src="${embedUrl}" loading="lazy" allowfullscreen></iframe>
    </section>
  </div>`;
};

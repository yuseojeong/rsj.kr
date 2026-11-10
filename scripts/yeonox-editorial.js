// Editorial presentations of the existing policies and data relationships.
exports.policy = () => `<div class="yx-editorial">
  <div class="yx-policy-cards">
    <article class="yx-policy-card"><div class="yx-policy-visual vote-visual" aria-hidden="true"><span class="vote-choice">O</span><span class="vote-choice">X</span><span class="vote-limit">한 사연에 한 표</span></div><h4>한 번의 선택으로<br>의견을 남깁니다</h4><p>한 사용자는 같은 글에 한 번만 투표할 수 있도록 참여 횟수를 정했습니다.</p></article>
    <article class="yx-policy-card"><div class="yx-policy-visual access-visual" aria-hidden="true"><span class="vote-done">✓ 투표 완료</span><span class="access-line"></span><div class="comment-preview"><span>댓글 읽기 · 작성하기</span><i></i><i></i></div></div><h4>내 생각을 남긴 뒤,<br>다른 의견을 봅니다</h4><p>해당 글에 투표한 뒤에만 댓글을 보고 작성하도록 접근 조건을 정했습니다.</p></article>
    <article class="yx-policy-card"><div class="yx-policy-visual identity-visual" aria-hidden="true"><div><span>익명 1</span><i></i><i></i></div><div><span>익명 1</span><i></i></div></div><h4>같은 글에서는<br>같은 이름을 유지합니다</h4><p>작성자의 사용자 ID를 기준으로 익명 번호를 유지해, 댓글이 이어져도 같은 사람임을 알 수 있게 했습니다.</p></article>
  </div>
  <section class="yx-editorial-note"><h4>다른 기능에서도,<br>익숙한 조작 방식으로.</h4><p>모달을 기능마다 따로 만들지 않고 공통 바텀시트로 통일했습니다. 화면이 달라져도 같은 방식으로 내용을 확인하고 닫도록 기준을 정했습니다.</p></section>
</div>`;
exports.relationships = () => `<section class="yx-data-story">
  <figure class="yx-relation-figure"><div class="yx-relation-scroll" tabindex="0" role="region" aria-label="연OX 핵심 데이터 관계. 작은 화면에서는 좌우로 이동할 수 있습니다.">
    <svg viewBox="0 0 960 400" class="yx-relation-diagram" role="img" aria-labelledby="yx-relation-title yx-relation-desc">
      <title id="yx-relation-title">사용자와 사연을 중심으로 연결한 참여 기록</title><desc id="yx-relation-desc">사용자 users와 사연 posts를 투표 votes와 댓글 comments에 연결합니다. votes는 post_id와 user_id 조합을 고유하게 관리합니다. 후기 reviews는 원 사연과 작성자에 연결하고 post_id를 고유하게 관리합니다.</desc>
      <g class="relation-paths"><path d="M290 112 V160 H480 M670 112 V160 H480 M480 160 V218 M160 218 H800 M160 218 V256 M480 218 V256 M800 218 V256"/></g>
      <g class="relation-origin"><text x="290" y="68">users</text><text x="670" y="68">posts</text></g>
      <g class="relation-caption"><text x="290" y="98">참여하는 사용자</text><text x="670" y="98">사연과 작성자</text></g>
      <rect x="355" y="170" width="250" height="34" rx="17" fill="#e8f3ff"/><text x="480" y="192" class="relation-join">사용자와 사연을 함께 기록</text>
      <g class="relation-entity"><text x="160" y="290">votes</text><text x="480" y="290">comments</text><text x="800" y="290">reviews</text></g>
      <g class="relation-caption"><text x="160" y="321">한 사연 · 한 사용자 · 한 표</text><text x="480" y="321">투표 이후 조회·작성</text><text x="800" y="321">원 사연의 후속 이야기</text></g>
      <g class="relation-constraint"><text x="160" y="350">UNIQUE (post_id, user_id)</text><text x="480" y="350">해당 사용자의 투표 이력 확인</text><text x="800" y="350">post_id UNIQUE · 작성자 연결</text></g>
    </svg>
  </div><figcaption>ERD 핵심 관계 발췌 · 참여 정책과 연결되는 데이터 관계를 재구성했습니다.</figcaption></figure>
  <div class="yx-data-insights"><article><h4>중복 투표를 막는 기준</h4><p>사용자 ID와 글 ID의 조합을 고유하게 관리해, 같은 사람이 같은 글에 두 번 투표하지 못하도록 했습니다.</p></article><article><h4>댓글 접근을 허용하는 기준</h4><p>해당 글에 투표한 기록이 있는지 확인한 뒤, 댓글 조회와 작성을 허용하도록 정책을 연결했습니다.</p></article></div>
</section>`;
exports.prompt = () => `<section class="yx-prompt-story"><header class="yx-editorial-note"><h4>사연의 맥락을 담아,<br>서로 다른 두 관점으로.</h4><p>갈등 상황별 Few-shot 예시를 프롬프트에 담았습니다. 사연에 맞는 선택지를 만들고, 표현과 맥락이 적합한지 확인하는 흐름으로 설계했습니다.</p></header><ol class="yx-prompt-steps"><li><span>01</span><h5>갈등 맥락 파악</h5><p>사연에서 판단이 필요한 상황을 확인합니다.</p></li><li><span>02</span><h5>상황별 예시 제공</h5><p>Few-shot 예시로 선택지의 방향을 구체화합니다.</p></li><li><span>03</span><h5>두 관점 제시</h5><p>서로 다른 의견을 O/X 선택지로 구성합니다.</p></li><li><span>04</span><h5>표현·맥락 확인</h5><p>사연에 맞는 질문과 표현인지 확인합니다.</p></li></ol></section>`;

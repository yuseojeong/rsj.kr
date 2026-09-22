# 유서정 — Service Planner Portfolio

`npm run dev` 실행 후 http://127.0.0.1:4173 에서 확인할 수 있습니다. 패키지 설치는 필요하지 않습니다. 정적 호스팅에는 `index.html`, `work-01.html`~`work-03.html`, `css/`, `js/`, `images/`를 배포하면 됩니다.

## 디자인

메인은 라벤더·하늘색·로즈빛 하늘과 풀밭 일러스트, 반투명 글래스 헤더로 구성했습니다. 아래 소개·프로젝트 영역은 밝은 라벤더 톤을 유지합니다. 키보드 탐색, 모션 감소 설정, 프로젝트 필터와 안내 모달을 지원합니다.

### 메인 풍경과 움직임

- `images/hero-lavender-meadow.png`: 내장 imagegen으로 기존 풍경의 하늘 자체를 라벤더·하늘색·핑크빛으로 수정한 이미지입니다. 인물과 풀밭은 원래 색을 유지합니다. 이전 파란 하늘 원본은 `images/hero-night-meadow.png`에 보관합니다. 실제 촬영 사진이나 동영상이 아닙니다.
- `css/atmosphere.css`: 홈 전용 글래스 효과, 구름의 움직임, 반응형 배치를 관리합니다. 하늘 위에 덧씌우는 색상 레이어는 없습니다.
- `js/landscape.js`: 타이핑하는 손끝과 풀밭만 자동으로 미세하게 움직입니다. 머리카락·목·어깨를 변형하는 효과와 하늘 색상 보정은 제거했습니다. WebGL 미지원·컨텍스트 손실 시에도 수정된 이미지가 그대로 표시됩니다.
- `js/atmosphere.js`: 별·반딧불이·앞쪽 풀을 Canvas로 자동 재생합니다. 마우스 이동·클릭·터치에 반응하는 풍경 효과는 없습니다.
- 사용자가 일시정지할 수 있고 `prefers-reduced-motion` 설정에서는 기본 정지합니다. 화면 밖이나 비활성 탭에서는 애니메이션을 중단합니다.
- 참고용 GIF는 페이지에 포함하지 않습니다. 기존 3D 이미지 `images/hero-interests.png`는 보관하며 현재 메인에서는 숨겨져 있습니다.
- 생성 프롬프트와 참고 이미지 역할은 `images/NIGHT-PROMPT.md`에 기록했습니다.

## 실제 내용 연결

- `index.html`: 자기소개, 기술, 프로젝트 이름·설명·태그를 수정합니다. 프로젝트 커버는 HTML/CSS로 만든 예시이며 실제 작업물로 교체할 수 있습니다.
- 메인의 프로젝트 카드는 `work-01.html`~`work-03.html` 상세 페이지로 연결됩니다. 프로젝트 소개·기간·역할은 `data/projects.json`에서 관리하고, `npm run build`로 정적 상세 페이지를 다시 생성합니다. 홈페이지의 카드 이름과 설명은 `index.html`에서 함께 변경합니다.
- 연락처는 제공되지 않아 가짜 이메일·전화번호 대신 안내 모달을 연결했습니다. 실제 이메일이 준비되면 연락 버튼을 `mailto:` 링크로 교체하고 `js/main.js`의 `[data-contact]` 이벤트를 함께 제거합니다.
- About Me의 `images/profile.png`는 원본 프로젝트의 배경이 투명한 프로필 사진입니다. 별도 프레임 없이 소개 글 옆, 역량 카드 바로 위에 배치합니다.
- 웹 폰트는 Google Fonts에서 로드하며 연결이 안 되는 환경에서는 시스템 sans-serif를 사용합니다.

이미지 제작 정보는 `images/PROMPT.md`에 기록됩니다.

## 프로젝트 상세 페이지

소개 → 기획 산출물 → 결과·회고로 구성됩니다. 산출물은 문제 정의·리서치, 요구사항 정의서, 기능 명세서, IA·유저플로우, 화면 설계서, QA · QC 총 6종이며 문서 전환, 이전·다음 문서, 크게 보기, 직접 링크를 지원합니다. 예: `work-01.html#doc-requirements`.

실제 프로젝트 자료를 등록할 때는 `scripts/build-projects.js`의 `docs()`에서 문서 내용을 교체하세요. 생성된 HTML을 직접 수정하면 다음 빌드에서 덮어씁니다.

각 프로젝트의 `sourceUrls`에 문서 ID별 HTTPS URL을 넣으면 해당 문서의 ‘원본 보기’ 링크가 활성화됩니다. 미등록 문서는 ‘원본 파일 등록 예정’으로 표시됩니다. Figma, Notion, 공개 문서 링크를 연결할 수 있습니다. `wireframes`에 Figma URL을 넣으면 해당 화면 설계서를 Figma 임베드로 표시합니다.

```json
"sourceUrls": {
  "research": "https://example.com/research",
  "requirements": "https://example.com/requirements",
  "policy": "https://example.com/policy",
  "flow": "https://example.com/flow",
  "wireframes": "https://example.com/wireframes",
  "validation": "https://example.com/prototype"
}
```

변경 후 `npm run build`와 `npm run check`를 실행하세요.

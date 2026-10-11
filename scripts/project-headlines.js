// Shared by the page generator and the project pages' editorial copy.
module.exports = {
  ssok: {
    research: '저장한 링크를 다시 찾기 어려운 이유를 설문으로 살펴봤습니다.',
    persona: '페르소나·유저저니로 UX와 UI 기획의 판단 기준을 맞췄습니다.',
    requirements: '워킹 스켈레톤 기법으로 MVP 기능 범위를 정했습니다.',
    policy: '개발 중 혼선을 막도록 기능별 처리 기준과 예외를 정의했습니다.',
    flow: '저장과 그룹 참여가 이어지도록 사용자 분기와 동선을 설계했습니다.',
    wireframes: '저장·공유 흐름에 맞춰 IA별 화면·정책·예외를 정리했습니다.',
    ut: '입력 부담을 줄이는지 수행 시간·오조작을 UT와 A/B로 확인했습니다.'
  },
  koach: {
    research: '관계에 맞는 한국어가 어려운 이유를 학습자 설문으로 살펴봤습니다.',
    requirements: '관계별 표현을 연습하도록 거리감 설정과 교정을 요구사항에 담았습니다.',
    policy: '거리감에 맞게 대화가 이어지도록 입력·응답·예외 기준을 정했습니다.',
    flow: '배운 표현을 다시 익히도록 대화·보관·복습 동선을 연결했습니다.',
    wireframe: '대화와 교정을 쉽게 오가도록 화면의 정보와 버튼을 배치했습니다.',
    wireframes: '대화·학습 흐름에 맞춰 IA별 화면·정책·예외를 정리했습니다.',
    'data-guide': '리텐션과 표현 보관·복습 흐름을 확인할 행동 지표를 정했습니다.',
    validation: '학습 흐름의 끊김을 찾도록 가입·대화·보관의 점검 기준을 정했습니다.',
    ut: '거리감 조절·교정을 스스로 이해하고 쓰는지 확인할 UT를 기획했습니다.',
    backlog: '대화 학습을 먼저 구현하도록 MVP와 고도화 과제를 나눴습니다.'
  },
  yeonox: Object.fromEntries(require('./yeonox-case').map(doc => [doc.id, doc.head]))
};

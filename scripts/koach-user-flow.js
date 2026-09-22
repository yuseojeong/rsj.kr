// Editable nodes and connectors preserve the supplied process, including both entry routes.
module.exports = function koachUserFlow() {
  const nodes = [];
  const edges = [];
  const node = (id, x, y, label, kind = '', width = 170, height = 50) => {
    nodes.push({id, x, y, label, kind, width, height});
    return id;
  };
  const edge = (d, arrow = true) => edges.push(`<path d="${d}"${arrow ? ' marker-end="url(#koach-flow-arrow)"' : ''}/>`);
  const stack = (prefix, x, startY, labels, gap = 76, width = 170) => {
    labels.forEach((label, i) => {
      node(`${prefix}-${i}`, x, startY + i * gap, label, '', width);
      if (i) edge(`M${x + width / 2} ${startY + (i - 1) * gap + 50} V${startY + i * gap - 5}`);
    });
  };
  const stages = [['로그인',110,170],['채팅방 선택',480,170],['채팅',760,170],['보관함',1010,170],['종료',1220,90]];
  stages.forEach(([label,x,width],i) => {
    node(`stage-${i}`, x, 20, label, 'stage', width, 56);
    if(i < stages.length - 1) edge(`M${x + width + 7} 48 H${stages[i + 1][1] - 9}`);
    if(i < stages.length - 1) edge(`M${x + width / 2} 76 V135`, false);
  });
  node('login-entry',110,140,'로그인 페이지 접근');
  node('signup',10,236,'회원가입','branch',170);
  node('email',220,236,'이메일 입력','',170);
  edge('M195 190 V206 Q195 216 185 216 H105 Q95 216 95 226 V231');
  edge('M195 190 V206 Q195 216 205 216 H295 Q305 216 305 226 V231');
  stack('signup',10,312,['회원가입 페이지 접근','유저 이름 입력','이메일 입력','이메일 인증','비밀번호 입력','서비스 이용약관 확인','개인정보 처리방침 확인','회원가입 버튼 선택','가입 완료','채팅 목록으로 이동']);
  stack('login',220,312,['비밀번호 입력','로그인 버튼 선택','성공','채팅 목록으로 이동']);
  edge('M95 286 V307');
  edge('M305 286 V307');
  // Both successful entry routes converge before selecting a chat room.
  edge('M180 1021 H402 Q432 1021 432 991 V185 Q432 165 452 165 H475');
  edge('M390 565 H412 Q432 565 432 545',false);
  stack('room',480,140,['채팅방 선택','채팅방 접속']);
  edge('M650 241 H683 Q700 241 700 224 V182 Q700 165 717 165 H755');
  stack('chat',760,140,['거리감 슬라이더 설정','챗봇 그리팅 문구 등장','코치마크 확인','채팅 내용 입력','챗봇 답변 및 교정','보관할 표현 북마크']);
  edge('M930 545 H952 Q972 545 972 525 V185 Q972 165 992 165 H1005');
  stack('archive',1010,140,['보관함 히스토리','채팅방 선택','보관된 표현 확인']);
  const renderNode = ({id,x,y,label,kind,width,height}) => `<g class="process-node ${kind}" data-flow-node="${id}"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${kind === 'stage' ? 17 : 10}"/><text x="${x + width/2}" y="${y + height/2}" dominant-baseline="central" text-anchor="middle">${label}</text></g>`;
  return `<figure class="koach-process"><figcaption><div><span class="process-kicker">USER FLOW</span><h4>시작부터 다시 학습하기까지</h4></div><p>회원가입과 로그인은 채팅 목록으로 이어지고,<br>대화에서 보관한 표현은 채팅방별로 다시 확인합니다.</p></figcaption><div class="process-legend"><span><i></i>주요 단계</span><span><i></i>사용자 행동</span><span>→ 이동 흐름</span></div><div class="process-scroll" tabindex="0" role="region" aria-label="전체 유저플로우. 작은 화면에서는 좌우로 스크롤할 수 있습니다."><svg class="process-diagram" viewBox="0 0 1330 1060" role="img" aria-labelledby="koach-flow-title koach-flow-description"><title id="koach-flow-title">koach 전체 사용자 프로세스</title><desc id="koach-flow-description">로그인 페이지에서 회원가입과 이메일 로그인으로 분기합니다. 두 경로 모두 채팅 목록으로 이동한 후 채팅방을 선택합니다. 거리감 설정, 챗봇 인사, 코치마크, 문장 입력, 답변 및 교정을 거쳐 표현을 북마크합니다. 보관함에서 채팅방을 선택하고 저장한 표현을 다시 확인합니다.</desc><defs><marker id="koach-flow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7" fill="none" stroke="#aaa1bb" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><g class="process-edges">${edges.join('')}</g>${nodes.map(renderNode).join('')}</svg></div></figure>`;
};

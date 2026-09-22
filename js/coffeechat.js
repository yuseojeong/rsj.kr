(() => {
  const dialog = document.querySelector('.coffeechat-dialog');
  if (!dialog) return;
  const form = dialog.querySelector('.coffeechat-composer');
  const input = form.querySelector('textarea');
  const sendButton = form.querySelector('button[type="submit"]');
  const messages = dialog.querySelector('.coffeechat-messages');
  const guide = form.querySelector('.coffeechat-guide');
  const introduction = dialog.querySelector('.coffeechat-introduction');
  const introductions = [
    '안녕하세요,\n유서정입니다.',
    '요즘은 바이브 코딩으로\n앱을 만들고 있어요.',
    '반복 업무를 줄이기 위한\n자동화 스킬 구축에 관심이 많아요.',
    '웹페이지를 기획하고\n직접 만드는 게 재밌어요.',
    '떠오른 아이디어는\n직접 만들어보는 편이에요.',
    '서로의 생각을 나누며\n함께 배우는 팀이 좋아요.',
  ];
  let introIndex = 0;
  let introTimer;
  let introTransition;
  function showIntroduction() {
    introduction.textContent = introductions[introIndex];
    introduction.classList.remove('is-changing');
  }
  function stopIntroduction() {
    clearInterval(introTimer);
    clearTimeout(introTransition);
    introduction.classList.remove('is-changing');
  }
  function canRotateIntroduction() {
    return dialog.open && !dialog.classList.contains('has-conversation');
  }
  function startIntroduction() {
    stopIntroduction();
    if (dialog.classList.contains('has-conversation')) return;
    showIntroduction();
    introTimer = setInterval(() => {
      if (!canRotateIntroduction()) return;
      introduction.classList.add('is-changing');
      introTransition = setTimeout(() => {
        if (canRotateIntroduction()) introIndex = (introIndex + 1) % introductions.length;
        showIntroduction();
      }, 250);
    }, 3800);
  }
  dialog.addEventListener('coffeechat:open', () => {
    dialog.classList.remove('has-conversation');
    messages.replaceChildren();
    messages.hidden = true;
    introIndex = 0;
    startIntroduction();
  });
  dialog.addEventListener('close', stopIntroduction);
  const guideQuestions = [
    '서정님은 어떤 일을 할 때 가장 몰입하나요?',
    '코치 프로젝트에서는 어떤 역할을 맡았나요?',
    '기획할 때 가장 중요하게 생각하는 건 무엇인가요?',
    '어려운 문제를 해결했던 경험을 들려주세요.',
  ];
  let guideIndex = 0;
  let guideTimer;
  let guideTransition;
  let composing = false;
  function showGuide() {
    guide.textContent = guideQuestions[guideIndex];
    input.placeholder = guideQuestions[guideIndex];
    guide.hidden = input.value.length > 0 || composing;
    guide.classList.remove('is-changing');
  }
  function stopGuide() {
    clearInterval(guideTimer);
    clearTimeout(guideTransition);
    guide.classList.remove('is-changing');
  }
  function startGuide() {
    stopGuide();
    showGuide();
    guideTimer = setInterval(() => {
      if (!dialog.open || document.hidden || input.value.length || composing) return;
      guide.classList.add('is-changing');
      guideTransition = setTimeout(() => {
        if (!dialog.open || input.value.length || composing) {
          showGuide();
          return;
        }
        guideIndex = (guideIndex + 1) % guideQuestions.length;
        showGuide();
      }, 180);
    }, 4500);
  }
  form.classList.add('has-rotating-guide');
  showGuide();
  dialog.addEventListener('coffeechat:open', startGuide);
  dialog.addEventListener('close', stopGuide);
  const viewport = window.visualViewport;
  function updateViewport() {
    if (!dialog.open || !viewport) return;
    dialog.style.setProperty('--coffeechat-height', `${viewport.height}px`);
    dialog.style.setProperty('--coffeechat-offset', `${viewport.offsetTop}px`);
  }
  viewport?.addEventListener('resize', updateViewport);
  viewport?.addEventListener('scroll', updateViewport);
  dialog.addEventListener('coffeechat:open', updateViewport);

  function updateInput() {
    clearTimeout(guideTransition);
    showGuide();
    sendButton.disabled = !input.value.trim() || !input.validity.valid;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  }

  input.addEventListener('input', updateInput);
  input.addEventListener('compositionstart', () => { composing = true; showGuide(); });
  input.addEventListener('compositionend', () => { composing = false; updateInput(); });
  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || composing || event.keyCode === 229) return;
    event.preventDefault();
    if (!sendButton.disabled) form.requestSubmit();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || composing || !input.validity.valid || !dialog.open) return;

    // Local preview only: no AI response or delivery to the portfolio owner is implied.
    const message = document.createElement('p');
    message.className = 'coffeechat-message';
    message.textContent = text;
    message.setAttribute('aria-label', `내 메시지: ${text}`);
    messages.hidden = false;
    messages.append(message);
    stopIntroduction();
    dialog.classList.add('has-conversation');
    introduction.textContent = '편하게 이야기 나눠요.';
    input.value = '';
    guideIndex = (guideIndex + 1) % guideQuestions.length;
    startGuide();
    updateInput();
    input.focus({ preventScroll: true });
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
  });
})();

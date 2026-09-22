const filterButtons = [...document.querySelectorAll('.filter-tab')];
const projects = [...document.querySelectorAll('.work-card')];
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    projects.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter); });
    document.querySelector('#filter-status').textContent = `${button.textContent.trim()} 프로젝트 ${projects.filter(card => !card.hidden).length}개`;
  });
});

const dialog = document.querySelector('#info-dialog');
let coffeechatSession = 0;
let coffeechatTimers = [];
function resetCoffeechatEntrance() {
  coffeechatSession += 1;
  coffeechatTimers.forEach(clearTimeout);
  coffeechatTimers = [];
  dialog.classList.remove('intro-visible', 'chat-ready');
}
async function revealCoffeechat() {
  resetCoffeechatEntrance();
  const session = coffeechatSession;
  await Promise.allSettled([...dialog.querySelectorAll('.hero-scene img')].map(image => image.decode()));
  if (!dialog.open || session !== coffeechatSession) return;
  if (dialog.classList.contains('has-conversation') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialog.classList.add('intro-visible', 'chat-ready');
    return;
  }
  coffeechatTimers.push(setTimeout(() => dialog.classList.add('intro-visible'), 650));
  coffeechatTimers.push(setTimeout(() => dialog.classList.add('chat-ready'), 1600));
}
document.querySelectorAll('button[data-contact]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.contact !== 'coffeechat') return;
    dialog.showModal();
    document.body.classList.add('coffeechat-open');
    dialog.dispatchEvent(new Event('coffeechat:open'));
    revealCoffeechat();
  });
});
document.querySelector('.coffeechat-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('coffeechat-open');
  resetCoffeechatEntrance();
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

const navLinks = [...document.querySelectorAll('.nav-links a')];
const signatureHero = document.querySelector('.signature-hero');
const heroMotionButton = document.querySelector('.hero-motion-toggle');
heroMotionButton?.addEventListener('click', () => {
  const paused = heroMotionButton.getAttribute('aria-pressed') !== 'true';
  signatureHero.classList.toggle('is-motion-paused', paused);
  heroMotionButton.setAttribute('aria-pressed', String(paused));
  heroMotionButton.setAttribute('aria-label', paused ? '메인 표지 움직임 재생' : '메인 표지 움직임 멈추기');
  heroMotionButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
  heroMotionButton.lastElementChild.textContent = paused ? '움직임 재생' : '움직임 멈추기';
});
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => { element.classList.add('will-reveal'); revealObserver.observe(element); });
  }
}

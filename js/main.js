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
const siteHeader = document.querySelector('.resume-home .site-header');
if (siteHeader && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let previousScrollY = window.scrollY;
  let idleTimer;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const isNearTop = currentScrollY < 90;
    const scrollingUp = currentScrollY < previousScrollY;
    if (isNearTop || scrollingUp) siteHeader.classList.remove('is-nav-hidden');
    else if (currentScrollY - previousScrollY > 6) siteHeader.classList.add('is-nav-hidden');
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => siteHeader.classList.remove('is-nav-hidden'), 360);
    previousScrollY = currentScrollY;
  }, { passive: true });
}
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

const filterButtons = [...document.querySelectorAll('[data-analysis-filter]')];
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
const search = document.querySelector('[data-analysis-search]');
const cards = [...document.querySelectorAll('[data-analysis-category]')];
let category = '전체';
function filterAnalysis() {
  const query = (search?.value || '').trim().toLocaleLowerCase();
  let visible=0;
  cards.forEach(card=>{
    card.hidden = (category !== '전체' && card.dataset.analysisCategory !== category) || !card.textContent.toLocaleLowerCase().includes(query);
    if(!card.hidden)visible++;
  });
  document.querySelector('[data-analysis-count]').textContent = `${visible}개의 기록`;
  document.querySelector('.analysis-empty').hidden = visible>0;
}
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  category = button.dataset.analysisFilter;
  filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  filterAnalysis();
}));
search?.addEventListener('input',filterAnalysis);

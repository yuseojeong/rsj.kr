const sectionLinks = [...document.querySelectorAll('.project-tabs a')];
const docLinks = [...document.querySelectorAll('.document-choice')];

// pre-line preserves authored lists, but must not render HTML indentation as blank rows.
document.querySelectorAll('.document-canvas th, .document-canvas td').forEach(cell => {
  for (const edge of ['firstChild', 'lastChild']) {
    while (cell[edge]?.nodeType === Node.TEXT_NODE) {
      const node = cell[edge];
      node.textContent = edge === 'firstChild'
        ? node.textContent.trimStart()
        : node.textContent.trimEnd();
      if (node.textContent) break;
      node.remove();
    }
  }
});

if (document.body.classList.contains('theme-koach')) {
  document.querySelectorAll('.case-table-wrap').forEach((wrap) => {
    const table = wrap.querySelector('table');
    const rows = [...table.tBodies[0].rows];
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', table.caption?.textContent || '산출물 표');
    if (table.classList.contains('qa-scenario-table')) {
      const toolbar = document.createElement('div');
      toolbar.className = 'table-toolbar';
      const count = document.createElement('span');
      count.className = 'sr-only';
      count.setAttribute('role', 'status');
      toolbar.append(count);
      wrap.before(toolbar);
      const input = document.createElement('input');
      input.type = 'search';
      input.placeholder = 'QA 번호, 화면, 시나리오 검색';
      input.setAttribute('aria-label', 'QA 테스트 시나리오 검색');
      toolbar.append(input);
      const empty = document.createElement('p');
      empty.className = 'qa-empty';
      empty.textContent = '일치하는 테스트 시나리오가 없습니다.';
      empty.hidden = true;
      empty.setAttribute('role', 'status');
      wrap.after(empty);
      input.addEventListener('input', () => {
        const query = input.value.trim().toLocaleLowerCase();
        let visible = 0;
        rows.forEach(row => {
          row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
          if (!row.hidden) visible++;
        });
        count.textContent = `${rows.length}개 중 ${visible}개 항목`;
        empty.hidden = visible > 0;
        wrap.scrollTop = 0;
      });
      rows.forEach(row => [...row.cells].slice(6).forEach(cell => {
        const value = cell.textContent.trim();
        if (!value) return;
        const badge = document.createElement('span');
        badge.className = 'qa-badge';
        badge.dataset.status = value;
        badge.textContent = value;
        cell.replaceChildren(badge);
      }));
    }
  });
}


function markDocument(id) {
  docLinks.forEach(link => {
    const current = link.dataset.document === id;
    link.classList.toggle('is-selected', current);
    if (current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  const menu = document.querySelector('.document-menu');
  const selected = menu?.querySelector('.is-selected');
  if (menu && selected && matchMedia('(max-width:760px)').matches) {
    const offset = selected.getBoundingClientRect().left - menu.getBoundingClientRect().left;
    if (offset < 0 || offset + selected.offsetWidth > menu.clientWidth) {
      menu.scrollTo({left:menu.scrollLeft + offset - 12,behavior:'instant'});
    }
  }
}

// Follow the reading position even inside a very long table or embedded document.
const documentSteps = [...document.querySelectorAll('.doc-step')];
const documentMenu = document.querySelector('.document-menu');
if (documentMenu && documentSteps.length) {
  const sizeMenu = () => {
    const headerHeight = document.querySelector('.shared-header')?.offsetHeight || 0;
    const tabsHeight = document.querySelector('.project-tabs')?.offsetHeight || 0;
    documentMenu.style.setProperty('--document-menu-height', `${documentMenu.scrollHeight}px`);
    documentMenu.style.setProperty('--document-nav-offset', `${headerHeight + tabsHeight}px`);
  };
  new ResizeObserver(sizeMenu).observe(documentMenu);
  document.fonts.ready.then(sizeMenu);
  let pending = false;
  function updateReadingPosition() {
    pending = false;
    const readingLine = Math.max(185, innerHeight * .28);
    let current = documentSteps[0];
    for (const step of documentSteps) {
      if (step.getBoundingClientRect().top <= readingLine) current = step;
      else break;
    }
    markDocument(current.id.replace('doc-', ''));
  }
  const scheduleUpdate = () => {
    if (!pending) { pending = true; requestAnimationFrame(updateReadingPosition); }
  };
  addEventListener('scroll', scheduleUpdate, {passive:true});
  addEventListener('resize', scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(document.querySelector('.document-stream'));
  scheduleUpdate();
}

// Reserve the preceding images before settling a link opened from the home page.
// Lazy images above a document otherwise move the destination after navigation.
async function settleInitialDocumentLink() {
  const initialHash = location.hash;
  if (!initialHash.startsWith('#doc-')) return;
  const target = document.getElementById(initialHash.slice(1));
  if (!target) return;
  let interrupted = false;
  const stop = () => { interrupted = true; };
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  events.forEach(event => window.addEventListener(event, stop, { passive: true, once: true }));
  const images = [...document.images].filter(img =>
    Boolean(img.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
  );
  await Promise.all([
    document.fonts.ready,
    ...images.map(img => {
      img.loading = 'eager';
      return img.decode().catch(() => {});
    })
  ]);
  requestAnimationFrame(() => {
    if (!interrupted && location.hash === initialHash) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      markDocument(target.id.replace('doc-', ''));
    }
    events.forEach(event => window.removeEventListener(event, stop));
  });
}
settleInitialDocumentLink();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), {rootMargin:'-12% 0px -55% 0px'});
  document.querySelectorAll('#overview, #deliverables, #reflection').forEach(section => observer.observe(section));

}

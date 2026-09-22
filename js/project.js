const sectionLinks = [...document.querySelectorAll('.project-tabs a')];
const docLinks = [...document.querySelectorAll('.document-choice')];

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
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), {rootMargin:'-12% 0px -55% 0px'});
  document.querySelectorAll('#overview, #deliverables, #reflection').forEach(section => observer.observe(section));

  // The document whose top has passed the upper third of the viewport is the one being read.
  const docObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) markDocument(entry.target.id.replace('doc-', ''));
  }), {rootMargin:'-30% 0px -65% 0px'});
  document.querySelectorAll('.doc-step').forEach(step => docObserver.observe(step));
}

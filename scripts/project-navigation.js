const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

module.exports = function projectNavigation(projects, index) {
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const link = (project, direction, label, path) => `<a class="project-edge-link project-edge-${direction}" href="work-${escape(project.id)}.html" aria-label="${label} 프로젝트: ${escape(project.name)}" title="${label} 프로젝트 · ${escape(project.name)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><span>${label}</span><span class="project-edge-name">${escape(project.name)}</span></a>`;
  return `<nav class="project-edge-nav" aria-label="이전·다음 프로젝트">${link(previous, 'prev', '이전', 'M15 5l-7 7 7 7')}${link(next, 'next', '다음', 'M9 5l7 7-7 7')}</nav>`;
};

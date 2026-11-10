// One navigation for the home, studies and project documents.
module.exports = function siteHeader(section = 'home') {
  const home = section === 'home';
  const root = home ? '' : 'index.html';
  return `<header class="site-header shared-header"><nav class="site-nav" aria-label="주 메뉴"><a class="brand" href="${home ? '#page-top' : 'index.html'}" aria-label="유서정 홈">seojeong<span class="brand-star" aria-hidden="true">✳</span></a><div class="nav-links"><a href="${root}#about">소개</a><a href="${root}#work"${section === 'projects' ? ' aria-current="page"' : ''}>프로젝트</a><a href="notes.html"${section === 'study' ? ' aria-current="page"' : ''}>스터디</a></div><a class="resume-contact" href="${root}#contact">연락하기 <span aria-hidden="true">↗</span></a></nav></header>`;
};

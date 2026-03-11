export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const nav = document.createElement('nav');
  nav.className = 'navigation-list-nav';
  nav.setAttribute('aria-label', 'Page navigation');

  const list = document.createElement('ul');
  list.className = 'navigation-list-items';
  const currentPath = window.location.pathname;

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const li = document.createElement('li');
    li.className = 'navigation-list-item';

    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'navigation-list-link';
    a.textContent = link.textContent;

    if (new URL(a.href, window.location.origin).pathname === currentPath) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }

    li.append(a);
    list.append(li);
  });

  nav.append(list);
  el.textContent = '';
  el.append(nav);
}

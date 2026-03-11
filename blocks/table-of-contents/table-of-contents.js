function buildTocList(headings) {
  const list = document.createElement('ul');
  list.className = 'toc-list';

  headings.forEach((heading) => {
    const id = heading.id || heading.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    if (!heading.id) heading.id = id;

    const li = document.createElement('li');
    li.className = heading.tagName === 'H3' ? 'toc-item toc-item-sub' : 'toc-item';

    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = heading.textContent;
    a.className = 'toc-link';

    a.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    });

    li.append(a);
    list.append(li);
  });

  return list;
}

function observeHeadings(headings, el) {
  const links = el.querySelectorAll('.toc-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('is-active', isActive);
      });
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  headings.forEach((heading) => observer.observe(heading));
}

function buildMobileToggle(el, titleText) {
  const toggle = document.createElement('button');
  toggle.className = 'toc-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'toc-content');
  toggle.textContent = titleText;

  const icon = document.createElement('span');
  icon.className = 'toc-toggle-icon';
  toggle.append(icon);

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    el.classList.toggle('is-open', !expanded);
  });

  return toggle;
}

export default function init(el) {
  const headings = [...document.querySelectorAll('main h2, main h3')];
  if (!headings.length) return;

  // Read optional title from first authored row, default to 'On this page'
  const rows = [...el.querySelectorAll(':scope > div')];
  const authoredTitle = rows[0]?.textContent?.trim() || 'On this page';

  const title = document.createElement('h4');
  title.className = 'toc-title';
  title.textContent = authoredTitle;

  const list = buildTocList(headings);
  const toggle = buildMobileToggle(el, authoredTitle);

  const content = document.createElement('nav');
  content.id = 'toc-content';
  content.className = 'toc-content';
  content.setAttribute('aria-label', 'Table of contents');
  content.append(title, list);

  el.textContent = '';
  el.append(toggle, content);

  observeHeadings(headings, el);
}

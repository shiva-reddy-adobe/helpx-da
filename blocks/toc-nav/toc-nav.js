async function fetchTocData(url) {
  const resp = await fetch(url);
  if (!resp.ok) return [];
  const json = await resp.json();
  return json.data || json;
}

function isQueryIndex(items) {
  return items.length > 0 && items[0].path && !items[0].level;
}

function getPathSegments(path) {
  return path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
}

function formatTitle(segment) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function transformQueryIndex(items) {
  const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));
  const result = [];
  const sectionPaths = new Set();

  // First pass: identify section (parent) paths
  sorted.forEach((item) => {
    const segments = getPathSegments(item.path);
    if (segments.length >= 2) {
      // Register the first segment as a section
      sectionPaths.add(`/${segments[0]}`);
    }
  });

  // Group items by their top-level section
  const sections = new Map();
  sorted.forEach((item) => {
    const segments = getPathSegments(item.path);
    const sectionKey = segments.length >= 2 ? `/${segments[0]}` : item.path;

    if (!sections.has(sectionKey)) {
      sections.set(sectionKey, []);
    }
    sections.get(sectionKey).push(item);
  });

  sections.forEach((children, sectionKey) => {
    // Find the section root page or create a title from the path
    const sectionRoot = children.find((c) => c.path === sectionKey);
    const sectionTitle = sectionRoot ? sectionRoot.title : formatTitle(sectionKey.replace(/^\//, ''));

    result.push({
      title: sectionTitle,
      path: sectionKey,
      level: 1,
    });

    children.forEach((child) => {
      if (child.path === sectionKey) return; // skip section root, already added
      const segments = getPathSegments(child.path);
      const level = Math.min(segments.length, 3); // cap at 3
      result.push({
        title: child.title,
        path: child.path,
        level,
      });
    });
  });

  return result;
}

function buildNavTree(items) {
  const nav = document.createElement('nav');
  nav.className = 'toc-nav-tree';
  nav.setAttribute('aria-label', 'Product navigation');

  let currentSection = null;
  let currentList = null;
  const currentPath = window.location.pathname;

  items.forEach((item) => {
    const level = parseInt(item.level, 10) || 1;

    if (level === 1) {
      const section = document.createElement('div');
      section.className = 'toc-nav-section';

      const header = document.createElement('button');
      header.className = 'toc-nav-section-header';
      header.setAttribute('aria-expanded', 'false');
      header.textContent = item.title;

      const icon = document.createElement('span');
      icon.className = 'toc-nav-chevron';
      header.append(icon);

      currentList = document.createElement('ul');
      currentList.className = 'toc-nav-list';
      currentList.setAttribute('hidden', '');

      header.addEventListener('click', () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', String(!expanded));
        if (expanded) {
          currentList.setAttribute('hidden', '');
        } else {
          currentList.removeAttribute('hidden');
        }
      });

      section.append(header, currentList);
      nav.append(section);
      currentSection = section;

      if (item.path) {
        const link = document.createElement('a');
        link.href = item.path;
        link.className = 'toc-nav-section-link';
        link.textContent = item.title;
        if (currentPath === item.path || currentPath.startsWith(`${item.path}/`)) {
          link.classList.add('is-current');
          header.setAttribute('aria-expanded', 'true');
          currentList.removeAttribute('hidden');
        }
        const li = document.createElement('li');
        li.className = 'toc-nav-item';
        li.append(link);
        currentList.append(li);
      }
    } else if (currentList) {
      const li = document.createElement('li');
      li.className = level === 3 ? 'toc-nav-item toc-nav-item-sub' : 'toc-nav-item';

      const link = document.createElement('a');
      link.href = item.path || '#';
      link.className = 'toc-nav-link';
      link.textContent = item.title;

      if (currentPath === item.path) {
        link.classList.add('is-current');
        li.classList.add('is-current');
        const header = currentSection?.querySelector('.toc-nav-section-header');
        if (header) {
          header.setAttribute('aria-expanded', 'true');
          currentList.removeAttribute('hidden');
        }
      }

      li.append(link);
      currentList.append(li);
    }
  });

  return nav;
}

function buildMobileToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'toc-nav-mobile-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.innerHTML = '<span class="toc-nav-hamburger"></span><span>Navigation</span>';

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.closest('.toc-nav').classList.toggle('is-open', !expanded);
  });

  return toggle;
}

export default async function init(el) {
  const link = el.querySelector('a');
  const sheetUrl = link ? link.href : el.textContent.trim();
  if (!sheetUrl) return;

  let items = await fetchTocData(sheetUrl);
  if (!items.length) return;

  // Auto-detect query index format (has path but no level) and transform
  if (isQueryIndex(items)) {
    items = transformQueryIndex(items);
  }

  const toggle = buildMobileToggle();
  const tree = buildNavTree(items);

  const wrapper = document.createElement('div');
  wrapper.className = 'toc-nav-wrapper';
  wrapper.append(tree);

  el.textContent = '';
  el.append(toggle, wrapper);
}

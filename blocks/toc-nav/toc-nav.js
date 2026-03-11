function parseTocRows(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const sections = [];
  let currentSection = null;

  rows.forEach((row) => {
    const link = row.querySelector('a');
    const text = row.textContent.trim();
    if (!text) return;

    if (link) {
      // This is a link item — add to current section
      if (currentSection) {
        currentSection.links.push({ title: link.textContent.trim(), href: link.href });
      }
    } else {
      // No link — this is a section header
      currentSection = { title: text, links: [] };
      sections.push(currentSection);
    }
  });

  return sections;
}

function buildNavTree(sections) {
  const nav = document.createElement('nav');
  nav.className = 'toc-nav-tree';
  nav.setAttribute('aria-label', 'Product navigation');

  // Home link
  const homeDiv = document.createElement('div');
  homeDiv.className = 'toc-nav-home-link';
  const homeLink = document.createElement('a');
  homeLink.href = '/support.html';
  homeLink.textContent = 'Adobe Help Center';
  homeDiv.append(homeLink);
  nav.append(homeDiv);

  // Product link
  const productBadge = document.querySelector('.product-badge');
  let productName = '';
  if (productBadge) {
    const cells = productBadge.querySelectorAll('td');
    if (cells.length > 0) {
      productName = cells[cells.length - 1].textContent.trim();
    }
    if (!productName) productName = productBadge.textContent.trim();
  }
  if (!productName) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      productName = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
    }
  }
  if (productName) {
    const productDiv = document.createElement('div');
    productDiv.className = 'toc-nav-product-link selected';
    const productLink = document.createElement('a');
    productLink.href = window.location.pathname;
    productLink.textContent = `${productName} Desktop Help`;
    productDiv.append(productLink);
    nav.append(productDiv);
  }

  const currentPath = window.location.pathname;

  sections.forEach((section) => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'toc-nav-section';

    const header = document.createElement('button');
    header.className = 'toc-nav-section-header';
    header.setAttribute('aria-expanded', 'false');

    const titleSpan = document.createElement('span');
    titleSpan.textContent = section.title;
    const icon = document.createElement('span');
    icon.className = 'toc-nav-chevron';
    header.append(titleSpan, icon);

    const list = document.createElement('ul');
    list.className = 'toc-nav-list';
    list.setAttribute('hidden', '');

    let sectionHasCurrent = false;

    section.links.forEach((link) => {
      const li = document.createElement('li');
      li.className = 'toc-nav-item';
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'toc-nav-link';
      a.textContent = link.title;

      const linkPath = new URL(a.href, window.location.origin).pathname;
      if (currentPath === linkPath) {
        a.classList.add('is-current');
        sectionHasCurrent = true;
      }

      li.append(a);
      list.append(li);
    });

    // Auto-expand section containing current page
    if (sectionHasCurrent) {
      header.setAttribute('aria-expanded', 'true');
      list.removeAttribute('hidden');
    }

    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        list.setAttribute('hidden', '');
      } else {
        list.removeAttribute('hidden');
      }
    });

    sectionEl.append(header, list);
    nav.append(sectionEl);
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
  const sections = parseTocRows(el);
  if (!sections.length) return;

  const toggle = buildMobileToggle();
  const tree = buildNavTree(sections);

  const wrapper = document.createElement('div');
  wrapper.className = 'toc-nav-wrapper';
  wrapper.append(tree);

  el.textContent = '';
  el.append(toggle, wrapper);
}

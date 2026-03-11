function getPageSections(el) {
  const sections = [];
  const main = el.closest('main') || document.querySelector('main');
  if (!main) return sections;

  // Find all section-level divs in main that contain h2 headings (content sections)
  const allSections = main.querySelectorAll(':scope > .section, :scope > div');
  allSections.forEach((section) => {
    // Skip sections containing blocks (toc-nav, product-badge, navigation-list, metadata)
    if (section.querySelector('.toc-nav, .product-badge, .navigation-list, .metadata')) return;

    const h2 = section.querySelector('h2');
    if (!h2) return;

    const sectionData = {
      title: h2.textContent.trim(),
      id: h2.id || h2.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      children: [],
    };

    // Find the content container (may be .default-content-wrapper or the section itself)
    const container = section.querySelector('.default-content-wrapper') || section;

    // Collect h3 sub-sections
    const h3s = container.querySelectorAll('h3');
    if (h3s.length > 0) {
      h3s.forEach((h3) => {
        const subSection = {
          title: h3.textContent.trim(),
          id: h3.id || h3.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          links: [],
        };
        // Get links in the UL following this h3
        let next = h3.nextElementSibling;
        while (next && next.tagName !== 'H3' && next.tagName !== 'H2') {
          if (next.tagName === 'UL') {
            next.querySelectorAll('a').forEach((a) => {
              subSection.links.push({ title: a.textContent.trim(), href: a.href });
            });
          }
          next = next.nextElementSibling;
        }
        sectionData.children.push(subSection);
      });
    } else {
      // No h3s — collect links directly
      container.querySelectorAll('ul a').forEach((a) => {
        sectionData.children.push({ title: a.textContent.trim(), href: a.href });
      });
    }

    sections.push(sectionData);
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

  // Product link — find product name from badge block or page title
  const productBadge = document.querySelector('.product-badge');
  let productName = '';
  if (productBadge) {
    // The badge may still contain raw table cells; extract text from last cell
    const cells = productBadge.querySelectorAll('td');
    if (cells.length > 0) {
      productName = cells[cells.length - 1].textContent.trim();
    } else {
      productName = productBadge.textContent.trim();
    }
  }
  if (!productName) {
    // Fallback: derive from URL path
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

    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        list.setAttribute('hidden', '');
      } else {
        list.removeAttribute('hidden');
      }
    });

    // Build child items
    section.children.forEach((child) => {
      if (child.links && child.links.length > 0) {
        // Sub-section with h3 title and links
        const subHeader = document.createElement('li');
        subHeader.className = 'toc-nav-item toc-nav-subheader';
        subHeader.textContent = child.title;
        list.append(subHeader);

        child.links.forEach((link) => {
          const li = document.createElement('li');
          li.className = 'toc-nav-item toc-nav-item-sub';
          const a = document.createElement('a');
          a.href = link.href;
          a.className = 'toc-nav-link';
          a.textContent = link.title;
          if (window.location.pathname === new URL(a.href, window.location.origin).pathname) {
            a.classList.add('is-current');
          }
          li.append(a);
          list.append(li);
        });
      } else if (child.href) {
        // Direct link (no sub-sections)
        const li = document.createElement('li');
        li.className = 'toc-nav-item';
        const a = document.createElement('a');
        a.href = child.href;
        a.className = 'toc-nav-link';
        a.textContent = child.title;
        if (window.location.pathname === new URL(a.href, window.location.origin).pathname) {
          a.classList.add('is-current');
        }
        li.append(a);
        list.append(li);
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
  // Build TOC from the page's own content sections
  const sections = getPageSections(el);
  if (!sections.length) return;

  const toggle = buildMobileToggle();
  const tree = buildNavTree(sections);

  const wrapper = document.createElement('div');
  wrapper.className = 'toc-nav-wrapper';
  wrapper.append(tree);

  el.textContent = '';
  el.append(toggle, wrapper);
}

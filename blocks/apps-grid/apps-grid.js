/**
 * Apps Grid block with "View all" modal.
 *
 * Authoring (DA table):
 *   Row with icon-link + page-link       → featured app (visible in grid)
 *   Row with empty icon + page-link      → "View all" button (opens modal)
 *   Row with "Category: <name>" in cell  → starts a new modal category
 *   Rows after a category header         → modal-only apps in that category
 */

function parseRows(rows) {
  const featured = [];
  const categories = [];
  let currentCat = null;
  let viewAllLabel = 'View all';
  let afterViewAll = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstText = cells[0]?.textContent?.trim() || '';
    const iconLink = cells[0]?.querySelector('a');
    const pageLink = cells[1]?.querySelector('a');

    // Category header row: "Category: Creative Cloud"
    if (firstText.startsWith('Category:')) {
      const catName = firstText.replace('Category:', '').trim();
      currentCat = { title: catName, apps: [] };
      categories.push(currentCat);
      afterViewAll = true;
      return;
    }

    // "View all" row: no icon, has a page link
    if (!iconLink && pageLink) {
      viewAllLabel = pageLink.textContent.trim();
      afterViewAll = true;
      return;
    }

    if (!pageLink) return;

    const app = {
      name: pageLink.textContent.trim(),
      href: pageLink.href,
      icon: iconLink?.href || '',
    };

    if (!afterViewAll) {
      featured.push(app);
    } else if (currentCat) {
      currentCat.apps.push(app);
    }
  });

  return { featured, categories, viewAllLabel };
}

function buildModal(categories, allFeatured) {
  const dialog = document.createElement('dialog');
  dialog.className = 'apps-grid-modal';

  const container = document.createElement('div');
  container.className = 'apps-grid-modal-container';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'apps-grid-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14.25 4.8075L13.1925 3.75L9 7.9425L4.8075 3.75L3.75 4.8075L7.9425 9L3.75 13.1925L4.8075 14.25L9 10.0575L13.1925 14.25L14.25 13.1925L10.0575 9L14.25 4.8075Z" fill="#2c2c2c"/></svg>';
  closeBtn.addEventListener('click', () => dialog.close());

  const content = document.createElement('div');
  content.className = 'apps-grid-modal-content';

  const heading = document.createElement('h2');
  heading.textContent = 'All apps and services';
  content.append(heading);

  // If no categories authored, show all featured apps as a flat list
  const cats = categories.length ? categories : [{ title: '', apps: allFeatured }];

  cats.forEach((cat) => {
    if (cat.title) {
      const catTitle = document.createElement('p');
      catTitle.className = 'apps-grid-modal-category';
      catTitle.textContent = cat.title;
      content.append(catTitle);
    }

    const grid = document.createElement('div');
    grid.className = 'apps-grid-modal-grid';

    cat.apps.forEach((app) => {
      const link = document.createElement('a');
      link.className = 'apps-grid-modal-app';
      link.href = app.href;

      if (app.icon) {
        const img = document.createElement('img');
        img.src = app.icon;
        img.alt = app.name;
        img.loading = 'lazy';
        img.width = 40;
        img.height = 40;
        link.append(img);
      }

      const name = document.createElement('span');
      name.className = 'apps-grid-modal-app-name';
      name.textContent = app.name;
      link.append(name);

      grid.append(link);
    });

    content.append(grid);
  });

  container.append(closeBtn, content);
  dialog.append(container);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  return dialog;
}

function createViewAllIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '36');
  svg.setAttribute('height', '36');
  svg.setAttribute('viewBox', '0 0 36 36');
  svg.setAttribute('fill', 'none');
  svg.innerHTML = `<rect x="4" y="4" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="14" y="4" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="24" y="4" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="4" y="14" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="14" y="14" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="24" y="14" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="4" y="24" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="14" y="24" width="8" height="8" rx="2" fill="#6e6e6e"/>
    <rect x="24" y="24" width="8" height="8" rx="2" fill="#6e6e6e"/>`;
  return svg;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  el.textContent = '';

  const { featured, categories, viewAllLabel } = parseRows(rows);
  const hasModal = categories.length > 0;

  const grid = document.createElement('div');
  grid.className = 'apps-grid-container';

  // Render featured apps
  featured.forEach((app) => {
    const item = document.createElement('a');
    item.className = 'apps-grid-item';
    item.href = app.href;

    const iconWrap = document.createElement('div');
    iconWrap.className = 'apps-grid-icon';
    if (app.icon) {
      const img = document.createElement('img');
      img.src = app.icon;
      img.alt = app.name;
      img.loading = 'lazy';
      iconWrap.append(img);
    }

    const label = document.createElement('span');
    label.className = 'apps-grid-label';
    label.textContent = app.name;

    item.append(iconWrap, label);
    grid.append(item);
  });

  // View All button
  if (hasModal) {
    const item = document.createElement('div');
    item.className = 'apps-grid-item apps-grid-view-all';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const iconWrap = document.createElement('div');
    iconWrap.className = 'apps-grid-icon';
    iconWrap.append(createViewAllIcon());

    const label = document.createElement('span');
    label.className = 'apps-grid-label';
    label.textContent = viewAllLabel;

    item.append(iconWrap, label);

    let dialog;
    const openModal = () => {
      if (!dialog) {
        dialog = buildModal(categories, featured);
        el.append(dialog);
      }
      dialog.showModal();
    };

    item.addEventListener('click', openModal);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openModal();
    });

    grid.append(item);
  }

  el.append(grid);
}

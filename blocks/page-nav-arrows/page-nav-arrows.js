function createNavItem(cell, direction, labelText) {
  const link = cell.querySelector('a');
  if (!link) return null;

  const item = document.createElement('a');
  item.href = link.href;
  item.className = `page-nav-${direction}`;
  item.setAttribute('aria-label', `${labelText} article`);

  const label = document.createElement('span');
  label.className = 'page-nav-label';
  label.textContent = labelText;

  const title = document.createElement('span');
  title.className = 'page-nav-title';
  title.textContent = link.textContent;

  const arrow = document.createElement('span');
  arrow.className = 'page-nav-arrow';
  arrow.innerHTML = direction === 'prev'
    ? '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" fill="none"/></svg>';

  if (direction === 'prev') {
    item.append(arrow, document.createElement('div'));
    item.lastElementChild.append(label, title);
  } else {
    const text = document.createElement('div');
    text.append(label, title);
    item.append(text, arrow);
  }

  return item;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Row 0: prev/next links; Row 1 (optional): custom labels
  const cells = rows[0].children;
  const labelCells = rows[1]?.children;
  const prevLabel = labelCells?.[0]?.textContent?.trim() || 'Previous';
  const nextLabel = labelCells?.[1]?.textContent?.trim() || 'Next';

  const nav = document.createElement('nav');
  nav.className = 'page-nav-container';
  nav.setAttribute('aria-label', 'Page navigation');

  const prev = cells[0] ? createNavItem(cells[0], 'prev', prevLabel) : null;
  const next = cells[1] ? createNavItem(cells[1], 'next', nextLabel) : null;

  if (prev) nav.append(prev);
  if (!prev && next) {
    const spacer = document.createElement('div');
    nav.append(spacer);
  }
  if (next) nav.append(next);

  el.textContent = '';
  el.append(nav);
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  el.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'apps-grid-container';

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconLink = cells[0]?.querySelector('a');
    const pageLink = cells[1]?.querySelector('a');

    if (!pageLink) return;

    const item = document.createElement('a');
    item.className = 'apps-grid-item';
    item.href = pageLink.href;

    const iconWrap = document.createElement('div');
    iconWrap.className = 'apps-grid-icon';

    const name = pageLink.textContent.trim();

    if (iconLink && iconLink.href && !iconLink.href.includes('about:error')) {
      const img = document.createElement('img');
      img.src = iconLink.href;
      img.alt = name;
      img.loading = 'lazy';
      iconWrap.append(img);
    } else {
      // "View All" item - 3x3 grid SVG
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
      iconWrap.append(svg);
      item.classList.add('apps-grid-view-all');
    }

    const label = document.createElement('span');
    label.className = 'apps-grid-label';
    label.textContent = name;

    item.append(iconWrap, label);
    grid.append(item);
  });

  el.append(grid);
}

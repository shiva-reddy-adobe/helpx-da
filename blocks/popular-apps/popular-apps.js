function createAllAppsIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '48');
  svg.setAttribute('height', '48');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('fill', 'none');

  const positions = [
    { x: 8, y: 8 }, { x: 20, y: 8 }, { x: 32, y: 8 },
    { x: 8, y: 20 }, { x: 20, y: 20 }, { x: 32, y: 20 },
    { x: 8, y: 32 }, { x: 20, y: 32 }, { x: 32, y: 32 },
  ];

  positions.forEach((pos) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', pos.x);
    rect.setAttribute('y', pos.y);
    rect.setAttribute('width', '8');
    rect.setAttribute('height', '8');
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', '#6e6e6e');
    svg.append(rect);
  });

  return svg;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'popular-apps-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a');
    const img = row.querySelector('img, picture');
    const links = row.querySelectorAll('a');
    // First link might be an image URL, second link is the actual navigation link
    const imgLink = links.length > 0 && /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(links[0].href) ? links[0] : null;
    const navLink = imgLink && links.length > 1 ? links[1] : (link || null);
    if (!navLink && !img && !imgLink) return;

    const item = document.createElement('a');
    item.className = 'popular-apps-item';
    item.href = navLink ? navLink.href : '#';

    if (img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'popular-apps-icon';
      iconWrap.append(img);
      item.append(iconWrap);
    } else if (imgLink) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'popular-apps-icon';
      const imgEl = document.createElement('img');
      imgEl.src = imgLink.href;
      imgEl.alt = imgLink.textContent.trim();
      iconWrap.append(imgEl);
      item.append(iconWrap);
    }

    const label = document.createElement('span');
    label.className = 'popular-apps-label';
    label.textContent = navLink ? navLink.textContent.trim() : cells[cells.length - 1]?.textContent?.trim() || '';
    item.append(label);

    grid.append(item);
  });

  // Add "All apps" item at the end
  const allAppsItem = document.createElement('a');
  allAppsItem.className = 'popular-apps-item';
  allAppsItem.href = 'https://www.adobe.com/creativecloud/all-apps.html';

  const allAppsIconWrap = document.createElement('div');
  allAppsIconWrap.className = 'popular-apps-icon popular-apps-icon-grid';
  allAppsIconWrap.append(createAllAppsIcon());
  allAppsItem.append(allAppsIconWrap);

  const allAppsLabel = document.createElement('span');
  allAppsLabel.className = 'popular-apps-label';
  allAppsLabel.textContent = 'All apps';
  allAppsItem.append(allAppsLabel);

  grid.append(allAppsItem);

  el.textContent = '';
  el.append(grid);
}

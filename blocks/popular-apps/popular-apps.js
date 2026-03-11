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

  el.textContent = '';
  el.append(grid);
}

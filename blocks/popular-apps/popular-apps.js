export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'popular-apps-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a');
    const img = row.querySelector('img, picture');
    if (!link && !img) return;

    const item = document.createElement('a');
    item.className = 'popular-apps-item';
    item.href = link ? link.href : '#';

    if (img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'popular-apps-icon';
      iconWrap.append(img);
      item.append(iconWrap);
    }

    const label = document.createElement('span');
    label.className = 'popular-apps-label';
    label.textContent = link ? link.textContent.trim() : cells[cells.length - 1]?.textContent?.trim() || '';
    item.append(label);

    grid.append(item);
  });

  el.textContent = '';
  el.append(grid);
}
